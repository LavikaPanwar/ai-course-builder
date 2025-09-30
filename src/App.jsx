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

  const generateRoadmapWithAI = async () => {
    const validation = validateGoal(learnerData.goal);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setLoading(true);
    setAiStatus('🧠 Analyzing your unique learning profile...');

    // Your AI generation logic here...
    // For now, let's use a mock response to test the form
    setTimeout(() => {
      setRoadmap({
        title: `Personalized ${learnerData.goal} Mastery Roadmap`,
        estimatedDuration: "3-4 months",
        personalizedMessage: `Based on your ${learnerData.background} background and ${learnerData.learningStyle} learning style, I've created a tailored path to master ${learnerData.goal}.`,
        modules: [
          {
            id: 1,
            title: `Foundations of ${learnerData.goal}`,
            description: `Build essential foundational knowledge and get started with the basics`,
            duration: '2-3 weeks',
            topics: ['Core concepts', 'Basic terminology', 'Essential tools', 'Getting started guide'],
            difficulty: 'Beginner',
            project: `Create your first simple ${learnerData.goal.toLowerCase()} project`
          }
        ],
        resources: [
          {
            type: "YouTube Channels",
            items: [
              {"name": "Beginner Tutorials", "description": "Great for getting started", "url": "#"},
              {"name": "Advanced Techniques", "description": "For when you're ready to level up", "url": "#"}
            ]
          }
        ]
      });
      setStep('roadmap');
      setLoading(false);
    }, 2000);
  };

  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-10 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20">
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

      {/* Form Section - FIXED */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl mt-6 border border-slate-700/50 backdrop-blur-sm">
        <div className="space-y-6">
          {/* GOAL INPUT - THIS WAS MISSING/MESSED UP */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Target className="w-4 h-4" />
              What do you want to learn?
            </label>
            <input
              type="text"
              placeholder="e.g., Italian Cooking, Acoustic Guitar, Digital Marketing, Yoga for Beginners"
              className={`w-full p-4 bg-slate-800/50 border-2 rounded-xl focus:outline-none transition-all text-white placeholder-gray-500 font-medium backdrop-blur-sm ${
                validationError ? 'border-red-500 shake-animation' : 'border-slate-700 focus:border-cyan-500'
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
            <p className="text-xs text-gray-500 mt-2 ml-1">Be specific for better personalization</p>
          </div>

          {/* BACKGROUND LEVEL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              Current Knowledge Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {backgroundLevels.map(level => (
                <button
                  key={level}
                  type="button"
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

          {/* TIME AVAILABILITY */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Clock className="w-4 h-4" />
              Weekly Time Commitment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <button
                  key={time}
                  type="button"
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

          {/* LEARNING STYLE */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4" />
              Preferred Learning Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {learningStyles.map(style => (
                <button
                  key={style}
                  type="button"
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

          {/* Loading State */}
          {loading && (
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 p-5 rounded-xl border-2 border-cyan-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <span className="text-cyan-300 font-bold text-sm uppercase tracking-wide">{aiStatus}</span>
                  <p className="text-xs text-cyan-400 mt-1">Creating your personalized learning experience...</p>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
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

          {/* Info Box */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-xl border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Neural AI Engine</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Advanced AI architecture analyzes your learning parameters and constructs 
                  a precision-optimized curriculum with domain-specific modules and adaptive resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Rest of your roadmap rendering code...
  const renderRoadmap = () => (
    <div className="max-w-6xl mx-auto">
      {/* Roadmap content - you can keep your existing roadmap rendering */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Your Roadmap for: {learnerData.goal}</h2>
        <button
          onClick={() => {
            setStep('input');
            setRoadmap(null);
            setProgress({});
            setAiStatus('');
            setValidationError('');
          }}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Create New Roadmap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {step === 'input' && renderInputForm()}
        {step === 'roadmap' && renderRoadmap()}
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AICourseBuilder;
