import axios from 'axios';
import { generateProductDescriptionDeepSeek } from '../deepseek';
import { generateProductDescription } from '../openai';

interface ScrapedProductInfo {
  productName: string;
  merchant: string;
  category: string;
  description: string;
  price?: string;
  imageUrl?: string;
  commission?: number;
}

export class URLScraper {
  /**
   * Scrape a URL and extract product information using AI
   */
  async scrapeProductFromURL(url: string, aiProvider: 'deepseek' | 'openai' = 'deepseek'): Promise<ScrapedProductInfo> {
    try {
      console.log(`🔍 Scraping URL: ${url}`);

      // Fetch the webpage content
      const pageContent = await this.fetchPageContent(url);
      
      // Extract product info using AI
      const productInfo = await this.extractProductInfoWithAI(pageContent, url, aiProvider);
      
      console.log(`✅ Successfully scraped product: ${productInfo.productName}`);
      return productInfo;

    } catch (error) {
      console.error(`❌ Error scraping URL ${url}:`, error);
      throw new Error(`Failed to scrape product information: ${error.message}`);
    }
  }

  /**
   * Resolve short URLs and get final destination
   */
  private async resolveUrl(url: string): Promise<string> {
    try {
      // Handle common short URL services
      if (url.includes('amzn.to') || url.includes('bit.ly') || url.includes('tinyurl.com')) {
        const response = await axios.head(url, {
          maxRedirects: 10,
          timeout: 5000
        });
        return response.request.res.responseUrl || url;
      }
      return url;
    } catch (error) {
      console.log('URL resolution failed, using original URL:', error.message);
      return url;
    }
  }

  /**
   * Fetch and clean webpage content with enhanced error handling
   */
  private async fetchPageContent(url: string): Promise<string> {
    // First, try to resolve any short URLs
    const resolvedUrl = await this.resolveUrl(url);
    console.log(`Resolved URL: ${resolvedUrl}`);

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
    ];

    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    try {
      const response = await axios.get(resolvedUrl, {
        headers: {
          'User-Agent': randomUserAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        timeout: 15000,
        maxRedirects: 10,
        validateStatus: (status) => status < 500 // Accept redirects and client errors
      });

      // Check if we got a valid response
      if (!response.data || response.data.length < 100) {
        throw new Error('Empty or insufficient content received from website');
      }

      // Clean HTML content for AI processing
      const cleanedContent = this.cleanHTMLContent(response.data);
      
      // Limit content length to avoid token limits
      return cleanedContent.substring(0, 10000);
      
    } catch (error) {
      console.error('Primary fetch failed, trying fallback method:', error.message);
      
      // Fallback: Try with minimal headers
      try {
        const fallbackResponse = await axios.get(resolvedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ProductBot/1.0)',
          },
          timeout: 10000,
          maxRedirects: 5
        });
        
        return this.cleanHTMLContent(fallbackResponse.data).substring(0, 10000);
        
      } catch (fallbackError) {
        // Enhanced error messages
        if (error.response?.status === 403 || error.response?.status === 401) {
          throw new Error('Website blocks automated access. Try using the full Amazon product URL instead of short links.');
        }
        if (error.response?.status === 503 || error.response?.status === 500) {
          throw new Error('Website is temporarily unavailable. Please try again later.');
        }
        if (error.code === 'ENOTFOUND') {
          throw new Error('Website not found. Please check the URL is correct.');
        }
        if (error.code === 'ETIMEDOUT') {
          throw new Error('Request timed out. The website may be slow or blocking requests.');
        }
        
        throw new Error(`Unable to access website. Error: ${error.response?.status || error.code || error.message}`);
      }
    }
  }

  /**
   * Clean HTML content for AI processing
   */
  private cleanHTMLContent(html: string): string {
    // Remove script and style tags
    let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML tags but keep the text content
    cleaned = cleaned.replace(/<[^>]*>/g, ' ');
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Remove common noise
    cleaned = cleaned.replace(/\b(cookie|privacy|terms|conditions|javascript|loading|menu|navigation|footer|header)\b/gi, '');
    
    return cleaned;
  }

  /**
   * Extract product information using AI
   */
  private async extractProductInfoWithAI(content: string, url: string, aiProvider: 'deepseek' | 'openai'): Promise<ScrapedProductInfo> {
    const merchant = this.extractMerchantFromURL(url);
    
    const prompt = `
Analyze this webpage content from ${url} and extract product information. Return a JSON object with the following fields:

{
  "productName": "Clear, concise product name",
  "merchant": "${merchant}",
  "category": "Product category (supplements, fitness, beauty, wellness, etc.)",
  "description": "Brief 1-2 sentence product description highlighting key benefits",
  "price": "Product price if found (format: $XX.XX)",
  "imageUrl": "Main product image URL if found",
  "commission": "Estimated commission rate as percentage (common rates: Amazon 3-8%, ClickBank 50-75%, ShareASale 5-20%)"
}

Content to analyze:
${content}

Focus on finding:
- Product title/name
- Key features and benefits
- Price information
- Category classification
- Product images
- Any commission/affiliate information

Return only valid JSON, no explanations.`;

    try {
      let result: string;
      
      if (aiProvider === 'deepseek') {
        result = await generateProductDescriptionDeepSeek('', '', prompt);
      } else {
        result = await generateProductDescription('', '', prompt);
      }

      // Parse the AI response
      const cleanedResult = result.replace(/```json\n?|\n?```/g, '').trim();
      const productInfo = JSON.parse(cleanedResult);

      // Validate and set defaults
      return {
        productName: productInfo.productName || 'Unknown Product',
        merchant: productInfo.merchant || merchant,
        category: productInfo.category || 'general',
        description: productInfo.description || 'Product description not available',
        price: productInfo.price || undefined,
        imageUrl: productInfo.imageUrl || undefined,
        commission: this.parseCommission(productInfo.commission) || this.getDefaultCommission(merchant)
      };

    } catch (error) {
      console.error('AI extraction failed, using fallback method:', error);
      return this.fallbackExtraction(content, url, merchant);
    }
  }

  /**
   * Extract merchant name from URL with enhanced detection
   */
  private extractMerchantFromURL(url: string): string {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Common affiliate platforms and short URLs
      if (domain.includes('amazon') || url.includes('amzn.to')) return 'Amazon';
      if (domain.includes('clickbank')) return 'ClickBank';
      if (domain.includes('shareasale')) return 'ShareASale';
      if (domain.includes('walmart')) return 'Walmart';
      if (domain.includes('target')) return 'Target';
      if (domain.includes('ebay')) return 'eBay';
      if (domain.includes('shopify')) return 'Shopify Store';
      if (domain.includes('etsy')) return 'Etsy';
      if (domain.includes('alibaba')) return 'Alibaba';
      if (domain.includes('aliexpress')) return 'AliExpress';
      if (domain.includes('bestbuy')) return 'Best Buy';
      if (domain.includes('homedepot')) return 'Home Depot';
      if (domain.includes('lowes')) return 'Lowe\'s';
      
      // Extract main domain name
      const domainParts = domain.replace('www.', '').split('.');
      return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
      
    } catch (error) {
      return 'Unknown Merchant';
    }
  }

  /**
   * Parse commission rate from AI response
   */
  private parseCommission(commission: any): number | undefined {
    if (typeof commission === 'number') return commission;
    if (typeof commission === 'string') {
      const match = commission.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : undefined;
    }
    return undefined;
  }

  /**
   * Get default commission rates by merchant
   */
  private getDefaultCommission(merchant: string): number {
    const defaultRates: { [key: string]: number } = {
      'Amazon': 4,
      'ClickBank': 60,
      'ShareASale': 10,
      'Walmart': 3,
      'Target': 5,
      'eBay': 4,
      'Shopify Store': 15
    };
    
    return defaultRates[merchant] || 5;
  }

  /**
   * Enhanced fallback extraction when AI fails
   */
  private fallbackExtraction(content: string, url: string, merchant: string): ScrapedProductInfo {
    console.log('Using fallback extraction method');
    
    // Enhanced regex patterns for better extraction
    const titlePatterns = [
      /<title[^>]*>([^<]+)/i,
      /<h1[^>]*>([^<]+)/i,
      /product[_\s-]?title[^>]*>([^<]+)/i,
      /name["']?\s*:\s*["']([^"']+)/i
    ];
    
    const pricePatterns = [
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
      /price["']?\s*:\s*["']?\$?(\d+(?:\.\d{2})?)/i,
      /(\d+\.\d{2})\s*(?:USD|dollars?)/i
    ];
    
    const imagePatterns = [
      /<img[^>]+src=["']([^"']*product[^"']*)/i,
      /<img[^>]+src=["']([^"']*\.(?:jpg|jpeg|png|webp)[^"']*)/i
    ];
    
    let productName = 'Product from ' + merchant;
    let price: string | undefined;
    let imageUrl: string | undefined;
    
    // Try to extract title
    for (const pattern of titlePatterns) {
      const match = content.match(pattern);
      if (match?.[1]) {
        productName = match[1].trim().replace(/\s+/g, ' ').substring(0, 100);
        break;
      }
    }
    
    // Try to extract price
    for (const pattern of pricePatterns) {
      const match = content.match(pattern);
      if (match?.[1]) {
        const cleanPrice = match[1].replace(/,/g, '');
        if (!isNaN(parseFloat(cleanPrice))) {
          price = `$${cleanPrice}`;
          break;
        }
      }
    }
    
    // Try to extract image
    for (const pattern of imagePatterns) {
      const match = content.match(pattern);
      if (match?.[1] && match[1].startsWith('http')) {
        imageUrl = match[1];
        break;
      }
    }
    
    // Determine category based on URL and content
    let category = 'general';
    const contentLower = content.toLowerCase();
    if (contentLower.includes('supplement') || contentLower.includes('vitamin')) category = 'supplements';
    else if (contentLower.includes('fitness') || contentLower.includes('workout')) category = 'fitness';
    else if (contentLower.includes('beauty') || contentLower.includes('skincare')) category = 'beauty';
    else if (contentLower.includes('wellness') || contentLower.includes('health')) category = 'wellness';
    
    return {
      productName,
      merchant,
      category,
      description: `Product information extracted from ${new URL(url).hostname}. Please verify details manually.`,
      price,
      imageUrl,
      commission: this.getDefaultCommission(merchant)
    };
  }

  /**
   * Validate URL format
   */
  isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if URL is likely an affiliate/product link
   */
  isProductURL(url: string): boolean {
    const productIndicators = [
      '/dp/', '/product/', '/p/', '/item/',
      'amazon.com', 'clickbank.net', 'shareasale.com',
      'walmart.com', 'target.com', 'ebay.com'
    ];
    
    return productIndicators.some(indicator => 
      url.toLowerCase().includes(indicator)
    );
  }
}

export const urlScraper = new URLScraper();