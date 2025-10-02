import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Brain, Zap, Rocket, Star, Youtube, Globe, ExternalLink } from 'lucide-react';

const LIAA = () => {
  const [step, setStep] = useState('input');
  const [learnerData, setLearnerData] = useState({
    goal: '',
    background: '',
    timeAvailable: '',
    learningStyle: '',
  });
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [validationError, setValidationError] = useState('');

  const learningStyles = ['Visual', 'Reading', 'Practical', 'Mixed'];
  const timeOptions = ['1-2h/week', '3-5h/week', '6-10h/week', '10+h/week'];
  const backgroundLevels = ['Beginner', 'Some Experience', 'Intermediate', 'Advanced'];

  const validateGoal = (goal) => {
    if (!goal.trim()) return 'Please enter a learning goal';
    if (goal.length < 5) return 'Please be more specific about your goal';
    return null;
  };

  const handleInputChange = (field, value) => {
    setLearnerData(prev => ({ ...prev, [field]: value }));
    if (field === 'goal' && validationError) {
      setValidationError(null);
    }
  };

  async function generateRoadmapWithOllama(learningData) {
  const { goal, background, timeAvailable, learningStyle } = learningData;

  // Validate learning goal first
  const validationError = validateLearningGoal(goal);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    console.log('🤖 Calling Ollama AI for:', goal);
    
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

IMPORTANT: If the goal seems like a food item, recipe, or non-learning topic, return a helpful error message in the JSON.

RETURN ONLY VALID JSON WITH THIS EXACT STRUCTURE:
{
  "title": "Learning path title",
  "estimatedDuration": "X-Y weeks",
  "personalizedMessage": "Motivational message",
  "modules": [
    {
      "id": 1,
      "title": "Module title",
      "description": "Module description",
      "difficulty": "Beginner/Intermediate/Advanced",
      "duration": "X-Y weeks",
      "topics": ["topic1", "topic2", "topic3"]
    }
  ],
  "resources": [
    {
      "type": "course/video/documentation",
      "title": "Resource name",
      "provider": "Provider",
      "url": "#",
      "duration": "X hours",
      "free": true
    }
  ]
}

If this is not a valid learning goal, return:
{
  "error": "Please enter a learning goal like programming, design, business, etc."
}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1500
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract JSON from response
    let cleanResponse = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Check if AI returned an error
      if (parsedData.error) {
        throw new Error(parsedData.error);
      }
      
      return parsedData;
    } else {
      throw new Error('Invalid response from AI');
    }
    
  } catch (error) {
    console.log('Using enhanced mock data');
    return generateEnhancedMockRoadmap(learningData);
  }
}

// Add this validation function
function validateLearningGoal(goal) {
  if (!goal || goal.trim().length < 3) {
    return 'Please enter a learning goal (e.g., "Web Development", "Data Science")';
  }

  const foodKeywords = [
    'gajar', 'halwa', 'biriyani', 'biryani', 'pizza', 'burger', 'pasta',
    'curry', 'sabji', 'roti', 'naan', 'rice', 'khana', 'food', 'cook',
    'recipe', 'cooking', 'dish', 'meal', 'eating', 'restaurant'
  ];

  const lowerGoal = goal.toLowerCase();
  
  if (foodKeywords.some(food => lowerGoal.includes(food))) {
    return '🍕 This appears to be a food item! Please enter a learning goal like "Programming", "Design", "Marketing", etc.';
  }

  // Check for other non-learning topics
  const invalidPatterns = [
    /^[0-9]+$/, // Only numbers
    /^[a-zA-Z]{1,2}$/, // Single letters
    /^(hello|hi|test|hey|what)$/i // Simple words
  ];

  if (invalidPatterns.some(pattern => pattern.test(goal.trim()))) {
    return 'Please enter a meaningful learning goal (e.g., "JavaScript", "Digital Marketing", "Graphic Design")';
  }

  return null; // Valid goal
}

  // Enhanced mock data generator (fallback)
  const generateEnhancedMockRoadmap = (data) => {
    const { goal, background, timeAvailable, learningStyle } = data;
    
    const durationMap = {
      '1-2h/week': '12-16 weeks',
      '3-5h/week': '8-12 weeks', 
      '6-10h/week': '6-8 weeks',
      '10+h/week': '4-6 weeks'
    };

    const getFoundationDescription = () => {
      const styleMap = {
        'Visual': 'Visual introduction with diagrams and examples',
        'Reading': 'Comprehensive reading materials and theory',
        'Practical': 'Hands-on exercises and immediate practice',
        'Mixed': 'Balanced approach with various learning methods'
      };
      
      const levelMap = {
        'Beginner': 'Perfect for complete beginners starting from scratch',
        'Some Experience': 'Solidify your foundational knowledge',
        'Intermediate': 'Review and strengthen core fundamentals', 
        'Advanced': 'Advanced foundational concepts and patterns'
      };
      
      return `${levelMap[background]} using ${styleMap[learningStyle]?.toLowerCase() || 'mixed methods'}.`;
    };

    const getFoundationTopics = () => {
      const topics = {
        'Beginner': [
          `What is ${goal}? Basic concepts`,
          'Getting started guide',
          'Essential terminology',
          'Simple examples and exercises'
        ],
        'Some Experience': [
          `Core ${goal} principles`,
          'Common patterns and best practices',
          'Setting up development environment',
          'Basic project structure'
        ],
        'Intermediate': [
          'Advanced foundational concepts',
          'Architecture and design patterns',
          'Performance considerations',
          'Tooling and workflow optimization'
        ],
        'Advanced': [
          'Expert-level fundamentals',
          'Advanced patterns and architectures',
          'Performance optimization techniques',
          'Industry best practices and standards'
        ]
      };
      
      return topics[background] || topics['Beginner'];
    };

    const modules = [
      {
        id: 1,
        title: `${goal} Fundamentals`,
        description: getFoundationDescription(),
        difficulty: background === 'Advanced' ? 'Beginner' : 'Beginner',
        duration: '2-3 weeks',
        topics: getFoundationTopics()
      },
      {
        id: 2,
        title: `Core ${goal} Concepts`,
        description: 'Dive deeper into essential methods, patterns, and practical applications.',
        difficulty: background === 'Beginner' ? 'Intermediate' : 'Intermediate',
        duration: '3-4 weeks',
        topics: ['Key techniques and methodologies', 'Practical applications', 'Common patterns and best practices', 'Hands-on exercises']
      },
      {
        id: 3,
        title: `Advanced ${goal} Applications`,
        description: 'Apply knowledge to complex scenarios, real projects, and advanced concepts.',
        difficulty: background === 'Beginner' ? 'Advanced' : 'Expert',
        duration: '3-5 weeks',
        topics: ['Real-world project implementation', 'Advanced patterns and optimization', 'Troubleshooting and debugging', 'Performance optimization']
      }
    ];

    // Adjust modules based on background
    let finalModules = modules;
    if (background === 'Advanced') {
      finalModules = [modules[1], modules[2]]; // Skip basics for advanced
    }

    const resources = [
      {
        type: 'course',
        title: `${goal} ${background} Masterclass`,
        provider: 'Udemy',
        url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(goal + ' ' + background)}`,
        duration: '10+ hours',
        free: background === 'Beginner'
      },
      {
        type: 'video',
        title: `${goal} ${learningStyle} Tutorial`,
        provider: 'YouTube',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(goal + ' ' + learningStyle + ' tutorial')}`,
        duration: '2-3 hours',
        free: true
      },
      {
        type: 'documentation',
        title: `${goal} Official Documentation`,
        provider: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        duration: 'Ongoing',
        free: true
      }
    ];

    return {
      title: `Personalized ${goal} Learning Path`,
      estimatedDuration: durationMap[timeAvailable] || '8-12 weeks',
      personalizedMessage: `Customized for ${background.toLowerCase()} level with ${learningStyle.toLowerCase()} learning preference. Optimized for ${timeAvailable}.`,
      modules: finalModules,
      resources
    };
  };

  const toggleModuleCompletion = (moduleId) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: {
        completed: !prev[moduleId]?.completed,
        completedAt: !prev[moduleId]?.completed ? new Date() : null
      }
    }));
  };

  const calculateOverallProgress = () => {
    if (!roadmap) return 0;
    const completed = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completed / roadmap.modules.length) * 100);
  };

  const renderInputForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="relative overflow-hidden p-10 rounded-3xl mb-8 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/30 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LIAA
            </h1>
            <Zap className="w-10 h-10 text-purple-400 animate-pulse" />
          </div>
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 mb-4">
            <p className="text-cyan-300 text-sm font-medium tracking-widest uppercase">
              Learning Intelligence AI Assistant
            </p>
          </div>
          <p className="text-xl text-gray-300 font-light leading-relaxed max-w-xl mx-auto">
            Get <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">truly personalized learning roadmaps</span> powered by AI
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden p-8 rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-2xl shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.1),transparent)]"></div>
        <div className="relative z-10 space-y-8">
          <div>
            <label className="flex items-center gap-2 text-base font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              What do you want to master?
            </label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <input
                type="text"
                placeholder="e.g., Machine Learning, Web Development, Digital Marketing..."
                className={`relative w-full p-5 bg-gray-900/50 border rounded-2xl transition-all text-white placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                  validationError ? 'border-red-400 shake-animation' : 'border-gray-700 hover:border-cyan-400/50'
                }`}
                value={learnerData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
              />
            </div>
            {validationError && (
              <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-red-500/10 border border-red-400/30">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <p className="text-red-400 text-sm">{validationError}</p>
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              Current Knowledge Level
            </label>
            <div className="grid grid-cols-2 gap-4">
              {backgroundLevels.map(level => (
                <button
                  key={level}
                  onClick={() => handleInputChange('background', level)}
                  className={`relative p-4 rounded-xl border-2 transition-all font-medium overflow-hidden group ${
                    learnerData.background === level
                      ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-cyan-400/50 hover:bg-gray-800/80'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative">{level}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-semibold text-transparent bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              Weekly Study Time
            </label>
            <div className="grid grid-cols-2 gap-4">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => handleInputChange('timeAvailable', time)}
                  className={`relative p-4 rounded-xl border-2 transition-all font-medium overflow-hidden group ${
                    learnerData.timeAvailable === time
                      ? 'border-purple-400 bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-purple-400/50 hover:bg-gray-800/80'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative">{time}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-semibold text-transparent bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-400/30">
                <TrendingUp className="w-5 h-5 text-pink-400" />
              </div>
              Preferred Learning Style
            </label>
            <div className="grid grid-cols-2 gap-4">
              {learningStyles.map(style => (
                <button
                  key={style}
                  onClick={() => handleInputChange('learningStyle', style)}
                  className={`relative p-4 rounded-xl border-2 transition-all font-medium overflow-hidden group ${
                    learnerData.learningStyle === style
                      ? 'border-pink-400 bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-300 shadow-lg shadow-pink-500/20'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-pink-400/50 hover:bg-gray-800/80'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative">{style}</span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="relative overflow-hidden p-5 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-cyan-400/20 rounded-full"></div>
                  <div className="absolute inset-0 w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-cyan-300 font-medium">AI is creating your personalized roadmap...</p>
                  <p className="text-cyan-400/60 text-sm">Analyzing your background, goals, and learning style</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={generateRoadmapWithAI}
            disabled={!learnerData.goal || !learnerData.background || !learnerData.timeAvailable || !learnerData.learningStyle || loading}
            className="relative w-full group overflow-hidden rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 group-hover:scale-105 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            <div className="relative px-8 py-5 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white font-semibold text-lg">AI Generating Your Roadmap...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6 text-white" />
                  <span className="text-white font-semibold text-lg">Generate AI Learning Plan</span>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden p-8 rounded-3xl mb-8 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/30 backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{roadmap.title}</h2>
              </div>
              <p className="text-cyan-300 text-base mb-4">{roadmap.personalizedMessage}</p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  {roadmap.estimatedDuration}
                </span>
                <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700">
                  <Award className="w-4 h-4 text-purple-400" />
                  {roadmap.modules.length} modules
                </span>
              </div>
            </div>
            <div className="text-center px-6 py-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{calculateOverallProgress()}%</div>
              <div className="text-xs text-cyan-300 font-medium uppercase tracking-wider mt-1">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden border border-gray-700">
            <div 
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 relative overflow-hidden"
              style={{ width: `${calculateOverallProgress()}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {roadmap.modules.map((module, index) => (
          <div 
            key={module.id}
            className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 group ${
              progress[module.id]?.completed 
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/20' 
                : 'border-gray-700 bg-gradient-to-br from-gray-900/90 to-gray-800/90 hover:border-cyan-400/50'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex items-start gap-5">
              <button
                onClick={() => toggleModuleCompletion(module.id)}
                className="flex-shrink-0 mt-1 transition-all hover:scale-110 active:scale-95"
              >
                {progress[module.id]?.completed ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-50"></div>
                    <CheckCircle className="relative w-8 h-8 text-cyan-400" />
                  </div>
                ) : (
                  <Circle className="w-8 h-8 text-gray-500 hover:text-cyan-400 transition-colors" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-xl font-bold text-white">
                    Module {index + 1}: {module.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    module.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {module.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-400 font-medium">{module.duration}</span>
                </div>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  {module.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {module.topics.map((topic, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-600 rounded-lg text-xs text-gray-300 font-medium hover:border-cyan-400/50 transition-colors">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {roadmap.resources && (
        <div className="mt-8 relative overflow-hidden p-6 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent)]"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              Recommended Resources
            </h3>
            <div className="grid gap-4">
              {roadmap.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-700 bg-gray-800/50 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      resource.type === 'video' ? 'bg-red-500/20 border border-red-500/30' :
                      resource.type === 'course' ? 'bg-blue-500/20 border border-blue-500/30' :
                      resource.type === 'book' ? 'bg-green-500/20 border border-green-500/30' :
                      'bg-purple-500/20 border border-purple-500/30'
                    }`}>
                      {resource.type === 'video' && <Youtube className="w-5 h-5 text-red-400" />}
                      {resource.type === 'course' && <Globe className="w-5 h-5 text-blue-400" />}
                      {resource.type === 'book' && <BookOpen className="w-5 h-5 text-green-400" />}
                      {resource.type === 'documentation' && <ExternalLink className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {resource.provider} • {resource.duration} • 
                        <span className={resource.free ? 'text-green-400' : 'text-yellow-400'}> {resource.free ? 'Free' : 'Paid'}</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setStep('input');
          setRoadmap(null);
          setProgress({});
        }}
        className="relative w-full mt-8 group overflow-hidden rounded-2xl transition-all border-2 border-cyan-400/50 hover:border-cyan-400"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all"></div>
        <div className="relative px-8 py-4 flex items-center justify-center gap-3">
          <Rocket className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-semibold text-lg">Create New Learning Plan</span>
        </div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
      <div className="relative z-10">
        {step === 'input' && renderInputForm()}
        {step === 'roadmap' && renderRoadmap()}
      </div>
    </div>
  );
};

export default LIAA;
