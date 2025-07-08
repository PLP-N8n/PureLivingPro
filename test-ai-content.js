import { generateWellnessBlogPostDeepSeek } from './server/deepseek.js';

async function testAIGeneration() {
  console.log('Testing AI content generation with DeepSeek...');
  
  try {
    const result = await generateWellnessBlogPostDeepSeek(
      "5 Morning Rituals for Natural Energy", 
      "Wellness"
    );
    
    console.log('Generated content:');
    console.log('Title:', result.title);
    console.log('Content length:', result.content.length);
    console.log('Excerpt:', result.excerpt);
    console.log('Tags:', result.tags);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAIGeneration();