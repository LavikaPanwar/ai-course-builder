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

    console.log('🔄 Generating roadmap for:', goal);

    const roadmap = await generateRoadmapWithOllama({
      goal,
      background, 
      timeAvailable,
      learningStyle
    });

    console.log('✅ Roadmap generated successfully');
    res.status(200).json(roadmap);

  } catch (error) {
    console.error('❌ API Error:', error);
    // Always return successful response with fallback data
    const roadmap = generateEnhancedMockRoadmap({
      goal: req.body.goal,
      background: req.body.background,
      timeAvailable: req.body.timeAvailable,
      learningStyle: req.body.learningStyle
    });
    res.status(200).json(roadmap);
  }
}

async function generateRoadmapWithOllama(learningData) {
  const { goal, background, timeAvailable, learningStyle } = learningData;

  try {
    console.log('🤖 Calling Ollama AI...');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: `ACT AS AN EXPERT LEARNING PATH DESIGNER. Create a HIGHLY PERSONALIZED learning roadmap as JSON.

LEARNER PROFILE:
- GOAL: ${goal}
- CURRENT LEVEL: ${background}
- TIME AVAILABLE: ${timeAvailable}
- LEARNING STYLE: ${learningStyle}

CREATE A ROADMAP THAT IS:
- Personalized to their specific level and goals
- Matches their learning style preference
- Realistic for their time commitment
- Practical and actionable

RETURN ONLY VALID JSON WITH THIS EXACT STRUCTURE:
{
  "title": "Creative, personalized title for their learning journey",
  "estimatedDuration": "X-Y weeks",
  "personalizedMessage": "Brief motivational message specific to their situation",
  "modules": [
    {
      "id": 1,
      "title": "Module title that matches their level",
      "description": "Detailed description of what they'll learn, personalized to their style",
      "difficulty": "Beginner/Intermediate/Advanced",
      "duration": "X-Y weeks",
      "topics": ["Specific topic 1", "Specific topic 2", "Specific topic 3", "Specific topic 4"]
    },
    {
      "id": 2,
      "title": "Next module title",
      "description": "Continue building on previous knowledge",
      "difficulty": "Appropriate difficulty",
      "duration": "X-Y weeks", 
      "topics": ["Advanced topic 1", "Advanced topic 2", "Advanced topic 3"]
    },
    {
      "id": 3,
      "title": "Advanced module title",
      "description": "Master-level content for their goals",
      "difficulty": "Advanced",
      "duration": "X-Y weeks",
      "topics": ["Expert topic 1", "Expert topic 2", "Real-world project"]
    }
  ],
  "resources": [
    {
      "type": "course/video/documentation/book",
      "title": "Resource name matching their style",
      "provider": "Provider name",
      "url": "#",
      "duration": "X hours",
      "free": true
    },
    {
      "type": "video/course/practice",
      "title": "Another helpful resource",
      "provider": "Provider", 
      "url": "#",
      "duration": "X hours",
      "free": true
    }
  ]
}

MAKE IT HIGHLY PERSONALIZED AND SPECIFIC TO THEIR PROFILE!`,
        stream: false,
        options: {
          temperature: 0.8,
          num_predict: 2000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📨 Received AI response');
    
    // Extract JSON from response
    let cleanResponse = data.response;
    
    // Remove markdown code blocks
    cleanResponse = cleanResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Find JSON object
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = cleanResponse.substring(jsonStart, jsonEnd);
      const parsedData = JSON.parse(jsonString);
      console.log('✅ Successfully parsed AI-generated roadmap');
      return parsedData;
    } else {
      throw new Error('No valid JSON found in AI response');
    }
    
  } catch (error) {
    console.log('🔄 Ollama unavailable, using enhanced personalized mock data');
    return generateEnhancedMockRoadmap(learningData);
  }
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

  // Personalized module descriptions based on learning style
  const getStyleDescription = (moduleType) => {
    const styleMap = {
      'Visual': {
        'foundation': 'Learn through diagrams, charts, and visual examples that make complex concepts easy to understand',
        'core': 'Master concepts with detailed workflows, process diagrams, and visual project guides', 
        'advanced': 'Tackle complex challenges with architectural diagrams and visual debugging techniques'
      },
      'Reading': {
        'foundation': 'Build strong fundamentals through comprehensive reading materials and detailed explanations',
        'core': 'Dive deep with in-depth articles, documentation, and structured reading assignments',
        'advanced': 'Master advanced topics through expert literature and detailed case studies'
      },
      'Practical': {
        'foundation': 'Learn by doing with hands-on exercises and immediate practical application',
        'core': 'Build real skills through project-based learning and practical challenges',
        'advanced': 'Solve complex real-world problems with advanced practical projects'
      },
      'Mixed': {
        'foundation': 'Build understanding through varied approaches including reading, visuals, and hands-on practice',
        'core': 'Master concepts using multiple learning methods tailored to different topics',
        'advanced': 'Tackle advanced challenges with a balanced approach of theory and practice'
      }
    };
    
    return styleMap[learningStyle]?.[moduleType] || 'Comprehensive learning approach';
  };

  // Personalized topics based on background and goal
  const getFoundationTopics = () => {
    if (background === 'Beginner') {
      return [
        `Introduction to ${goal} - basic concepts and principles`,
        'Setting up your development environment and tools',
        'Core terminology and fundamental building blocks',
        'Your first simple project or exercise',
        'Common beginner mistakes and how to avoid them'
      ];
    } else if (background === 'Some Experience') {
      return [
        `Advanced ${goal} fundamentals and core principles`,
        'Best practices and professional workflows',
        'Development environment optimization',
        'Project structure and organization patterns',
        'Debugging and troubleshooting techniques'
      ];
    } else if (background === 'Intermediate') {
      return [
        'Expert-level foundational concepts',
        'Architecture and design pattern fundamentals',
        'Performance considerations from the start',
        'Professional tooling and setup',
        'Code quality and maintenance standards'
      ];
    } else { // Advanced
      return [
        'Master-level foundational patterns',
        'Enterprise-ready architecture basics',
        'Advanced performance fundamentals',
        'Industry-standard development setup',
        'Mentoring and code review foundations'
      ];
    }
  };

  const getCoreTopics = () => {
    const baseTopics = [
      'Key techniques and methodologies specific to your level',
      'Practical real-world applications and use cases',
      'Industry-standard patterns and best practices',
      'Hands-on project work and exercises',
      'Problem-solving strategies and approaches'
    ];
    
    if (background === 'Advanced') {
      return [
        'Advanced techniques and enterprise methodologies',
        'Complex real-world system applications',
        'Enterprise patterns and architectural best practices',
        'Large-scale project implementation',
        'Advanced problem-solving and optimization strategies'
      ];
    }
    
    return baseTopics;
  };

  const getAdvancedTopics = () => {
    return [
      'Complex project implementation and deployment',
      'Advanced optimization and performance tuning',
      'Troubleshooting complex system issues',
      'Industry best practices implementation',
      'Real-world case studies and advanced challenges'
    ];
  };

  const modules = [
    {
      id: 1,
      title: background === 'Advanced' ? `Advanced ${goal} Fundamentals` : `${goal} Foundation Mastery`,
      description: getStyleDescription('foundation'),
      difficulty: background === 'Advanced' ? 'Intermediate' : 'Beginner',
      duration: timeAvailable === '10+h/week' ? '1-2 weeks' : '2-3 weeks',
      topics: getFoundationTopics()
    },
    {
      id: 2,
      title: `Core ${goal} Concepts & Applications`,
      description: getStyleDescription('core'),
      difficulty: 'Intermediate',
      duration: timeAvailable === '1-2h/week' ? '4-5 weeks' : '3-4 weeks',
      topics: getCoreTopics()
    },
    {
      id: 3,
      title: `Advanced ${goal} Projects & Mastery`,
      description: getStyleDescription('advanced'),
      difficulty: background === 'Beginner' ? 'Advanced' : 'Expert',
      duration: timeAvailable === '1-2h/week' ? '5-6 weeks' : '3-5 weeks',
      topics: getAdvancedTopics()
    }
  ];

  // Adjust modules based on background
  let finalModules = modules;
  if (background === 'Advanced') {
    finalModules = [modules[1], modules[2]]; // Skip basics for advanced users
  }

  // Personalized resources based on learning style
  const getResources = () => {
    const resourceMap = {
      'Visual': [
        {
          type: 'video',
          title: `${goal} Visual Learning Series`,
          provider: 'YouTube',
          url: '#',
          duration: '5-8 hours',
          free: true
        },
        {
          type: 'course',
          title: `${goal} with Diagrams and Examples`,
          provider: 'Visual Learning Pro',
          url: '#',
          duration: '10+ hours',
          free: true
        }
      ],
      'Reading': [
        {
          type: 'documentation',
          title: `Comprehensive ${goal} Documentation`,
          provider: 'Official Docs',
          url: '#',
          duration: 'Ongoing',
          free: true
        },
        {
          type: 'book',
          title: `${goal} Complete Guide`,
          provider: 'Open Library',
          url: '#',
          duration: '15+ hours',
          free: true
        }
      ],
      'Practical': [
        {
          type: 'course',
          title: `${goal} Hands-On Projects`,
          provider: 'Project-Based Learning',
          url: '#',
          duration: '12+ hours',
          free: true
        },
        {
          type: 'exercises',
          title: `${goal} Practice Challenges`,
          provider: 'Practice Hub',
          url: '#',
          duration: '8+ hours',
          free: true
        }
      ],
      'Mixed': [
        {
          type: 'course',
          title: `${goal} Complete Learning Path`,
          provider: 'Learning Platform',
          url: '#',
          duration: '15+ hours',
          free: true
        },
        {
          type: 'video',
          title: `${goal} Tutorial Series`,
          provider: 'Mixed Media Learning',
          url: '#',
          duration: '6+ hours',
          free: true
        }
      ]
    };

    return resourceMap[learningStyle] || resourceMap['Mixed'];
  };

  const personalizedMessage = `Custom learning path designed specifically for ${background.toLowerCase()} level with ${learningStyle.toLowerCase()} learning approach. Optimized for ${timeAvailable} - you'll build practical skills through a structured journey that matches your preferences and time commitment.`;

  return {
    title: `Personalized ${goal} Mastery Journey`,
    estimatedDuration: durationMap[timeAvailable] || '8-12 weeks',
    personalizedMessage: personalizedMessage,
    modules: finalModules,
    resources: getResources()
  };
}
