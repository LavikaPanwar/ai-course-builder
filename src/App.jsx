import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Sparkles, Brain, Zap, Rocket, Star } from 'lucide-react';

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

  const learningStyles = ['Visual', 'Reading/Writing', 'Hands-on', 'Mixed'];
  const timeOptions = ['1-2 hours/week', '3-5 hours/week', '6-10 hours/week', '10+ hours/week'];
  const backgroundLevels = ['Complete Beginner', 'Some Knowledge', 'Intermediate', 'Advanced'];

  const handleInputChange = (field, value) => {
    setLearnerData(prev => ({ ...prev, [field]: value }));
  };

  // AI-POWERED ROADMAP GENERATION
  const generateRoadmapWithAI = async () => {
    setLoading(true);
    setAiStatus('🧠 AI is analyzing your learning goals...');

    try {
      const prompt = `You are an expert educational curriculum designer who creates personalized learning roadmaps for ANY subject - from cooking to coding, music to mathematics, fitness to finance.

LEARNER PROFILE:
- Learning Goal: ${learnerData.goal}
- Current Background: ${learnerData.background}
- Time Availability: ${learnerData.timeAvailable}
- Learning Style: ${learnerData.learningStyle}

CRITICAL INSTRUCTIONS:
1. READ THE LEARNING GOAL CAREFULLY - if it's "cooking", create a cooking curriculum. If it's "piano", create a piano curriculum. DO NOT default to programming/tech topics.

2. Create 3-6 modules that are 100% specific to "${learnerData.goal}"

3. For each module:
   - Title must be directly related to ${learnerData.goal}
   - Description must explain what they'll learn about ${learnerData.goal}
   - Duration: 2-5 weeks per module
   - Difficulty: Beginner/Intermediate/Advanced
   - Topics: List 4-6 VERY SPECIFIC topics within ${learnerData.goal} (NOT generic terms)

4. Resources: Suggest 5 types of learning resources that are specifically for ${learnerData.goal}
   - Include real platforms/websites for this topic
   - Consider the learning style (${learnerData.learningStyle})

EXAMPLES TO GUIDE YOU:
- If goal is "cooking": Modules like "Knife Skills & Basic Techniques", "Mastering Flavors & Seasoning", topics like "Julienne and dice techniques", "Making stock from scratch"
- If goal is "web development": Modules like "HTML & CSS Fundamentals", topics like "Flexbox layouts", "CSS Grid systems"
- If goal is "guitar": Modules like "Basic Chords & Strumming", topics like "Open position chords", "Alternate picking technique"

ADAPT TO THE GOAL - Don't give programming resources for cooking, or cooking resources for programming!

Respond with ONLY a valid JSON object in this exact format (no markdown, no backticks, just JSON):

{
  "title": "Personalized Learning Path: [Goal Name]",
  "estimatedDuration": "X-Y months",
  "modules": [
    {
      "id": 1,
      "title": "Module Title",
      "description": "Module description",
      "duration": "X-Y weeks",
      "topics": ["topic1", "topic2", "topic3", "topic4"],
      "difficulty": "Beginner"
    }
  ],
  "resources": [
    {
      "type": "Resource Type",
      "count": number,
      "platform": "Platform Name"
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

      setRoadmap(aiRoadmap);

      const initialProgress = {};
      aiRoadmap.modules.forEach(module => {
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
      setAiStatus('❌ Error generating roadmap. Using fallback...');
      
      await generateFallbackRoadmap();
    }
  };

  const generateFallbackRoadmap = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const modules = generateModules(learnerData);
    
    setRoadmap({
      title: `Personalized Learning Path: ${learnerData.goal}`,
      estimatedDuration: calculateDuration(learnerData.timeAvailable),
      modules: modules,
      resources: generateResources(learnerData.goal)
    });

    const initialProgress = {};
    modules.forEach(module => {
      initialProgress[module.id] = { completed: false, score: 0 };
    });
    setProgress(initialProgress);

    setStep('roadmap');
    setLoading(false);
  };

  const generateModules = (data) => {
    const baseModules = [
      {
        id: 1,
        title: 'Foundations & Prerequisites',
        description: 'Build essential foundational knowledge',
        duration: '2-3 weeks',
        topics: ['Basic concepts', 'Core terminology', 'Essential tools', 'Environment setup'],
        difficulty: 'Beginner'
      },
      {
        id: 2,
        title: 'Core Concepts',
        description: 'Master the fundamental principles',
        duration: '3-4 weeks',
        topics: ['Key theories', 'Practical applications', 'Best practices', 'Common patterns'],
        difficulty: 'Intermediate'
      },
      {
        id: 3,
        title: 'Hands-on Practice',
        description: 'Apply knowledge through projects',
        duration: '4-5 weeks',
        topics: ['Guided projects', 'Real-world scenarios', 'Problem solving', 'Debugging'],
        difficulty: 'Intermediate'
      },
      {
        id: 4,
        title: 'Advanced Topics',
        description: 'Explore advanced concepts and techniques',
        duration: '3-4 weeks',
        topics: ['Advanced patterns', 'Optimization', 'Scalability', 'Industry standards'],
        difficulty: 'Advanced'
      },
      {
        id: 5,
        title: 'Capstone Project',
        description: 'Complete a comprehensive project',
        duration: '2-3 weeks',
        topics: ['Project planning', 'Implementation', 'Testing', 'Documentation'],
        difficulty: 'Advanced'
      }
    ];

    if (data.background === 'Complete Beginner') {
      return baseModules;
    } else if (data.background === 'Some Knowledge') {
      return baseModules.slice(1);
    } else if (data.background === 'Intermediate') {
      return baseModules.slice(2);
    } else {
      return baseModules.slice(3);
    }
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

  const generateResources = (goal) => {
    return [
      { type: 'Video Courses', count: 12, platform: 'YouTube/Coursera' },
      { type: 'Interactive Tutorials', count: 8, platform: 'freeCodeCamp' },
      { type: 'Reading Materials', count: 15, platform: 'MDN/Documentation' },
      { type: 'Practice Exercises', count: 50, platform: 'LeetCode/HackerRank' },
      { type: 'Projects', count: 5, platform: 'GitHub' }
    ];
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
      {/* Futuristic Header */}
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

      {/* Form Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl mt-6 border border-slate-700/50 backdrop-blur-sm">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Target className="w-4 h-4" />
              Learning Objective
            </label>
            <input
              type="text"
              placeholder="e.g., Quantum Computing, Culinary Arts, Digital Marketing"
              className="w-full p-4 bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-all text-white placeholder-gray-500 font-medium backdrop-blur-sm"
              value={learnerData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
            />
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
            disabled={!learnerData.goal || !learnerData.background || !learnerData.timeAvailable || !learnerData.learningStyle || loading}
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
      {/* Futuristic Progress Header */}
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

      {/* Module Cards */}
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

      {/* Resources Section */}
      <div className="mt-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          Neural Resource Database
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.resources.map((resource, i) => (
            <div key={i} className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="font-bold text-cyan-300 text-lg">{resource.type}</div>
              <div className="text-sm text-gray-400 mt-1">
                {resource.count} resources • {resource.platform}
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
        }}
        className="mt-8 w-full bg-gradient-to-r from-slate-800 to-slate-700 text-cyan-400 py-4 rounded-xl font-bold hover:from-slate-700 hover:to-slate-600 transition-all border border-slate-600 uppercase tracking-wide"
      >
        Initialize New Architecture
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {step === 'input' && renderInputForm()}
        {step === 'roadmap' && renderRoadmap()}
      </div>
    </div>
  );
};

export default AICourseBuilder;
