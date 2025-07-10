import axios from 'axios';

if (!process.env.DEEPSEEK_API_KEY) {
  console.warn("DEEPSEEK_API_KEY not found. DeepSeek features will be disabled.");
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callDeepSeek(messages: DeepSeekMessage[], temperature = 0.7): Promise<string> {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek API key not configured");
  }

  try {
    const response = await axios.post<DeepSeekResponse>(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages,
        temperature,
        max_tokens: 4000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    throw new Error(`DeepSeek API failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

export async function generateWellnessBlogPostDeepSeek(
  prompt: string,
  category: string
): Promise<{
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  readTime: number;
}> {
  const systemPrompt = `You are an expert wellness content creator specializing in the "Creation of Life" theme that blends ancient wisdom with modern science. Create high-quality blog posts that are:
- Scientifically accurate and evidence-based
- Incorporating ancient practices (Ayurveda, TCM, Greek philosophy, indigenous wisdom)
- Practical and actionable for modern readers
- SEO-optimized with engaging headlines
- Around 800-1200 words in length

Category focus: ${category}

Return ONLY a valid JSON object with: title, content (markdown format), excerpt (150 chars max), tags (comma-separated), readTime (estimated minutes)`;

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Create a wellness blog post about: ${prompt}` }
  ];

  try {
    const response = await callDeepSeek(messages);
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating blog post with DeepSeek:", error);
    throw new Error("Failed to generate blog post content");
  }
}

export async function optimizeContentForSEODeepSeek(
  title: string,
  content: string,
  category: string
): Promise<{
  optimizedTitle: string;
  metaDescription: string;
  keywords: string;
  suggestions: string[];
}> {
  const prompt = `Optimize this wellness content for SEO:

Title: ${title}
Content: ${content.substring(0, 1000)}...
Category: ${category}

Provide SEO optimization as a JSON object with:
1. optimizedTitle: SEO-friendly title (under 60 chars)
2. metaDescription: Compelling meta description (under 160 chars)
3. keywords: Relevant keywords (comma-separated)
4. suggestions: Array of 3-5 improvement suggestions

Focus on wellness/health keywords with good search volume.`;

  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: "You are an SEO expert specializing in wellness and health content optimization. Return only valid JSON."
    },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await callDeepSeek(messages);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error optimizing content with DeepSeek:", error);
    throw new Error("Failed to optimize content for SEO");
  }
}

export async function generateProductDescriptionDeepSeek(
  productName: string,
  category: string,
  features?: string[] | string
): Promise<string> {
  // Handle custom prompt (for URL scraping)
  if (typeof features === 'string' && features.includes('JSON') && features.includes('webpage')) {
    const messages: DeepSeekMessage[] = [
      { role: 'user', content: features }
    ];
    return await callDeepSeek(messages, 0.3);
  }

  // Handle regular product description generation
  const featuresText = Array.isArray(features) ? features.join(", ") : (features || "");
  
  const prompt = `Create a compelling product description for this wellness product:

Product: ${productName}
Category: ${category}
${featuresText ? `Features: ${featuresText}` : ""}

Write a persuasive, benefits-focused description that:
- Highlights key wellness benefits
- Uses emotional triggers for health-conscious consumers
- Includes social proof elements
- Is 100-200 words
- Aligns with holistic wellness philosophy

Focus on transformation and lifestyle enhancement.`;

  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: "You are a wellness copywriting expert who creates compelling product descriptions that drive conversions."
    },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await callDeepSeek(messages);
    return response.trim();
  } catch (error) {
    console.error("Error generating product description with DeepSeek:", error);
    throw new Error("Failed to generate product description");
  }
}

export async function analyzeMoodAndSuggestActivitiesDeepSeek(
  moodData: {
    mood: string;
    energy: number;
    stress: number;
    goals: string[];
  }
): Promise<{
  analysis: string;
  activities: Array<{
    name: string;
    duration: string;
    description: string;
    benefits: string[];
  }>;
  tips: string[];
}> {
  const prompt = `Based on the user's current state:
- Mood: ${moodData.mood}
- Energy Level: ${moodData.energy}/10
- Stress Level: ${moodData.stress}/10
- Goals: ${moodData.goals.join(", ")}

Provide personalized wellness recommendations as a JSON object with:
1. analysis: Brief mood analysis and insights
2. activities: Array of 3-5 recommended activities with name, duration, description, and benefits
3. tips: Array of 3-5 quick wellness tips

Focus on holistic wellness approaches combining ancient wisdom and modern science.`;

  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: "You are a wellness expert combining ancient wisdom with modern science. Provide practical, evidence-based recommendations in JSON format."
    },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await callDeepSeek(messages);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error analyzing mood with DeepSeek:", error);
    throw new Error("Failed to analyze mood and suggest activities");
  }
}