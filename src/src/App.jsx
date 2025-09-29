import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Sparkles } from 'lucide-react';

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

  const learningStyles = ['Visual', 'Reading/Writing', 'Hands-on', 'Mixed'];
  const timeOptions = ['1-2 hours/week', '3-5 hours/week', '6-10 hours/week', '10+ hours/week'];
  const backgroundLevels = ['Complete Beginner', 'Some Knowledge', 'Intermediate', 'Advanced'];

  const handleInputChange = (field, value) => {
    setLearnerData(prev => ({ ...prev, [field]: value }));
  };

  const generateRoadmap = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate personalized roadmap based on inputs
    const modules = generateModules(learnerData);
    
    setRoadmap({
      title: `Personalized Learning Path: ${learnerData.goal}`,
      estimatedDuration: calculateDuration(learnerData.timeAvailable),
      modules: modules,
      resources: generateResources(learnerData.goal)
    });

    // Initialize progress tracking
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

    // Adjust modules based on background
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-3xl font-bold">AI Course Builder</h1>
        </div>
        <p className="text-blue-100">Tell us about your learning goals and we'll create a personalized roadmap</p>
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
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              value={learnerData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
            />
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateRoadmap}
            disabled={!learnerData.goal || !learnerData.background || !learnerData.timeAvailable || !learnerData.learningStyle || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Your Roadmap...
              </>
            ) : (
              <>
                Generate My Learning Roadmap
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mb-6 shadow-xl">
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
                      <Circle className="w-8 h-8 text-gray-300 hover:text-blue-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
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
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
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
          Curated Learning Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.resources.map((resource, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
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
        }}
        className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
      >
        Create New Roadmap
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
