import axios from 'axios';

const hasDeepseek = !!process.env.DEEPSEEK_API_KEY;

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
  if (!hasDeepseek) {
    return "DeepSeek not configured.";
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
    return "DeepSeek error.";
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
  if (!hasDeepseek) {
    return {
      title: "Holistic Wellness Guide",
      content: `# ${category}\n\nPractical steps to support your wellness journey.`,
      excerpt: "Simple, sustainable strategies for better health.",
      tags: "wellness, holistic, health",
      readTime: 6,
    };
  }

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
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        title: "Holistic Wellness Guide",
        content: `# ${category}\n\nPractical steps to support your wellness journey.`,
        excerpt: "Simple, sustainable strategies for better health.",
        tags: "wellness, holistic, health",
        readTime: 6,
      };
    }
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      title: "Holistic Wellness Guide",
      content: `# ${category}\n\nPractical steps to support your wellness journey.`,
      excerpt: "Simple, sustainable strategies for better health.",
      tags: "wellness, holistic, health",
      readTime: 6,
    };
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
  if (!hasDeepseek) {
    return {
      optimizedTitle: `${title}`,
      metaDescription: `Discover practical wellness tips on ${category}.`,
      keywords: "wellness, health, holistic, lifestyle",
      suggestions: ["Use clear headings", "Add internal links", "Tighten meta description"],
    };
  }

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
      return {
        optimizedTitle: `${title}`,
        metaDescription: `Discover practical wellness tips on ${category}.`,
        keywords: "wellness, health, holistic, lifestyle",
        suggestions: ["Use clear headings", "Add internal links", "Tighten meta description"],
      };
    }
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      optimizedTitle: `${title}`,
      metaDescription: `Discover practical wellness tips on ${category}.`,
      keywords: "wellness, health, holistic, lifestyle",
      suggestions: ["Use clear headings", "Add internal links", "Tighten meta description"],
    };
  }
}

export async function generateProductDescriptionDeepSeek(
  productName: string,
  category: string,
  features?: string[] | string
): Promise<string> {
  if (!hasDeepseek) {
    return `${productName} is a quality ${category.toLowerCase()} designed to support your wellness journey.`;
  }

  if (typeof features === 'string' && features.includes('JSON') && features.includes('webpage')) {
    const messages: DeepSeekMessage[] = [
      { role: 'user', content: features }
    ];
    return await callDeepSeek(messages, 0.3);
  }

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
  } catch {
    return `${productName} is a quality ${category.toLowerCase()} designed to support your wellness journey.`;
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
  if (!hasDeepseek) {
    return {
      analysis: "You're building healthy consistency. Keep it simple and compassionate.",
      activities: [
        { name: "Walk", duration: "20 minutes", description: "Gentle outdoor walk", benefits: ["Mood", "Energy"] },
        { name: "Breathing", duration: "5 minutes", description: "Box breathing", benefits: ["Calm", "Focus"] },
      ],
      tips: ["Hydrate", "Stretch", "Sleep routine"],
    };
  }

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
      return {
        analysis: "You're building healthy consistency. Keep it simple and compassionate.",
        activities: [
          { name: "Walk", duration: "20 minutes", description: "Gentle outdoor walk", benefits: ["Mood", "Energy"] },
          { name: "Breathing", duration: "5 minutes", description: "Box breathing", benefits: ["Calm", "Focus"] },
        ],
        tips: ["Hydrate", "Stretch", "Sleep routine"],
      };
    }
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      analysis: "You're building healthy consistency. Keep it simple and compassionate.",
      activities: [
        { name: "Walk", duration: "20 minutes", description: "Gentle outdoor walk", benefits: ["Mood", "Energy"] },
        { name: "Breathing", duration: "5 minutes", description: "Box breathing", benefits: ["Calm", "Focus"] },
      ],
      tips: ["Hydrate", "Stretch", "Sleep routine"],
    };
  }
}
