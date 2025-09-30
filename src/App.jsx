import React, { useState } from 'react';
import { BookOpen, Target, Clock, TrendingUp, CheckCircle, Circle, Award, ArrowRight, Brain, Zap, Rocket, Star, ExternalLink, Youtube, Globe, Cpu, Satellite, Orbit } from 'lucide-react';

const AICourseBuilder = () => {
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

  const learningStyles = ['Visual', 'Reading/Writing', 'Hands-on', 'Mixed'];
  const timeOptions = ['1-2 hours/week', '3-5 hours/week', '6-10 hours/week', '10+ hours/week'];
  const backgroundLevels = ['Complete Beginner', 'Some Knowledge', 'Intermediate', 'Advanced'];

  // ... (keep all your existing functions: validateGoal, handleInputChange, etc.)

  const generateRoadmapWithAI = async () => {
    const validation = validateGoal(learnerData.goal);
    if (validation) {
      setValidationError(validation);
      return;
    }

    setLoading(true);
    setAiStatus('🧠 Initializing neural pathways...');

    try {
      // Use your existing AI generation logic
      await generateIntelligentAIResponse();
    } catch (error) {
      console.error("AI generation failed:", error);
      await generateIntelligentAIResponse();
    }
  };

  // ... (keep all your existing AI functions)

  // 🚀 ENHANCED INPUT FORM WITH SPACE THEME
  const renderInputForm = () => (
    <div className="max-w-4xl mx-auto">
      {/* 🌌 SPACE & NEURONS HEADER */}
      <div className="relative cyber-glow holographic particle-field text-white p-10 rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 mb-6">
        <div className="absolute inset-0">
          {/* Neural Network Nodes */}
          <div className="absolute top-4 left-4 neural-node"></div>
          <div className="absolute top-4 right-4 neural-node" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-4 left-4 neural-node" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-4 right-4 neural-node" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 animate-pulse"></div>
              <Orbit className="w-12 h-12 relative text-cyan-400 quantum-state" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-5xl font-black tracking-tight text-space-gradient">
                  NEURAL SPACE
                </h1>
                <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs font-bold border border-cyan-400/30 flex items-center gap-1.5">
                  <Satellite className="w-3 h-3 text-cyan-400" />
                  QUANTUM AI
                </span>
              </div>
              <p className="text-sm text-cyan-300 font-medium mt-1">Interstellar Learning Intelligence</p>
            </div>
          </div>
          <p className="text-cyan-200/80 text-lg">Neural network-powered cosmic learning architecture</p>
        </div>
      </div>

      {/* 🪐 SPACE-THEMED FORM */}
      <div className="space-card p-8 rounded-3xl shadow-2xl mt-6 border border-cyan-500/20 data-stream">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Target className="w-4 h-4" />
              Cosmic Learning Objective
            </label>
            <input
              type="text"
              placeholder="e.g., Quantum Physics, Neural Networks, Space Exploration, AI Ethics"
              className={`w-full p-4 cyber-input rounded-xl focus:outline-none transition-all text-white placeholder-cyan-300/50 font-medium ${
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
            <p className="text-xs text-cyan-400 mt-2 ml-1">Precision input enhances neural calibration</p>
          </div>

          {/* KNOWLEDGE ORBIT */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              Knowledge Orbit
            </label>
            <div className="grid grid-cols-2 gap-3">
              {backgroundLevels.map(level => (
                <button
                  key={level}
                  onClick={() => handleInputChange('background', level)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold backdrop-blur-sm ${
                    learnerData.background === level
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 neural-glow'
                      : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-cyan-500/40 hover:bg-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* TIME DIMENSION */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wide">
              <Clock className="w-4 h-4" />
              Time Dimension
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => handleInputChange('timeAvailable', time)}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold backdrop-blur-sm ${
                    learnerData.timeAvailable === time
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300 quantum-glow'
                      : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-purple-500/40 hover:bg-slate-800'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* LEARNING PROTOCOL */}
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
                      ? 'border-pink-500 bg-pink-500/20 text-pink-300 cyber-glow'
                      : 'border-slate-700 bg-slate-800/50 text-gray-400 hover:border-pink-500/40 hover:bg-slate-800'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="neural-glow p-5 rounded-xl border-2 border-cyan-500/30 backdrop-blur-sm">
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
            className="w-full relative group overflow-hidden btn-cyber text-white py-5 rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg uppercase tracking-wide"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            {loading ? (
              <>
                <div className="relative w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="relative">Initializing Quantum AI...</span>
              </>
            ) : (
              <>
                <Rocket className="relative w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="relative">Generate Cosmic Roadmap</span>
                <ArrowRight className="relative w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>

          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-5 rounded-xl border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5 quantum-state" />
              <div>
                <p className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Quantum Neural Engine</p>
                <p className="text-xs text-cyan-400 mt-1 leading-relaxed">
                  Advanced AI architecture analyzes your learning parameters across multiple dimensions 
                  and constructs a precision-optimized interstellar curriculum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 🛸 ENHANCED ROADMAP WITH SPACE THEME
  const renderRoadmap = () => (
    <div className="max-w-6xl mx-auto">
      {/* COSMIC HEADER */}
      <div className="cyber-glow holographic particle-field text-white p-10 rounded-3xl mb-8 shadow-2xl border border-purple-500/30 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Satellite className="w-8 h-8 text-cyan-400 quantum-state" />
            <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full text-xs font-bold border border-cyan-400/30 uppercase tracking-wide">
              QUANTUM-GENERATED
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4 text-space-gradient">
            {roadmap.title}
          </h2>
          
          {roadmap.personalizedMessage && (
            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <p className="text-cyan-200 italic">🌌 {roadmap.personalizedMessage}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-6 text-cyan-100/90 mb-6">
            <span className="flex items-center gap-2 font-semibold">
              <Clock className="w-5 h-5 text-cyan-400" />
              Cosmic Duration: {roadmap.estimatedDuration}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Award className="w-5 h-5 text-purple-400" />
              {roadmap.modules.length} Neural Modules
            </span>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-cyan-300 uppercase tracking-wide text-sm">Neural Progress</span>
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

      {/* MODULES WITH NEURAL THEME */}
      <div className="space-y-6">
        {roadmap.modules.map((module, index) => (
          <div 
            key={module.id}
            className={`space-card rounded-2xl shadow-2xl overflow-hidden border-2 transition-all backdrop-blur-sm ${
              progress[module.id]?.completed 
                ? 'border-cyan-500 neural-glow' 
                : 'border-slate-700 hover:border-cyan-500/40'
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
                    <h3 className="text-2xl font-black text-neural-gradient">
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
                  
                  {/* Rest of your module content */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RESOURCES SECTION */}
      <div className="mt-10 space-card rounded-2xl shadow-2xl p-8 border border-cyan-500/20">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-space-gradient">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          Cosmic Learning Resources
        </h3>
        {/* Resources content */}
      </div>

      <button
        onClick={() => {
          setStep('input');
          setRoadmap(null);
          setProgress({});
          setAiStatus('');
          setValidationError('');
        }}
        className="mt-8 w-full space-card text-cyan-400 py-4 rounded-xl font-bold hover:neural-glow transition-all border border-slate-600 uppercase tracking-wide"
      >
        Initialize New Cosmic Path
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
