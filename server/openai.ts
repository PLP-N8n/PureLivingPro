import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
