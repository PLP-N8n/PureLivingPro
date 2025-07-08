import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateWellnessBlogPostGemini(
  title: string,
  category: string,
  tone: string = "informative and encouraging"
): Promise<{ title: string; content: string; excerpt: string; tags: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a comprehensive wellness blog post with the following specifications:

Title: "${title}"
Category: ${category}
Tone: ${tone}

Requirements:
- 800-1200 words of high-quality, evidence-based content
- Include practical, actionable advice
- Write in a warm, approachable tone that empowers readers
- Structure with clear headings and subheadings
- Include specific tips, strategies, or steps readers can implement
- Focus on natural, holistic approaches to wellness
- Ensure content is original and engaging

Please format the response as JSON with these fields:
{
  "title": "The exact title",
  "content": "Full blog post content in markdown format with proper headings",
  "excerpt": "A compelling 2-3 sentence summary for previews",
  "tags": ["array", "of", "relevant", "tags"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch {
      // If JSON parsing fails, create structured response
      return {
        title,
        content: text,
        excerpt: `Discover practical insights and evidence-based strategies for ${category.toLowerCase()}. Learn natural approaches to enhance your wellness journey.`,
        tags: [category.toLowerCase(), "wellness", "natural-health", "holistic"]
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate content with Gemini: ${error.message}`);
  }
}

export async function optimizeContentForSEOGemini(
  content: string,
  targetKeywords: string[]
): Promise<{ optimizedContent: string; metaDescription: string; suggestedTitle: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Optimize this wellness content for SEO while maintaining its natural flow and readability:

Content: "${content}"
Target Keywords: ${targetKeywords.join(", ")}

Please:
1. Naturally integrate the target keywords throughout the content
2. Create an SEO-optimized meta description (150-160 characters)
3. Suggest an improved title that includes primary keywords
4. Maintain the helpful, informative tone
5. Ensure keyword density is natural (not stuffed)

Return as JSON:
{
  "optimizedContent": "SEO-optimized version",
  "metaDescription": "Meta description for search engines",
  "suggestedTitle": "SEO-friendly title"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      return {
        optimizedContent: content,
        metaDescription: `Discover evidence-based wellness insights featuring ${targetKeywords.slice(0, 2).join(" and ")}. Natural approaches to health and well-being.`,
        suggestedTitle: `${targetKeywords[0]} Guide: Natural Wellness Strategies`
      };
    }
  } catch (error) {
    console.error("Gemini SEO optimization error:", error);
    throw new Error(`Failed to optimize content: ${error.message}`);
  }
}

export async function generateProductDescriptionGemini(
  productName: string,
  category: string,
  benefits: string[]
): Promise<{ description: string; keyFeatures: string[]; targetAudience: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a compelling product description for this wellness product:

Product: ${productName}
Category: ${category}
Key Benefits: ${benefits.join(", ")}

Please create:
1. A persuasive 2-3 paragraph description that highlights benefits and quality
2. A list of key features (3-5 bullet points)
3. Target audience description

Focus on:
- Natural, science-backed benefits
- Quality and purity
- How it fits into a healthy lifestyle
- Emotional benefits and wellness goals

Return as JSON:
{
  "description": "Compelling product description",
  "keyFeatures": ["feature 1", "feature 2", "feature 3"],
  "targetAudience": "Description of ideal customer"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      return {
        description: `${productName} is a premium ${category.toLowerCase()} designed to support your wellness journey. Carefully crafted with natural ingredients, this product delivers ${benefits.join(", ")} to help you achieve your health goals naturally.`,
        keyFeatures: benefits.slice(0, 3),
        targetAudience: `Health-conscious individuals seeking natural ${category.toLowerCase()} solutions`
      };
    }
  } catch (error) {
    console.error("Gemini product description error:", error);
    throw new Error(`Failed to generate product description: ${error.message}`);
  }
}