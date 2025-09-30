export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  try {
    const { goal, background, timeAvailable, learningStyle } = req.body;

    if (!goal || !background || !timeAvailable || !learningStyle) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const roadmap = await generateRoadmapWithAI({
      goal,
      background, 
      timeAvailable,
      learningStyle
    });

    res.status(200).json(roadmap);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate roadmap',
      message: error.message 
    });
  }
}

async function generateRoadmapWithAI(learningData) {
  const { goal, background, timeAvailable, learningStyle } = learningData;

  if (process.env.OPENAI_API_KEY) {
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
              content: `You are an expert learning path designer. Create structured learning roadmaps. Return valid JSON with: title, estimatedDuration, personalizedMessage, modules array with id, title, description, difficulty, duration, topics array, and resources array.`
            },
            {
              role: 'user',
              content: `Create a learning roadmap for: ${JSON.stringify(learningData)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) throw new Error('OpenAI API failed');
      
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
      
    } catch (error) {
      console.error('OpenAI error:', error);
    }
  }

  return generateIntelligentMockRoadmap(learningData);
}

function generateIntelligentMockRoadmap(data) {
  const { goal, background, timeAvailable, learningStyle } = data;
  
  const durationMap = {
    '1-2h/week': '12-16 weeks',
    '3-5h/week': '8-12 weeks', 
    '6-10h/week': '6-8 weeks',
    '10+h/week': '4-6 weeks'
  };

  const modules = [
    {
      id: 1,
      title: 'Foundation & Fundamentals',
      description: 'Build core understanding and essential principles. Establish strong foundational knowledge.',
      difficulty: 'Beginner',
      duration: '2-3 weeks',
      topics: ['Basic concepts and terminology', 'Fundamental principles', 'Setting up environment', 'Core building blocks']
    },
    {
      id: 2,
      title: 'Core Concepts & Techniques',
      description: 'Dive deeper into essential methods, patterns, and practical applications.',
      difficulty: 'Intermediate',
      duration: '3-4 weeks',
      topics: ['Key techniques and methodologies', 'Practical applications', 'Common patterns and best practices', 'Hands-on exercises']
    },
    {
      id: 3,
      title: 'Advanced Applications & Projects',
      description: 'Apply knowledge to complex scenarios, real projects, and advanced concepts.',
      difficulty: 'Advanced',
      duration: '3-5 weeks',
      topics: ['Real-world project implementation', 'Advanced patterns and optimization', 'Troubleshooting and debugging', 'Performance optimization']
    }
  ];

  const resources = [
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
    }
  ];

  return {
    title: `Master ${goal}`,
    estimatedDuration: durationMap[timeAvailable] || '8-12 weeks',
    personalizedMessage: `Customized for ${background.toLowerCase()} level with ${learningStyle.toLowerCase()} learning preference. Optimized for ${timeAvailable}.`,
    modules,
    resources
  };
}
