import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';

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
      // Create a detailed prompt for Claude
      const prompt = `You are an expert educational curriculum designer. Create a personalized learning roadmap based on these details:

LEARNER PROFILE:
- Learning Goal: ${learnerData.goal}
- Current Background: ${learnerData.background}
- Time Availability: ${learnerData.timeAvailable}
- Learning Style: ${learnerData.learningStyle}

TASK: Design a complete, personalized learning curriculum with the following structure:

1. Determine the appropriate number of modules (2-6) based on the goal complexity and background level
2. Create specific, actionable module titles
3. For each module, provide:
   - A clear description
   - Estimated duration in weeks
   - Difficulty level (Beginner/Intermediate/Advanced)
   - 4-6 specific, relevant topics to cover
4. Suggest 5 types of learning resources with specific platforms and estimated quantities

IMPORTANT GUIDELINES:
- Adjust complexity based on background level
- Make topics specific to the learning goal (not generic)
- Consider the learning style in your recommendations
- Be realistic with time estimates based on availability
- Include practical, hands-on elements

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

      setAiStatus('🤖 Calling Liaa🐬 AI...');

      // Call Claude API
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

      // Clean up response (remove markdown if present)
      aiResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      // Parse the AI-generated roadmap
      const aiRoadmap = JSON.parse(aiResponse);

      setRoadmap(aiRoadmap);

      // Initialize progress tracking
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
      
      // Fallback to rule-based generation if AI fails
      await generateFallbackRoadmap();
    }
  };

  // Fallback method (original rule-based)
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
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 rounded-t-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <Brain className="w-4 h-4 absolute -top-1 -right-1" />
          </div>
          <h1 className="text-3xl font-bold">AI Course Builder</h1>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            AI-Powered
          </span>
        </div>
        <p className="text-blue-100">Tell us about your learning goals and our AI will create a personalized roadmap</p>
      </div>

      <div className="bg-white p-8 rounded-b-2xl shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Target className="w-4 h-4" />
              What do you want to learn?
            </label>
            <input
              type="text"
              placeholder="e.g., Web Development, Data Science, Machine Learning"
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
              value={learnerData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Be specific for better AI recommendations</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <BookOpen className="w-4 h-4" />
              Current Knowledge Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {backgroundLevels.map(level => (
                <button
                  key={level}
                  onClick={() => handleInputChange('background', level)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    learnerData.background === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Time You Can Dedicate
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => handleInputChange('timeAvailable', time)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    learnerData.timeAvailable === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <TrendingUp className="w-4 h-4" />
              Preferred Learning Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {learningStyles.map(style => (
                <button
                  key={style}
                  onClick={() => handleInputChange('learningStyle', style)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    learnerData.learningStyle === style
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">{aiStatus}</span>
              </div>
            </div>
          )}

          <button
            onClick={generateRoadmapWithAI}
            disabled={!learnerData.goal || !learnerData.background || !learnerData.timeAvailable || !learnerData.learningStyle || loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating AI-Powered Roadmap...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Generate AI-Powered Roadmap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">AI-Powered Features</p>
                <p className="text-xs text-gray-600 mt-1">
                  Our AI analyzes your goals and creates a truly personalized curriculum with specific topics, 
                  custom modules, and tailored resources just for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 rounded-2xl mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-6 h-6" />
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">AI-Generated</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">{roadmap.title}</h2>
        <div className="flex flex-wrap gap-4 text-blue-100">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Estimated Duration: {roadmap.estimatedDuration}
          </span>
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            {roadmap.modules.length} Modules
          </span>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Overall Progress</span>
            <span className="font-bold">{calculateOverallProgress()}%</span>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {roadmap.modules.map((module, index) => (
          <div 
            key={module.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all ${
              progress[module.id]?.completed 
                ? 'border-green-500' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => toggleModuleCompletion(module.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {progress[module.id]?.completed ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <Circle className="w-8 h-8 text-gray-300 hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-800">
                        Module {index + 1}: {module.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm border border-blue-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          AI-Curated Learning Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.resources.map((resource, i) => (
            <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-800">{resource.type}</div>
              <div className="text-sm text-gray-600">
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
        className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
      >
        Create New AI-Powered Roadmap
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {step === 'input' && renderInputForm()}
      {step === 'roadmap' && renderRoadmap()}
    </div>
  );
};

export default AICourseBuilder;
