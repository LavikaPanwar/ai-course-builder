import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Sparkles, Brain, Zap, Rocket, Star, ExternalLink, Youtube, Globe } from 'lucide-react';

const AICourseBuilder = () => {
  const [step, setStep] = useState('input');
  const [learnerData, setLearnerData] = useState({
    goal: '',
    background: '',
    timeAvailable: '',
    learningStyle: '',
    deadline: ''
  });
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('');
  const [validationError, setValidationError] = useState('');

  const learningStyles = ['Visual', 'Reading/Writing', 'Hands-on', 'Mixed'];
  const timeOptions = ['1-2 hours/week', '3-5 hours/week', '6-10 hours/week', '10+ hours/week'];
  const backgroundLevels = ['Complete Beginner', 'Some Knowledge', 'Intermediate', 'Advanced'];

  // Enhanced domain validation
  const validateGoal = (goal) => {
    if (!goal.trim()) return 'Please enter a learning goal';
    
    const invalidTerms = [
      'asdf', 'test', '123', 'xyz', 'qwerty', 'hello', 'hi', 
      'nothing', 'something', 'everything', 'anything'
    ];
    
    if (invalidTerms.includes(goal.toLowerCase().trim())) {
      return 'Please enter a valid learning goal (e.g., "cooking", "guitar", "digital marketing")';
    }
    
    if (goal.length < 3) {
      return 'Learning goal should be at least 3 characters long';
    }
    
    return '';
  };

  const handleInputChange = (field, value) => {
    setLearnerData(prev => ({ ...prev, [field]: value }));
    if (field === 'goal') {
      setValidationError('');
    }
  };

  // Enhanced AI-POWERED ROADMAP GENERATION
  const generateRoadmapWithAI = async () => {
    const validation = validateGoal(learnerData.goal);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setLoading(true);
    setAiStatus('🧠 AI is analyzing your learning goals...');

    try {
      const prompt = `You are an expert educational curriculum designer who creates hyper-personalized learning roadmaps for ANY subject.

LEARNER PROFILE:
- Learning Goal: ${learnerData.goal}
- Current Background: ${learnerData.background}
- Time Availability: ${learnerData.timeAvailable}
- Learning Style: ${learnerData.learningStyle}

CRITICAL INSTRUCTIONS:
1. DOMAIN-SPECIFIC CONTEXT: Create content 100% focused on "${learnerData.goal}" - if it's cooking, create cooking curriculum; if music, create music curriculum.
2. REAL RESOURCES: Suggest actual platforms, YouTube channels, books specific to the domain
3. PERSONALIZATION: Consider background (${learnerData.background}) and learning style (${learnerData.learningStyle})

MODULE GUIDELINES:
- Create 3-6 modules that are 100% specific to "${learnerData.goal}"
- Each module should have specific, actionable topics
- Include practical projects where applicable

RESOURCE GUIDELINES - MUST BE REAL:
- YouTube: Suggest actual channels with creator names
- Websites: Real platforms with URLs
- Books: Real book titles with authors
- Apps: Actual mobile/desktop apps

EXAMPLES:
For "cooking":
- YouTube: "Joshua Weissman", "Binging with Babish"
- Websites: "SeriousEats.com", "AllRecipes.com"
- Books: "Salt Fat Acid Heat" by Samin Nosrat

For "guitar":
- YouTube: "JustinGuitar", "Marty Music"
- Apps: "Yousician", "Ultimate Guitar"

Respond with ONLY a valid JSON object in this exact format:

{
  "title": "Personalized Learning Path: ${learnerData.goal}",
  "estimatedDuration": "X-Y months",
  "personalizedMessage": "Custom encouragement message for this learner",
  "modules": [
    {
      "id": 1,
      "title": "Module Title Specific to ${learnerData.goal}",
      "description": "Module description focused on ${learnerData.goal}",
      "duration": "X-Y weeks",
      "topics": ["specific topic 1", "specific topic 2", "specific topic 3", "specific topic 4"],
      "difficulty": "Beginner",
      "project": "Practical project idea"
    }
  ],
  "resources": [
    {
      "type": "YouTube Channels",
      "items": [
        {"name": "Real Channel Name", "description": "What they teach", "url": "https://youtube.com/channel"},
        {"name": "Another Real Channel", "description": "Specialty focus", "url": "https://youtube.com/channel"}
      ]
    },
    {
      "type": "Websites & Platforms",
      "items": [
        {"name": "Real Website", "description": "What it offers", "url": "https://website.com"},
        {"name": "Learning Platform", "description": "Courses available", "url": "https://platform.com"}
      ]
    },
    {
      "type": "Books & Reading",
      "items": [
        {"name": "Real Book Title", "description": "Author Name - What it covers", "url": "https://amazon.com/book"},
        {"name": "Another Book", "description": "Author - Focus area", "url": "https://amazon.com/book"}
      ]
    }
  ]
}`;

      setAiStatus('🤖 Calling Claude AI...');

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      setAiStatus('✨ Processing AI response...');

      const data = await response.json();
      let aiResponse = data.content[0].text;

      aiResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      const aiRoadmap = JSON.parse(aiResponse);

      // Enhance with real resources
      const enhancedRoadmap = enhanceWithRealResources(aiRoadmap, learnerData.goal);
      
      setRoadmap(enhancedRoadmap);

      const initialProgress = {};
      enhancedRoadmap.modules.forEach(module => {
        initialProgress[module.id] = { completed: false, score: 0 };
      });
      setProgress(initialProgress);

      setAiStatus('✅ AI-powered roadmap created!');
      setTimeout(() => {
        setStep('roadmap');
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Error generating AI roadmap:", error);
      setAiStatus('❌ Error generating roadmap. Using enhanced fallback...');
      
      await generateEnhancedFallbackRoadmap();
    }
  };

  // Enhance AI response with real resource data
  const enhanceWithRealResources = (roadmap, goal) => {
    const goalLower = goal.toLowerCase();
    const realResources = getRealResources(goalLower);
    
    let enhancedResources = [...roadmap.resources];
    
    // Enhance YouTube resources
    if (realResources.youtube && enhancedResources.find(r => r.type === 'YouTube Channels')) {
      enhancedResources = enhancedResources.map(resource => {
        if (resource.type === 'YouTube Channels') {
          return { ...resource, items: realResources.youtube };
        }
        return resource;
      });
    }
    
    // Enhance website resources
    if (realResources.websites && enhancedResources.find(r => r.type.includes('Website'))) {
      enhancedResources = enhancedResources.map(resource => {
        if (resource.type.includes('Website') || resource.type.includes('Platform')) {
          return { ...resource, items: realResources.websites };
        }
        return resource;
      });
    }

    return {
      ...roadmap,
      resources: enhancedResources
    };
  };

  // Real resource database
  const getRealResources = (goal) => {
    if (goal.includes('cook') || goal.includes('culinary') || goal.includes('baking')) {
      return {
        youtube: [
          { name: "Joshua Weissman", description: "Restaurant-quality techniques", url: "https://youtube.com/@JoshuaWeissman" },
          { name: "Binging with Babish", description: "Movie & TV show recipes", url: "https://youtube.com/@babishculinaryuniverse" },
          { name: "Ethan Chlebowski", description: "Practical everyday cooking", url: "https://youtube.com/@EthanChlebowski" }
        ],
        websites: [
          { name: "Serious Eats", description: "Science-based cooking guides", url: "https://seriouseats.com" },
          { name: "AllRecipes", description: "Community recipes & reviews", url: "https://allrecipes.com" },
          { name: "Bon Appétit", description: "Professional recipes & techniques", url: "https://bonappetit.com" }
        ]
      };
    } else if (goal.includes('guitar') || goal.includes('music')) {
      return {
        youtube: [
          { name: "JustinGuitar", description: "Structured beginner lessons", url: "https://youtube.com/@JustinGuitar" },
          { name: "Marty Music", description: "Song tutorials & techniques", url: "https://youtube.com/@MartyMusic" },
          { name: "Paul Davids", description: "Advanced techniques & music theory", url: "https://youtube.com/@PaulDavids" }
        ],
        websites: [
          { name: "Ultimate Guitar", description: "Tabs & chord charts", url: "https://ultimate-guitar.com" },
          { name: "JustinGuitar.com", description: "Free structured courses", url: "https://justinguitar.com" }
        ]
      };
    } else if (goal.includes('yoga') || goal.includes('meditation')) {
      return {
        youtube: [
          { name: "Yoga With Adriene", description: "Beginner-friendly practices", url: "https://youtube.com/@yogawithadriene" },
          { name: "Boho Beautiful", description: "Flow practices & meditation", url: "https://youtube.com/@BohoBeautiful" }
        ],
        websites: [
          { name: "Yoga Journal", description: "Articles & pose guides", url: "https://yogajournal.com" },
          { name: "DoYogaWithMe", description: "Free yoga classes", url: "https://doyogawithme.com" }
        ]
      };
    }
    
    return {};
  };

  const generateEnhancedFallbackRoadmap = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const goal = learnerData.goal.toLowerCase();
    const modules = generateDomainSpecificModules(goal, learnerData);
    const resources = generateDomainSpecificResources(goal, learnerData);
    
    setRoadmap({
      title: `Personalized Learning Path: ${learnerData.goal}`,
      estimatedDuration: calculateDuration(learnerData.timeAvailable),
      personalizedMessage: `Based on your ${learnerData.background} background and ${learnerData.learningStyle} learning style, I've created a custom path to master ${learnerData.goal}.`,
      modules: modules,
      resources: resources
    });

    const initialProgress = {};
    modules.forEach(module => {
      initialProgress[module.id] = { completed: false, score: 0 };
    });
    setProgress(initialProgress);

    setStep('roadmap');
    setLoading(false);
  };

  const generateDomainSpecificModules = (goal, data) => {
    // Your existing module generation logic but enhanced
    const baseModules = [
      {
        id: 1,
        title: getDomainSpecificTitle(goal, 'foundations'),
        description: 'Build essential foundational knowledge and get started',
        duration: '2-3 weeks',
        topics: getDomainSpecificTopics(goal, 'foundations'),
        difficulty: 'Beginner',
        project: getDomainSpecificProject(goal, 'beginner')
      },
      {
        id: 2,
        title: getDomainSpecificTitle(goal, 'core'),
        description: 'Master the fundamental principles and techniques',
        duration: '3-4 weeks',
        topics: getDomainSpecificTopics(goal, 'core'),
        difficulty: 'Intermediate',
        project: getDomainSpecificProject(goal, 'intermediate')
      },
      {
        id: 3,
        title: getDomainSpecificTitle(goal, 'advanced'),
        description: 'Apply your skills to real-world scenarios and projects',
        duration: '4-5 weeks',
        topics: getDomainSpecificTopics(goal, 'advanced'),
        difficulty: 'Advanced',
        project: getDomainSpecificProject(goal, 'advanced')
      }
    ];

    // Adjust based on background level
    if (data.background === 'Complete Beginner') {
      return baseModules;
    } else if (data.background === 'Some Knowledge') {
      return baseModules.slice(1);
    } else if (data.background === 'Intermediate') {
      return baseModules.slice(2);
    } else {
      return [baseModules[2]]; // Just advanced
    }
  };

  const getDomainSpecificTitle = (goal, type) => {
    if (goal.includes('cook') || goal.includes('culinary')) {
      return type === 'foundations' ? 'Kitchen Fundamentals & Safety' :
             type === 'core' ? 'Cooking Techniques Mastery' :
             'Advanced Recipe Development';
    } else if (goal.includes('guitar') || goal.includes('music')) {
      return type === 'foundations' ? 'Music Fundamentals & Basic Chords' :
             type === 'core' ? 'Playing Techniques & Rhythm' :
             'Advanced Performance Skills';
    }
    return type === 'foundations' ? 'Foundations & Basics' :
           type === 'core' ? 'Core Skills Development' :
           'Advanced Applications';
  };

  const getDomainSpecificTopics = (goal, type) => {
    if (goal.includes('cook') || goal.includes('culinary')) {
      return type === 'foundations' ? ['Knife skills', 'Kitchen safety', 'Basic measurements', 'Equipment knowledge'] :
             type === 'core' ? ['Sautéing techniques', 'Sauce making', 'Flavor balancing', 'Cooking methods'] :
             ['Recipe creation', 'Menu planning', 'Advanced techniques', 'Presentation skills'];
    }
    // Add more domains as needed
    return ['Core concepts', 'Practical applications', 'Skill development', 'Real-world practice'];
  };

  const getDomainSpecificProject = (goal, level) => {
    if (goal.includes('cook') || goal.includes('culinary')) {
      return level === 'beginner' ? 'Prepare a complete meal with 3 dishes' :
             level === 'intermediate' ? 'Create your own recipe from scratch' :
             'Plan and execute a multi-course dinner party';
    }
    return `Complete a ${level}-level project demonstrating your skills`;
  };

  const generateDomainSpecificResources = (goal, data) => {
    const realResources = getRealResources(goal);
    
    return [
      {
        type: "YouTube Channels",
        items: realResources.youtube || [
          { name: "Beginner Tutorials", description: "Great for getting started", url: "#" },
          { name: "Advanced Techniques", description: "For when you're ready to level up", url: "#" }
        ]
      },
      {
        type: "Websites & Platforms",
        items: realResources.websites || [
          { name: "Learning Platform", description: "Comprehensive courses", url: "#" },
          { name: "Community Forum", description: "Connect with other learners", url: "#" }
        ]
      },
      {
        type: "Practice Resources",
        items: [
          { name: "Interactive Exercises", description: "Hands-on practice", url: "#" },
          { name: "Project Ideas", description: "Real-world applications", url: "#" }
        ]
      }
    ];
  };

  const calculateDuration = (timeAvailable) => {
    const timeMap = {
      '1-2 hours/week': '4-6 months',
      '3-5 hours/week': '3-4 months',
      '6-10 hours/week': '2-3 months',
      '10+ hours/week': '1-2 months'
    };
    return timeMap[timeAvailable] || '3-4 months';
  };

  const toggleModuleCompletion = (moduleId) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        completed: !prev[moduleId].completed
      }
    }));
  };

  const calculateOverallProgress = () => {
    if (!roadmap) return 0;
    const completed = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completed / roadmap.modules.length) * 100);
  };

  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto">
      {/* Futuristic Header - YOUR ORIGINAL STYLING */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 animate-pulse"></div>
              <Brain className="w-12 h-12 relative text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LIAA
                </h1>
                <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs font-bold border border-cyan-400/30 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  AI-POWERED
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium mt-1">Learning Intelligence Augmentation Assistant</p>
            </div>
          </div>
          <p className="text-cyan-100/80 text-lg">Neural network-powered personalized learning architecture</p>
        </div>
      </div>

      {/* Form Section - YOUR ORIGINAL STYLING */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl mt-6 border border-slate-700/50 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Target className="w-4 h-4" />
              Learning Objective
            </label>
            <input
              type="text"
              placeholder="e.g., Italian Cooking, Acoustic Guitar, Digital Marketing, Yoga for Beginners"
              className={`w-full p-4 bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-all text-white placeholder-gray-500 font-medium backdrop-blur-sm ${
                validationError ? 'border-red-500 shake-animation' : ''
              }`}
              value={learnerData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              onBlur={() => {
                const error = validateGoal(learnerData.goal);
                setValidationError(error);
              }}
            />
            {validationError && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <span>⚠️</span>
                {validationError}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 ml-1">Precision input enhances AI calibration</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              Knowledge Index
            </label>
            <div className="grid grid-cols-2 gap-3">
              {backgroundLevels.map(level => (
                <button
                  key={level}
                  onClick={() => handleInputChange('background', level)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold backdrop-blur-sm ${
                    learnerData.background === level
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Clock className="w-4 h-4" />
              Time Allocation
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => handleInputChange('timeAvailable', time)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold backdrop-blur-sm ${
                    learnerData.timeAvailable === time
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4" />
              Learning Protocol
            </label>
            <div className="grid grid-cols-2 gap-3">
              {learningStyles.map(style => (
                <button
                  key={style}
                  onClick={() => handleInputChange('learningStyle', style)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold backdrop-blur-sm ${
                    learnerData.learningStyle === style
                      ? 'border-pink-500 bg-pink-500/20 text-pink-300 shadow-lg shadow-pink-500/20'
                      : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-5 rounded-xl border-2 border-cyan-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 border-3 border-purple-500 border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                </div>
                <span className="text-cyan-300 font-bold text-sm uppercase tracking-wide">{aiStatus}</span>
              </div>
            </div>
          )}

          <button
            onClick={generateRoadmapWithAI}
            disabled={!learnerData.goal || !learnerData.background || !learnerData.timeAvailable || !learnerData.learningStyle || loading || validationError}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white py-5 rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg uppercase tracking-wide"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            {loading ? (
              <>
                <div className="relative w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="relative">Initializing Neural Architecture...</span>
              </>
            ) : (
              <>
                <Rocket className="relative w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="relative">Generate Roadmap</span>
                <ArrowRight className="relative w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-xl border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Neural AI Engine</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Advanced Claude Sonnet 4 architecture analyzes your learning parameters and constructs 
                  a precision-optimized curriculum with domain-specific modules and adaptive resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="max-w-6xl mx-auto">
      {/* Futuristic Progress Header - YOUR ORIGINAL STYLING */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10 rounded-3xl mb-8 shadow-2xl border border-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
            <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs font-bold border border-cyan-400/30 uppercase tracking-wide">
              AI-GENERATED
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {roadmap.title}
          </h2>
          
          {roadmap.personalizedMessage && (
            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-cyan-200 italic">💡 {roadmap.personalizedMessage}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-6 text-cyan-100/90 mb-6">
            <span className="flex items-center gap-2 font-semibold">
              <Clock className="w-5 h-5 text-cyan-400" />
              Duration: {roadmap.estimatedDuration}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Award className="w-5 h-5 text-purple-400" />
              {roadmap.modules.length} Modules
            </span>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-cyan-300 uppercase tracking-wide text-sm">System Progress</span>
              <span className="font-black text-2xl text-cyan-400">{calculateOverallProgress()}%</span>
            </div>
            <div className="relative w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-cyan-500/30">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
                style={{ width: `${calculateOverallProgress()}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards - ENHANCED WITH PROJECTS */}
      <div className="space-y-5">
        {roadmap.modules.map((module, index) => (
          <div 
            key={module.id}
            className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden border-2 transition-all backdrop-blur-sm ${
              progress[module.id]?.completed 
                ? 'border-cyan-500 shadow-cyan-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="p-7">
              <div className="flex items-start gap-5">
                <button
                  onClick={() => toggleModuleCompletion(module.id)}
                  className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
                >
                  {progress[module.id]?.completed ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50"></div>
                      <CheckCircle className="relative w-10 h-10 text-cyan-400" />
                    </div>
                  ) : (
                    <Circle className="w-10 h-10 text-slate-600 hover:text-cyan-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                      Module {index + 1}: {module.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                      module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {module.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 leading-relaxed">{module.description}</p>
                  
                  {module.project && (
                    <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <p className="text-purple-300 text-sm">
                        <span className="font-bold">🎯 Practical Project:</span> {module.project}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-cyan-400 mb-5 font-semibold">
                    <Clock className="w-4 h-4" />
                    {module.duration}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-700 text-cyan-300 rounded-lg text-sm border border-cyan-500/20 font-medium hover:border-cyan-500/40 transition-all"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Resources Section with Real Links */}
      <div className="mt-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          Learning Resources & Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmap.resources.map((resourceCategory, i) => (
            <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-cyan-500/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                {resourceCategory.type.includes('YouTube') && <Youtube className="w-5 h-5 text-red-400" />}
                {resourceCategory.type.includes('Website') && <Globe className="w-5 h-5 text-blue-400" />}
                {resourceCategory.type.includes('Book') && <BookOpen className="w-5 h-5 text-green-400" />}
                <h4 className="font-bold text-cyan-300 text-lg">{resourceCategory.type}</h4>
              </div>
              
              <div className="space-y-3">
                {resourceCategory.items?.map((item, j) => (
                  <a
                    key={j}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/40 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {item.description}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setStep('input');
          setRoadmap(null);
          setProgress({});
          setAiStatus('');
          setValidationError('');
        }}
        className="mt-8 w-full bg-gradient-to-r from-slate-800 to-slate-700 text-cyan
