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
   * Fetch and clean webpage content
   */
  private async fetchPageContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 10000,
        maxRedirects: 5
      });

      // Clean HTML content for AI processing
      const cleanedContent = this.cleanHTMLContent(response.data);
      
      // Limit content length to avoid token limits
      return cleanedContent.substring(0, 8000);
      
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        throw new Error('Access denied to the website. The site may block automated requests.');
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error('Website not found. Please check the URL.');
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The website may be slow or unavailable.');
      }
      throw new Error(`Failed to fetch webpage: ${error.message}`);
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
   * Extract merchant name from URL
   */
  private extractMerchantFromURL(url: string): string {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Common affiliate platforms
      if (domain.includes('amazon')) return 'Amazon';
      if (domain.includes('clickbank')) return 'ClickBank';
      if (domain.includes('shareasale')) return 'ShareASale';
      if (domain.includes('walmart')) return 'Walmart';
      if (domain.includes('target')) return 'Target';
      if (domain.includes('ebay')) return 'eBay';
      if (domain.includes('shopify')) return 'Shopify Store';
      
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
   * Fallback extraction when AI fails
   */
  private fallbackExtraction(content: string, url: string, merchant: string): ScrapedProductInfo {
    // Simple regex-based extraction for common patterns
    const titleMatch = content.match(/title[^>]*>([^<]+)/i);
    const priceMatch = content.match(/\$(\d+(?:\.\d{2})?)/);
    
    return {
      productName: titleMatch?.[1]?.trim() || 'Product from ' + merchant,
      merchant,
      category: 'general',
      description: 'Product information extracted from ' + new URL(url).hostname,
      price: priceMatch ? `$${priceMatch[1]}` : undefined,
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