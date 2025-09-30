export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  try {
    const { goal, background, timeAvailable, learningStyle } = req.body;

    console.log('Received data:', { goal, background, timeAvailable, learningStyle });

    // Validate required fields
    if (!goal || !background || !timeAvailable || !learningStyle) {
      return res.status(400).json({ 
        error: 'Missing required fields: goal, background, timeAvailable, learningStyle' 
      });
    }

    // Generate roadmap using AI service
    const aiResponse = await generateRoadmapWithAI({
      goal,
      background, 
      timeAvailable,
      learningStyle
    });

    console.log('AI Response generated successfully');

    res.status(200).json(aiResponse);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate roadmap',
      message: error.message 
    });
  }
}

// AI Service Integration
async function generateRoadmapWithAI(learningData) {
  const { goal, background, timeAvailable, learningStyle } = learningData;

  // If OpenAI API key is available, use real AI
  if (process.env.OPENAI_API_KEY) {
    return await generateWithOpenAI(learningData);
  } else {
    // Fallback to intelligent mock data
    return generateIntelligentMockRoadmap(learningData);
  }
}

// Real OpenAI Integration
async function generateWithOpenAI(learningData) {
  const { goal, background, timeAvailable, learningStyle } = learningData;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert learning path designer. Create structured, practical learning roadmaps.
            Always return valid JSON with this exact structure:
            {
              "title": "string",
              "estimatedDuration": "string", 
              "personalizedMessage": "string",
              "modules": [
                {
                  "id": 1,
                  "title": "string",
                  "description": "string",
                  "difficulty": "Beginner|Intermediate|Advanced",
                  "duration": "string",
                  "topics": ["string", "string"]
                }
              ],
              "resources": [
                {
                  "type": "course|video|book|documentation",
                  "title": "string", 
                  "provider": "string",
                  "url": "string",
                  "duration": "string",
                  "free": boolean
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Create a personalized learning roadmap with these parameters:
            - Learning Goal: ${goal}
            - Current Knowledge Level: ${background}
            - Weekly Time Available: ${timeAvailable}
            - Preferred Learning Style: ${learningStyle}
            
            Make it practical, structured, and tailored to the specified learning style.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;
    
    // Parse JSON from AI response
    const roadmap = JSON.parse(aiContent);
    return roadmap;

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock data if AI fails
    return generateIntelligentMockRoadmap(learningData);
  }
}

// Intelligent Mock Data Generator
function generateIntelligentMockRoadmap(data) {
  const { goal, background, timeAvailable, learningStyle } = data;
  
  // Calculate duration based on time available
  const durationMap = {
    '1-2h/week': '12-16 weeks',
    '3-5h/week': '8-12 weeks', 
    '6-10h/week': '6-8 weeks',
    '10+h/week': '4-6 weeks'
  };

  // Difficulty adjustment based on background
  const getModuleDifficulty = (baseIndex, background) => {
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    if (background === 'Beginner') return difficulties[baseIndex];
    if (background === 'Intermediate') return difficulties[Math.min(baseIndex + 1, 2)];
    return difficulties[Math.min(baseIndex + 2, 2)];
  };

  const modules = [
    {
      id: 1,
      title: 'Foundation & Fundamentals',
      description: 'Build core understanding and essential principles. Establish strong foundational knowledge.',
      difficulty: getModuleDifficulty(0, background),
      duration: background === 'Beginner' ? '3-4 weeks' : '2-3 weeks',
      topics: [
        'Basic concepts and terminology',
        'Fundamental principles',
        'Setting up development environment',
        'Core building blocks'
      ]
    },
    {
      id: 2,
      title: 'Core Concepts & Techniques',
      description: 'Dive deeper into essential methods, patterns, and practical applications.',
      difficulty: getModuleDifficulty(1, background),
      duration: '3-4 weeks',
      topics: [
        'Key techniques and methodologies',
        'Practical applications',
        'Common patterns and best practices',
        'Hands-on exercises'
      ]
    },
    {
      id: 3,
      title: 'Advanced Applications & Projects',
      description: 'Apply knowledge to complex scenarios, real projects, and advanced concepts.',
      difficulty: getModuleDifficulty(2, background),
      duration: '3-5 weeks',
      topics: [
        'Real-world project implementation',
        'Advanced patterns and optimization',
        'Troubleshooting and debugging',
        'Performance optimization'
      ]
    }
  ];

  // Personalized message
  const personalizedMessage = `Customized for ${background.toLowerCase()} level with ${learningStyle.toLowerCase()} learning preference. Optimized for ${timeAvailable}.`;

  // Resources based on learning style
  const resources = generateResources(goal, learningStyle);

  return {
    title: `Master ${goal}`,
    estimatedDuration: durationMap[timeAvailable] || '8-12 weeks',
    personalizedMessage,
    modules,
    resources
  };
}

// Resource generator
function generateResources(goal, learningStyle) {
  const baseResources = [
    {
      type: 'course',
      title: `Complete ${goal} Masterclass`,
      provider: 'Udemy',
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(goal)}`,
      duration: '10+ hours',
      free: false
    },
    {
      type: 'video',
      title: `${goal} Crash Course`,
      provider: 'YouTube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(goal + ' tutorial')}`,
      duration: '2-3 hours',
      free: true
    },
    {
      type: 'documentation',
      title: 'Official Documentation & Guides',
      provider: 'MDN Web Docs',
      url: 'https://developer.mozilla.org',
      duration: 'Ongoing',
      free: true
    },
    {
      type: 'book',
      title: `${goal} - The Complete Guide`,
      provider: 'Amazon',
      url: `https://www.amazon.com/s?k=${encodeURIComponent(goal + ' programming')}`,
      pages: '300-400',
      free: false
    }
  ];

  return baseResources;
}
