export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
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

  // Try OpenAI first if API key is available
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
              content: `You are an expert learning path designer. Create highly personalized learning roadmaps based on user's background, time availability, and learning style. 
              Return valid JSON with this structure:
              {
                "title": "Personalized learning path title",
                "estimatedDuration": "X-Y weeks",
                "personalizedMessage": "Custom message for the user",
                "modules": [
                  {
                    "id": 1,
                    "title": "Module title",
                    "description": "Detailed description",
                    "difficulty": "Beginner/Intermediate/Advanced",
                    "duration": "X-Y weeks",
                    "topics": ["topic1", "topic2", "topic3"]
                  }
                ],
                "resources": [
                  {
                    "type": "course/video/documentation",
                    "title": "Resource title",
                    "provider": "Provider name",
                    "url": "https://example.com",
                    "duration": "X hours",
                    "free": true/false
                  }
                ]
              }
              
              Important: Make it highly personalized based on:
              - Goal: ${goal}
              - Background: ${background}
              - Time Available: ${timeAvailable}
              - Learning Style: ${learningStyle}
              
              Create specific, actionable content that matches their level and preferences.`
            },
            {
              role: 'user',
              content: `Create a personalized learning roadmap for me to learn ${goal}. I'm at ${background} level, have ${timeAvailable} available, and prefer ${learningStyle} learning style.`
            }
          ],
          temperature: 0.8,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API failed: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse the JSON response from AI
      try {
        return JSON.parse(aiResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // Fall back to enhanced mock data
        return generateEnhancedMockRoadmap(learningData);
      }
      
    } catch (error) {
      console.error('OpenAI error:', error);
      // Fall back to enhanced mock data
      return generateEnhancedMockRoadmap(learningData);
    }
  }

  // If no OpenAI API key, use enhanced mock data
  return generateEnhancedMockRoadmap(learningData);
}

function generateEnhancedMockRoadmap(data) {
  const { goal, background, timeAvailable, learningStyle } = data;
  
  // Personalized duration mapping
  const durationMap = {
    '1-2h/week': '12-16 weeks',
    '3-5h/week': '8-12 weeks', 
    '6-10h/week': '6-8 weeks',
    '10+h/week': '4-6 weeks'
  };

  // Helper functions for personalization
  const getFoundationDescription = () => {
    const styleMap = {
      'Visual': 'Visual introduction with diagrams, charts, and interactive examples',
      'Reading': 'Comprehensive reading materials, articles, and detailed explanations',
      'Practical': 'Hands-on exercises with immediate practice and real-world examples',
      'Mixed': 'Balanced approach combining various learning methods'
    };
    
    const levelMap = {
      'Beginner': `Perfect for complete beginners starting ${goal} from scratch`,
      'Some Experience': `Solidify your foundational knowledge of ${goal}`,
      'Intermediate': `Review and strengthen core ${goal} fundamentals`, 
      'Advanced': `Master advanced ${goal} foundational concepts and patterns`
    };
    
    return `${levelMap[background]} using ${styleMap[learningStyle]?.toLowerCase() || 'mixed methods'}.`;
  };

  const getCoreDescription = () => {
    const styleMap = {
      'Visual': 'Visual learning with detailed workflows and process diagrams',
      'Reading': 'In-depth reading on core concepts and methodologies',
      'Practical': 'Practical application through projects and exercises',
      'Mixed': 'Comprehensive approach to core concepts'
    };
    return `Master the essential ${goal} concepts using ${styleMap[learningStyle]?.toLowerCase() || 'proven methods'}.`;
  };

  const getAdvancedDescription = () => {
    return `Advanced ${goal} applications and real-world projects tailored for ${background.toLowerCase()} level.`;
  };

  const getFoundationTopics = () => {
    const topics = {
      'Beginner': [
        `Introduction to ${goal} and basic concepts`,
        'Getting started guide and setup',
        'Essential terminology and principles',
        'Simple examples and first steps',
        'Common beginner mistakes to avoid'
      ],
      'Some Experience': [
        `Core ${goal} principles and fundamentals`,
        'Best practices and common patterns',
        'Development environment setup',
        'Basic project structure and organization',
        'Debugging and troubleshooting basics'
      ],
      'Intermediate': [
        'Advanced foundational concepts',
        'Architecture and design patterns',
        'Performance considerations',
        'Tooling and workflow optimization',
        'Code quality and maintenance'
      ],
      'Advanced': [
        'Expert-level fundamentals and patterns',
        'Advanced architecture and scaling',
        'Performance optimization techniques',
        'Industry standards and best practices',
        'Mentoring and code review skills'
      ]
    };
    
    return topics[background] || topics['Beginner'];
  };

  const getCoreTopics = () => {
    const baseTopics = [
      'Key techniques and methodologies',
      'Practical applications and use cases',
      'Common patterns and best practices',
      'Hands-on exercises and projects',
      'Problem-solving approaches'
    ];
    
    if (background === 'Advanced') {
      return [
        'Advanced techniques and methodologies',
        'Complex real-world applications',
        'Enterprise patterns and architecture',
        'Performance optimization strategies',
        'System design and scaling'
      ];
    }
    
    return baseTopics;
  };

  const getAdvancedTopics = () => {
    return [
      'Real-world project implementation',
      'Advanced patterns and optimization',
      'Troubleshooting complex issues',
      'Performance optimization',
      'Industry best practices implementation'
    ];
  };

  const getDifficulty = (moduleLevel) => {
    const difficultyMap = {
      'Beginner': {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate', 
        'advanced': 'Advanced'
      },
      'Some Experience': {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      },
      'Intermediate': {
        'beginner': 'Beginner', 
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      },
      'Advanced': {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate', 
        'advanced': 'Expert'
      }
    };
    
    return difficultyMap[background]?.[moduleLevel] || moduleLevel;
  };

  const getDuration = (moduleLevel) => {
    const baseDurations = {
      'beginner': '2-3 weeks',
      'intermediate': '3-4 weeks',
      'advanced': '3-5 weeks'
    };
    
    // Adjust based on time availability
    if (timeAvailable === '10+h/week') {
      return {
        'beginner': '1-2 weeks',
        'intermediate': '2-3 weeks',
        'advanced': '2-4 weeks'
      }[moduleLevel];
    }
    
    if (timeAvailable === '1-2h/week') {
      return {
        'beginner': '3-4 weeks',
        'intermediate': '4-5 weeks',
        'advanced': '5-6 weeks'
      }[moduleLevel];
    }
    
    return baseDurations[moduleLevel];
  };

  const modules = [
    {
      id: 1,
      title: `${goal} Fundamentals`,
      description: getFoundationDescription(),
      difficulty: getDifficulty('beginner'),
      duration: getDuration('beginner'),
      topics: getFoundationTopics()
    },
    {
      id: 2,
      title: `Core ${goal} Concepts`,
      description: getCoreDescription(),
      difficulty: getDifficulty('intermediate'),
      duration: getDuration('intermediate'),
      topics: getCoreTopics()
    },
    {
      id: 3,
      title: `Advanced ${goal} Applications`,
      description: getAdvancedDescription(),
      difficulty: getDifficulty('advanced'),
      duration: getDuration('advanced'),
      topics: getAdvancedTopics()
    }
  ];

  // Adjust modules based on background
  let finalModules = modules;
  if (background === 'Advanced') {
    finalModules = [modules[1], modules[2]]; // Skip basics for advanced
  }

  const getResources = () => {
    const courseLevels = {
      'Beginner': 'Complete Beginner Course',
      'Some Experience': 'Intermediate Mastery Course',
      'Intermediate': 'Advanced Concepts Course',
      'Advanced': 'Expert Masterclass'
    };

    const providers = {
      'Visual': 'Udemy',
      'Reading': 'Coursera',
      'Practical': 'Pluralsight',
      'Mixed': 'edX'
    };

    return [
      {
        type: 'course',
        title: `${goal} ${courseLevels[background]}`,
        provider: providers[learningStyle],
        url: `https://www.${providers[learningStyle].toLowerCase()}.com/courses/search/?q=${encodeURIComponent(goal + ' ' + background.toLowerCase())}`,
        duration: timeAvailable === '10+h/week' ? '15+ hours' : '8-12 hours',
        free: background === 'Beginner' // More free resources for beginners
      },
      {
        type: 'video',
        title: `${goal} ${learningStyle} Tutorial Series`,
        provider: 'YouTube',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(goal + ' ' + learningStyle.toLowerCase() + ' tutorial ' + background.toLowerCase())}`,
        duration: timeAvailable === '1-2h/week' ? '4-6 hours' : '2-3 hours',
        free: true
      },
      {
        type: 'documentation',
        title: `${goal} ${background} Documentation`,
        provider: 'Official Docs',
        url: `https://${goal.toLowerCase().replace(' ', '-')}.org/docs`,
        duration: 'Ongoing',
        free: true
      }
    ];
  };

  const generatePersonalizedMessage = () => {
    const timeMessage = {
      '1-2h/week': 'steady, consistent learning pace',
      '3-5h/week': 'moderate and effective learning schedule',
      '6-10h/week': 'intensive learning journey',
      '10+h/week': 'accelerated mastery path'
    };
    
    const styleMessage = {
      'Visual': 'visual learning methods with rich media content',
      'Reading': 'comprehensive reading materials and detailed documentation',
      'Practical': 'hands-on, project-based learning approach',
      'Mixed': 'balanced learning approach with varied methodologies'
    };
    
    return `Customized ${goal} learning path for ${background.toLowerCase()} level. Uses ${styleMessage[learningStyle]} at ${timeMessage[timeAvailable]}.`;
  };

  return {
    title: `Personalized ${goal} Mastery Path`,
    estimatedDuration: durationMap[timeAvailable] || '8-12 weeks',
    personalizedMessage: generatePersonalizedMessage(),
    modules: finalModules,
    resources: getResources()
  };
}
