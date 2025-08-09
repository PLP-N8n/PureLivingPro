import OpenAI from "openai";

const openai: OpenAI | null = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateWellnessPlan(userProfile: {
  goals: string[];
  experienceLevel: string;
  lifestyle: string;
  preferences: string[];
}): Promise<{
  title: string;
  weeklyFocus: string;
  dailyPlan: Array<{
    day: number;
    theme: string;
    morningActivity: string;
    afternoonActivity: string;
    eveningAffirmation: string;
  }>;
}> {
  if (!openai) {
    return {
      title: "Starter 7-Day Wellness Plan",
      weeklyFocus: "Build gentle, sustainable habits",
      dailyPlan: Array.from({ length: 7 }).map((_, i) => ({
        day: i + 1,
        theme: "Balance",
        morningActivity: "10-minute walk",
        afternoonActivity: "Stretching break",
        eveningAffirmation: "I support my health with small steps",
      })),
    };
  }
  const prompt = `
Create a personalized 7-day wellness plan for a user with the following profile:
- Goals: ${userProfile.goals.join(", ")}
- Experience Level: ${userProfile.experienceLevel}
- Lifestyle: ${userProfile.lifestyle}
- Preferences: ${userProfile.preferences.join(", ")}

The plan should be:
- Encouraging and achievable
- Tailored to their experience level and lifestyle
- Focused on their specific goals
- Include daily themes that are motivating

Return the response in JSON format with the following structure:
{
  "title": "A catchy, personalized title for the 7-day plan",
  "weeklyFocus": "A brief summary of the main goal for the week",
  "dailyPlan": [
    {
      "day": 1,
      "theme": "Motivating theme for the day",
      "morningActivity": "A specific, actionable morning activity",
      "afternoonActivity": "A specific, actionable afternoon activity",
      "eveningAffirmation": "A positive affirmation for the evening"
    }
    // ... for all 7 days
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating wellness plan:", error);
    throw new Error("Failed to generate wellness plan");
  }
}

export async function generatePersonalizedContent(
  userProfile: {
    goals: string[];
    experienceLevel: string;
    lifestyle: string;
    preferences: string[];
  },
  contentType: "article" | "tip" | "recommendation"
): Promise<{
  title: string;
  content: string;
  category: string;
}> {
  if (!openai) {
    return {
      title: "Personalized Tip",
      content: "Focus on hydration, light movement, and consistent sleep.",
      category: "wellness",
    };
  }
  const prompt = `
Generate personalized ${contentType} content for a wellness platform user with:
- Goals: ${userProfile.goals.join(", ")}
- Experience Level: ${userProfile.experienceLevel}
- Lifestyle: ${userProfile.lifestyle}
- Preferences: ${userProfile.preferences.join(", ")}

Create engaging, helpful content that directly addresses their needs and goals.
The content should be evidence-based and actionable.

Return the response in JSON format:
{
  "title": "Engaging title for the ${contentType}",
  "content": "The main content (markdown format for articles, concise for tips)",
  "category": "Appropriate category (e.g., nutrition, fitness, mindfulness, etc.)"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating personalized content:", error);
    throw new Error("Failed to generate personalized content");
  }
}

export async function analyzeMoodAndSuggestActivities(
  mood: number,
  energy: number,
  recentActivities: string[]
): Promise<{
  moodAnalysis: string;
  suggestions: string[];
  affirmation: string;
}> {
  if (!openai) {
    return {
      moodAnalysis: "You’re trending toward balance—keep things simple and compassionate.",
      suggestions: ["5-minute breathing", "Short outdoor walk", "Hydrate", "Gentle stretch"],
      affirmation: "Small steps count. I’m proud of my progress.",
    };
  }
  const prompt = `
Analyze a user's wellness state and provide personalized suggestions:
- Current mood: ${mood}/5
- Energy level: ${energy}/5
- Recent activities: ${recentActivities.join(", ")}

Provide:
1. Brief mood analysis
2. 3-5 specific activity suggestions based on their current state
3. A positive affirmation

Return in JSON format:
{
  "moodAnalysis": "Brief analysis of their current state",
  "suggestions": ["Activity 1", "Activity 2", "Activity 3", "Activity 4", "Activity 5"],
  "affirmation": "A personalized, uplifting affirmation"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing mood:", error);
    throw new Error("Failed to analyze mood and generate suggestions");
  }
}

export async function generateWellnessBlogPost(
  prompt: string,
  category: string
): Promise<{
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  readTime: number;
}> {
  if (!openai) {
    return {
      title: "Holistic Wellness Guide",
      content: "# Wellness Basics\n\nStart with movement, hydration, and mindful breathing.",
      excerpt: "Simple steps to support your wellness journey.",
      tags: "wellness, holistic, health",
      readTime: 6,
    };
  }
  try {
    const systemPrompt = `You are an expert wellness content creator specializing in the "Creation of Life" theme that blends ancient wisdom with modern science. Create high-quality blog posts that are:
    - Scientifically accurate and evidence-based
    - Incorporating ancient practices (Ayurveda, TCM, Greek philosophy, indigenous wisdom)
    - Practical and actionable for modern readers
    - SEO-optimized with engaging headlines
    - Around 800-1200 words in length
    
    Category focus: ${category}
    
    Return JSON with: title, content (markdown format), excerpt (150 chars max), tags (comma-separated), readTime (estimated minutes)`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a wellness blog post about: ${prompt}` },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post content");
  }
}

export async function optimizeContentForSEO(
  title: string,
  content: string,
  category: string
): Promise<{
  optimizedTitle: string;
  metaDescription: string;
  keywords: string;
  suggestions: string[];
}> {
  if (!openai) {
    return {
      optimizedTitle: title,
      metaDescription: "Practical wellness guidance and tips.",
      keywords: "wellness, health, holistic, lifestyle",
      suggestions: ["Use clear headings", "Add internal links", "Tighten meta description"],
    };
  }
  try {
    const prompt = `Optimize this wellness content for SEO:
    
    Title: ${title}
    Content: ${content.substring(0, 1000)}...
    Category: ${category}
    
    Provide SEO optimization in JSON format with:
    1. optimizedTitle: SEO-friendly title (under 60 chars)
    2. metaDescription: Compelling meta description (under 160 chars)
    3. keywords: Relevant keywords (comma-separated)
    4. suggestions: Array of 3-5 improvement suggestions
    
    Focus on wellness/health keywords with good search volume.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in wellness and health content optimization.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error optimizing content:", error);
    throw new Error("Failed to optimize content for SEO");
  }
}

export async function generateProductDescription(
  productName: string,
  category: string,
  features?: string[]
): Promise<string> {
  if (!openai) {
    return `${productName} is a quality ${category.toLowerCase()} designed to support your wellness journey.`;
  }
  try {
    const prompt = `Create a compelling product description for this wellness product:
    
    Product: ${productName}
    Category: ${category}
    ${features ? `Features: ${features.join(", ")}` : ""}
    
    Write a persuasive, benefits-focused description that:
    - Highlights key wellness benefits
    - Uses emotional triggers for health-conscious consumers
    - Includes social proof elements
    - Is 100-200 words
    - Aligns with holistic wellness philosophy
    
    Focus on transformation and lifestyle enhancement.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a wellness copywriting expert who creates compelling product descriptions that drive conversions.",
        },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating product description:", error);
    throw new Error("Failed to generate product description");
  }
}

export async function generateAIMealPlan(params: {
  dietaryPreferences: string[];
  healthGoals: string[];
  allergies: string[];
  calorieTarget: number;
  mealsPerDay: number;
  cookingTime: string;
  servingSize: number;
  additionalNotes: string;
}): Promise<any> {
  if (!openai) {
    return {
      id: `meal-plan-${Date.now()}`,
      title: "Personalized 7-Day Meal Plan",
      description: "Balanced meals focused on whole foods and hydration.",
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      nutritionSummary: { totalCalories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      shoppingList: [],
      preparationTips: ["Prep grains in batches", "Keep fruit handy", "Hydrate regularly"],
      createdAt: new Date(),
    };
  }
  try {
    const prompt = `Create a comprehensive 7-day meal plan with the following requirements:

Dietary Preferences: ${params.dietaryPreferences.join(", ") || "None"}
Health Goals: ${params.healthGoals.join(", ") || "General wellness"}
Allergies: ${params.allergies.join(", ") || "None"}
Daily Calorie Target: ${params.calorieTarget}
Meals Per Day: ${params.mealsPerDay}
Cooking Time: ${params.cookingTime} minutes
Serving Size: ${params.servingSize} people
Additional Notes: ${params.additionalNotes || "None"}

Please provide a detailed meal plan in JSON format with the following structure:
{
  "id": "unique-id",
  "title": "Personalized 7-Day Meal Plan",
  "description": "Brief description of the meal plan",
  "meals": {
    "breakfast": [
      {
        "name": "Meal name",
        "description": "Brief description",
        "calories": 350,
        "prepTime": 15,
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": ["step1", "step2"],
        "nutritionInfo": {
          "protein": 20,
          "carbs": 45,
          "fat": 12,
          "fiber": 8
        }
      }
    ],
    "lunch": [...],
    "dinner": [...],
    "snacks": [...]
  },
  "nutritionSummary": {
    "totalCalories": ${params.calorieTarget},
    "protein": 150,
    "carbs": 200,
    "fat": 80,
    "fiber": 35
  },
  "shoppingList": ["ingredient1", "ingredient2", "ingredient3"],
  "preparationTips": ["tip1", "tip2", "tip3"]
}

Ensure all meals align with the dietary preferences and health goals. Make the meals diverse, nutritious, and achievable within the specified cooking time.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const mealPlanData = JSON.parse(response.choices[0].message.content || "{}");
    
    // Add a unique ID and timestamp
    mealPlanData.id = `meal-plan-${Date.now()}`;
    mealPlanData.createdAt = new Date();
    
    return mealPlanData;
  } catch (error) {
    console.error("Error generating AI meal plan:", error);
    throw new Error("Failed to generate meal plan");
  }
}
