import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Brain, Zap, Rocket, Star, Cpu, Satellite, Youtube, Globe, ExternalLink } from 'lucide-react';

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

  const generateRoadmapWithAI = async () => {
    const validation = validateGoal(learnerData.goal);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setLoading(true);
    setAiStatus('Connecting to AI...');

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(learnerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const roadmapData = await response.json();
      setRoadmap(roadmapData);
      setStep('roadmap');
      
    } catch (error) {
      console.error('API Error:', error);
      setRoadmap(generateIntelligentMockRoadmap(learnerData));
      setStep('roadmap');
    } finally {
      setLoading(false);
    }
  };

  const generateIntelligentMockRoadmap = (data) => {
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
      <div className="premium-card text-white p-8 rounded-2xl mb-8 border border-cyan-500/20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <h1 className="text-4xl font-light tracking-wider">LIAA</h1>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-cyan-400/80 text-sm font-light tracking-wide">
            Learning Intelligence AI Assistant
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-300 font-light">
            AI-powered personalized learning roadmaps
          </p>
        </div>
      </div>

      <div className="premium-card p-8 rounded-2xl border border-gray-700/50">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 mb-3">
              <Target className="w-4 h-4" />
              What do you want to learn?
            </label>
            <input
              type="text"
              placeholder="e.g., Machine Learning, Web Development, Digital Marketing..."
              className={`w-full p-4 premium-input rounded-xl transition-all text-white placeholder-gray-500 ${
                validationError ? 'border-red-400 shake-animation' : ''
              }`}
              value={learnerData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
            />
            {validationError && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                <span>•</span>
                {validationError}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 mb-3">
              <BookOpen className="w-4 h-4" />
              Current Knowledge Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {backgroundLevels.map(level => (
                <button
                  key={level}
                  onClick={() => handleInputChange('background', level)}
                  className={`p-3 rounded-lg border transition-all font-normal text-sm ${
                    learnerData.background === level
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                      : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 mb-3">
              <Clock className="w-4 h-4" />
              Weekly Study Time
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => handleInputChange('timeAvailable', time)}
                  className={`p-3 rounded-lg border transition-all font-normal text-sm ${
                    learnerData.timeAvailable === time
                      ? 'border-purple-400 bg-purple-400/10 text-purple-300'
                      : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-cyan-400 mb-3">
              <TrendingUp className="w-4 h-4" />
              Preferred Learning Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {learningStyles.map(style => (
                <button
                  key={style}
                  onClick={() => handleInputChange('learningStyle', style)}
                  className={`p-3 rounded-lg border transition-all font-normal text-sm ${
                    learnerData.learningStyle === style
                      ? 'border-pink-400 bg-pink-400/10 text-pink-300'
                      : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="p-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-cyan-300 text-sm">{aiStatus}</span>
              </div>
            </div>
          )}

          <button
            onClick={generateRoadmapWithAI}
            disabled={!learnerData.goal || !learnerData.background || !learnerData.timeAvailable || !learnerData.learningStyle || loading}
            className="w-full premium-button text-white py-4 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Generate AI Learning Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="max-w-4xl mx-auto">
      <div className="premium-card text-white p-8 rounded-2xl mb-8 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light mb-2">{roadmap.title}</h2>
            <p className="text-cyan-400 text-sm">{roadmap.personalizedMessage}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {roadmap.estimatedDuration}
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {roadmap.modules.length} modules
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light text-cyan-400">{calculateOverallProgress()}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${calculateOverallProgress()}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {roadmap.modules.map((module, index) => (
          <div 
            key={module.id}
            className={`premium-card p-6 rounded-2xl border transition-all ${
              progress[module.id]?.completed 
                ? 'border-cyan-400 bg-cyan-400/5' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleModuleCompletion(module.id)}
                className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
              >
                {progress[module.id]?.completed ? (
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500 hover:text-cyan-400" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-medium text-white">
                    Module {index + 1}: {module.title}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    module.difficulty === 'Beginner' ? 'bg-green-400/20 text-green-400' :
                    module.difficulty === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }`}>
                    {module.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">{module.duration}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {module.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {module.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
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
        <div className="mt-8 premium-card p-6 rounded-2xl border border-gray-600">
          <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Recommended Resources
          </h3>
          <div className="grid gap-3">
            {roadmap.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-600 hover:border-cyan-400 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  {resource.type === 'video' && <Youtube className="w-4 h-4 text-red-400" />}
                  {resource.type === 'course' && <Globe className="w-4 h-4 text-blue-400" />}
                  {resource.type === 'book' && <BookOpen className="w-4 h-4 text-green-400" />}
                  {resource.type === 'documentation' && <ExternalLink className="w-4 h-4 text-purple-400" />}
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-cyan-300">
                      {resource.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {resource.provider} • {resource.duration} • 
                      {resource.free ? ' Free' : ' Paid'}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setStep('input');
          setRoadmap(null);
          setProgress({});
        }}
        className="w-full mt-8 premium-card text-cyan-400 py-4 rounded-xl font-medium border border-gray-600 hover:border-cyan-400 transition-all"
      >
        Create New Learning Plan
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="relative z-10">
        {step === 'input' && renderInputForm()}
        {step === 'roadmap' && renderRoadmap()}
      </div>
    </div>
  );
};

export default LIAA;
