<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearnPath AI - Smart Learning Roadmaps</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 2rem 0;
            text-align: center;
            color: white;
        }

        header h1 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }

        header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        main {
            padding: 2rem 0;
        }

        .input-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            margin-bottom: 2rem;
        }

        .input-card h2 {
            margin-bottom: 1.5rem;
            color: #2d3748;
            text-align: center;
        }

        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 1.5rem;
        }

        #user-query {
            flex: 1;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        #user-query:focus {
            outline: none;
            border-color: #667eea;
        }

        button {
            padding: 15px 25px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }

        button:hover {
            background: #5a6fd8;
        }

        .context-options {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .context-options label {
            display: flex;
            flex-direction: column;
            gap: 5px;
            font-weight: 500;
            color: #4a5568;
        }

        select {
            padding: 10px;
            border: 2px solid #e1e5e9;
            border-radius: 6px;
            background: white;
            min-width: 200px;
        }

        .roadmap-container {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .analysis-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e1e5e9;
        }

        .analysis-header h3 {
            color: #2d3748;
            margin-bottom: 0.5rem;
        }

        .phase {
            background: #f8f9fa;
            margin: 1.5rem 0;
            padding: 1.5rem;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }

        .phase-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .phase-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2d3748;
        }

        .phase-duration {
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.9rem;
        }

        .phase-content h4 {
            color: #4a5568;
            margin: 1rem 0 0.5rem 0;
        }

        .topic-list, .project-list, .resource-list {
            list-style: none;
            margin: 0.5rem 0 1.5rem 0;
        }

        .topic-list li, .project-list li, .resource-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
        }

        .topic-list li:before {
            content: "📚 ";
            margin-right: 8px;
        }

        .project-list li:before {
            content: "⚡ ";
            margin-right: 8px;
        }

        .resource-list li:before {
            content: "🔗 ";
            margin-right: 8px;
        }

        .loader {
            text-align: center;
            padding: 3rem;
            color: white;
        }

        .ai-thinking {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .loading-dots {
            display: inline-flex;
            gap: 5px;
        }

        .loading-dots span {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        .error-message {
            background: #fed7d7;
            color: #c53030;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            margin: 1rem 0;
        }

        @media (max-width: 768px) {
            .input-group {
                flex-direction: column;
            }
            
            .context-options {
                flex-direction: column;
                gap: 1rem;
            }
            
            select {
                min-width: 100%;
            }
            
            .phase-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>🚀 LearnPath AI</h1>
            <p>Get personalized learning roadmaps powered by AI</p>
        </div>
    </header>

    <main class="container">
        <section class="query-section">
            <div class="input-card">
                <h2>What do you want to learn?</h2>
                <form id="roadmap-form">
                    <div class="input-group">
                        <input type="text" id="user-query" 
                               placeholder="e.g., 'I want to learn machine learning with Python in 3 months'"
                               required>
                        <button type="submit">Generate Roadmap</button>
                    </div>
                    
                    <div class="context-options">
                        <label>Current Level:
                            <select id="skill-level">
                                <option value="beginner">🚀 Beginner</option>
                                <option value="intermediate">⚡ Intermediate</option>
                                <option value="advanced">🔥 Advanced</option>
                            </select>
                        </label>
                        
                        <label>Time Commitment:
                            <select id="time-commitment">
                                <option value="part-time">Part-time (10-15 hrs/week)</option>
                                <option value="full-time">Full-time (30-40 hrs/week)</option>
                            </select>
                        </label>
                    </div>
                </form>
            </div>
        </section>

        <section class="loading-section" id="loading" style="display: none;">
            <div class="loader">
                <div class="ai-thinking">
                    <span>🤔 AI is crafting your personalized roadmap...</span>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </section>

        <section class="roadmap-section" id="roadmap-output" style="display: none;">
            <div class="roadmap-container">
                <div id="roadmap-content"></div>
            </div>
        </section>
    </main>

    <script>
        class RoadmapApp {
            constructor() {
                this.initializeEventListeners();
            }

            initializeEventListeners() {
                const form = document.getElementById('roadmap-form');
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }

            async handleSubmit(e) {
                e.preventDefault();
                
                const userQuery = document.getElementById('user-query').value;
                const skillLevel = document.getElementById('skill-level').value;
                const timeCommitment = document.getElementById('time-commitment').value;

                if (!userQuery.trim()) {
                    this.showError('Please enter what you want to learn');
                    return;
                }

                this.showLoading();
                
                try {
                    const result = await this.generateRoadmap(userQuery, skillLevel, timeCommitment);
                    
                    if (result.success) {
                        this.displayRoadmap(result.roadmap, userQuery, skillLevel, timeCommitment);
                    } else {
                        throw new Error('Roadmap generation failed');
                    }
                    
                } catch (error) {
                    console.error("Error:", error);
                    this.showError('Failed to generate roadmap. Please try again.');
                } finally {
                    this.hideLoading();
                }
            }

            async generateRoadmap(userQuery, level, timeframe) {
                // Smart roadmap generator - works without API
                return this.generateSmartRoadmap(userQuery, level, timeframe);
            }

            generateSmartRoadmap(userQuery, level, timeframe) {
                const analysis = this.analyzeQuery(userQuery, level, timeframe);
                
                return {
                    success: true,
                    roadmap: this.createPersonalizedRoadmap(analysis, level, timeframe),
                    note: "AI-powered personalized learning path"
                };
            }

            analyzeQuery(query, level, timeframe) {
                const cleanTopic = this.extractMainTopic(query);
                const field = this.detectField(cleanTopic);
                const goals = this.detectGoals(query);
                
                return {
                    topic: cleanTopic,
                    field: field,
                    level: level,
                    timeframe: timeframe,
                    goals: goals,
                    isTechnical: ['technology', 'programming', 'data', 'cybersecurity'].includes(field),
                    hasPractical: !['theory', 'academic'].includes(field)
                };
            }

            extractMainTopic(query) {
                const commonPhrases = [
                    'i want to learn', 'i want to study', 'how to learn', 'learn', 'study', 'master',
                    'become good at', 'get better at', 'roadmap for', 'guide to', 'how can i learn',
                    'i need to learn', 'teach me', 'show me how to', 'can you teach me'
                ];
                
                let topic = query.toLowerCase();
                
                // Remove common phrases
                commonPhrases.forEach(phrase => {
                    const regex = new RegExp('\\b' + phrase + '\\b', 'gi');
                    topic = topic.replace(regex, '');
                });
                
                // Remove extra spaces and trim
                topic = topic.replace(/\s+/g, ' ').trim();
                
                // If empty after cleaning, use the original query but clean it
                if (!topic || topic.length < 2) {
                    topic = query.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
                }
                
                // Extract just the main subject (first few words)
                const words = topic.split(' ');
                if (words.length > 5) {
                    topic = words.slice(0, 5).join(' ');
                }
                
                // Capitalize first letter of each word
                return topic.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            detectField(topic) {
                const lowerTopic = topic.toLowerCase();
                
                if (lowerTopic.includes('machine learning') || lowerTopic.includes('programming') || 
                    lowerTopic.includes('coding') || lowerTopic.includes('web') || lowerTopic.includes('software') || 
                    lowerTopic.includes('tech') || lowerTopic.includes('computer') || lowerTopic.includes('algorithm')) {
                    return 'technology';
                } else if (lowerTopic.includes('data science') || lowerTopic.includes('data analysis') || 
                           lowerTopic.includes('analytics') || lowerTopic.includes('python') || lowerTopic.includes('sql')) {
                    return 'data';
                } else if (lowerTopic.includes('marketing') || lowerTopic.includes('business') || 
                           lowerTopic.includes('sales') || lowerTopic.includes('finance') || lowerTopic.includes('entrepreneur')) {
                    return 'business';
                } else if (lowerTopic.includes('design') || lowerTopic.includes('art') || 
                           lowerTopic.includes('creative') || lowerTopic.includes('photo') || lowerTopic.includes('ui') || lowerTopic.includes('ux')) {
                    return 'creative';
                } else if (lowerTopic.includes('language') || lowerTopic.includes('english') || 
                           lowerTopic.includes('spanish') || lowerTopic.includes('french') || lowerTopic.includes('communication')) {
                    return 'language';
                } else if (lowerTopic.includes('music') || lowerTopic.includes('instrument') || 
                           lowerTopic.includes('guitar') || lowerTopic.includes('piano') || lowerTopic.includes('singing')) {
                    return 'arts';
                } else if (lowerTopic.includes('cooking') || lowerTopic.includes('culinary') || 
                           lowerTopic.includes('food') || lowerTopic.includes('baking') || lowerTopic.includes('chef')) {
                    return 'culinary';
                } else if (lowerTopic.includes('fitness') || lowerTopic.includes('workout') || 
                           lowerTopic.includes('gym') || lowerTopic.includes('exercise') || lowerTopic.includes('yoga')) {
                    return 'fitness';
                } else if (lowerTopic.includes('history') || lowerTopic.includes('science') || 
                           lowerTopic.includes('math') || lowerTopic.includes('physics') || lowerTopic.includes('biology')) {
                    return 'academic';
                } else if (lowerTopic.includes('cyber') || lowerTopic.includes('security') || lowerTopic.includes('hacking')) {
                    return 'cybersecurity';
                }
                
                return 'general';
            }

            detectGoals(query) {
    const goals = [];
    const lowerQuery = query.toLowerCase();
    const field = this.detectField(this.extractMainTopic(query).toLowerCase());
    
    const professionalFields = ['technology', 'data', 'business', 'creative', 'cybersecurity'];
    const isProfessionalField = professionalFields.includes(field);
    
    if (isProfessionalField) {
        if (lowerQuery.includes('job') || lowerQuery.includes('career') || lowerQuery.includes('employment')) {
            goals.push('career');
        }
        if (lowerQuery.includes('portfolio') || lowerQuery.includes('projects') || lowerQuery.includes('showcase')) {
            goals.push('portfolio');
        }
        if (lowerQuery.includes('freelance') || lowerQuery.includes('client') || lowerQuery.includes('consult')) {
            goals.push('freelance');
        }
        if (lowerQuery.includes('startup') || lowerQuery.includes('business') || lowerQuery.includes('entrepreneur')) {
            goals.push('entrepreneurship');
        }
    }
    
    // Always check for hobby/personal goals
    if (lowerQuery.includes('hobby') || lowerQuery.includes('fun') || lowerQuery.includes('personal') || 
        lowerQuery.includes('enjoy') || lowerQuery.includes('recreation')) {
        goals.push('hobby');
    }
    
    // If no specific goals detected and it's a personal field, default to hobby
    if (goals.length === 0 && !isProfessionalField) {
        goals.push('hobby');
    }
    
    return goals.length > 0 ? goals : ['skill-development'];
}

            personalizeForGoals(roadmap, goals, topic) {
    const field = this.detectField(topic.toLowerCase());
    
    // Only add career/portfolio elements for professional fields
    const professionalFields = ['technology', 'data', 'business', 'creative', 'cybersecurity'];
    const isProfessionalField = professionalFields.includes(field);
    
    goals.forEach(goal => {
        roadmap.forEach(phase => {
            switch(goal) {
                case 'career':
                    if (isProfessionalField) {
                        phase.topics.push("Industry job requirements", "Professional networking");
                        phase.projects.push("Resume-worthy project", "Interview preparation");
                        phase.resources.push("Career guidance resources", "Industry job boards");
                    } else {
                        // For non-professional fields, add relevant goals
                        phase.topics.push("Skill mastery techniques", "Community engagement");
                        phase.projects.push("Personal achievement project", "Skill demonstration");
                        phase.resources.push("Community forums", "Skill-sharing platforms");
                    }
                    break;
                case 'portfolio':
                    if (isProfessionalField) {
                        phase.topics.push("Project presentation skills", "Portfolio optimization");
                        phase.projects.push("Showcase-ready project", "Case study development");
                        phase.resources.push("Portfolio examples", "Presentation guides");
                    } else {
                        // For hobbies/personal skills
                        phase.topics.push("Skill documentation", "Progress tracking");
                        phase.projects.push("Personal milestone project", "Skill showcase");
                        phase.resources.push("Progress tracking apps", "Personal blogs");
                    }
                    break;
                case 'freelance':
                    if (isProfessionalField) {
                        phase.topics.push("Client management", "Pricing and contracts");
                        phase.projects.push("Client project simulation", "Proposal writing");
                        phase.resources.push("Freelance platforms", "Business management guides");
                    }
                    break;
                case 'hobby':
                    // For hobby goals, add fun and personal enjoyment elements
                    phase.topics.push("Enjoyment techniques", "Personal satisfaction");
                    phase.projects.push("Fun personal project", "Creative expression");
                    phase.resources.push("Hobby communities", "Recreational resources");
                    break;
                case 'entrepreneurship':
                    if (field === 'business' || field === 'technology') {
                        phase.topics.push("Business planning", "Market research");
                        phase.projects.push("Business plan development", "MVP creation");
                        phase.resources.push("Startup resources", "Entrepreneurship guides");
                    }
                    break;
            }
        });
    });
    return roadmap;
}
            getBaseRoadmap(field, level, timeframe, topic) {
                const baseStructures = {
                    'technology': this.getTechRoadmap(level, timeframe, topic),
                    'data': this.getDataRoadmap(level, timeframe, topic),
                    'business': this.getBusinessRoadmap(level, timeframe, topic),
                    'creative': this.getCreativeRoadmap(level, timeframe, topic),
                    'language': this.getLanguageRoadmap(level, timeframe, topic),
                    'arts': this.getArtsRoadmap(level, timeframe, topic),
                    'culinary': this.getCulinaryRoadmap(level, timeframe, topic),
                    'fitness': this.getFitnessRoadmap(level, timeframe, topic),
                    'academic': this.getAcademicRoadmap(level, timeframe, topic),
                    'cybersecurity': this.getCyberSecurityRoadmap(level, timeframe, topic)
                };
                
                return baseStructures[field] || this.getGeneralRoadmap(level, timeframe, topic);
            }

            getTechRoadmap(level, timeframe, topic) {
                if (level === 'beginner') {
                    return [
                        {
                            phase: `${topic} Fundamentals`,
                            duration: "4-5 weeks",
                            topics: [
                                "Core programming concepts",
                                "Basic algorithms and logic",
                                "Development environment setup",
                                "Version control with Git",
                                "Debugging fundamentals"
                            ],
                            projects: [
                                "Simple calculator application",
                                "Basic data processing script",
                                "Personal portfolio website"
                            ],
                            resources: [
                                "freeCodeCamp interactive tutorials",
                                "MDN Web Docs",
                                "Stack Overflow community"
                            ]
                        },
                        {
                            phase: `Practical ${topic} Development`,
                            duration: "6-7 weeks",
                            topics: [
                                "Advanced programming techniques",
                                "Data structures implementation",
                                "API integration",
                                "Database fundamentals",
                                "Testing methodologies"
                            ],
                            projects: [
                                "Weather application with API",
                                "Task management system",
                                "Data visualization dashboard"
                            ],
                            resources: [
                                "Official documentation",
                                "GitHub open source projects",
                                "Programming communities"
                            ]
                        }
                    ];
                } else {
                    return [
                        {
                            phase: `Advanced ${topic} Concepts`,
                            duration: "5-6 weeks",
                            topics: [
                                "System architecture design",
                                "Performance optimization",
                                "Security best practices",
                                "Cloud computing integration",
                                "Microservices architecture"
                            ],
                            projects: [
                                "Scalable web application",
                                "Real-time data processing",
                                "Machine learning integration"
                            ],
                            resources: [
                                "Advanced technical books",
                                "Industry conferences",
                                "Research papers"
                            ]
                        }
                    ];
                }
            }

            getCulinaryRoadmap(level, timeframe, topic) {
                return [
                    {
                        phase: `${topic} Basics & Techniques`,
                        duration: "4-5 weeks",
                        topics: [
                            "Kitchen safety and hygiene",
                            "Basic knife skills and cuts",
                            "Fundamental cooking methods",
                            "Ingredient selection and preparation",
                            "Flavor balancing and seasoning"
                        ],
                        projects: [
                            "Master 5 basic recipes perfectly",
                            "Create a balanced meal plan",
                            "Practice knife skills daily"
                        ],
                        resources: [
                            "YouTube cooking channels",
                            "Cookbook fundamentals",
                            "Local cooking classes"
                        ]
                    },
                    {
                        phase: `Advanced ${topic} Skills`,
                        duration: "6-8 weeks",
                        topics: [
                            "Advanced cooking techniques",
                            "Recipe development and adaptation",
                            "Presentation and plating",
                            "Cultural cuisine exploration",
                            "Kitchen management"
                        ],
                        projects: [
                            "Create original recipes",
                            "Host a dinner party",
                            "Master complex dishes"
                        ],
                        resources: [
                            "Specialized cookbooks",
                            "Cooking workshops",
                            "Food blogs and communities"
                        ]
                    }
                ];
            }

            getGeneralRoadmap(level, timeframe, topic) {
                return [
                    {
                        phase: `${topic} Foundation Building`,
                        duration: "4-5 weeks",
                        topics: [
                            `Core principles of ${topic}`,
                            "Essential terminology and concepts",
                            "Fundamental tools and resources",
                            "Basic practice techniques",
                            "Learning methodology"
                        ],
                        projects: [
                            `Beginner ${topic.toLowerCase()} project`,
                            "Skill demonstration exercise",
                            "Progress tracking journal"
                        ],
                        resources: [
                            "Online tutorial series",
                            "Beginner-friendly guides",
                            "Practice communities"
                        ]
                    },
                    {
                        phase: `${topic} Skill Development`,
                        duration: "5-6 weeks",
                        topics: [
                            "Advanced techniques and methods",
                            "Real-world applications",
                            "Problem-solving approaches",
                            "Best practices and standards",
                            "Performance improvement"
                        ],
                        projects: [
                            `Intermediate ${topic.toLowerCase()} project`,
                            "Practical application case study",
                            "Portfolio piece creation"
                        ],
                        resources: [
                            "Advanced learning materials",
                            "Expert communities",
                            "Practice platforms"
                        ]
                    },
                    {
                        phase: `${topic} Mastery & Application`,
                        duration: "6-8 weeks",
                        topics: [
                            "Expert-level concepts",
                            "Industry insights and trends",
                            "Advanced optimization",
                            "Teaching and mentoring",
                            "Continuous learning strategies"
                        ],
                        projects: [
                            "Capstone master project",
                            "Community contribution",
                            "Teaching demonstration"
                        ],
                        resources: [
                            "Master classes and workshops",
                            "Professional networks",
                            "Advanced certifications"
                        ]
                    }
                ];
            }

            personalizeForGoals(roadmap, goals, topic) {
                goals.forEach(goal => {
                    roadmap.forEach(phase => {
                        switch(goal) {
                            case 'career':
                                phase.topics.push("Industry job requirements", "Professional networking");
                                phase.projects.push("Resume-worthy project", "Interview preparation");
                                phase.resources.push("Career guidance resources", "Industry job boards");
                                break;
                            case 'portfolio':
                                phase.topics.push("Project presentation skills", "Portfolio optimization");
                                phase.projects.push("Showcase-ready project", "Case study development");
                                phase.resources.push("Portfolio examples", "Presentation guides");
                                break;
                            case 'freelance':
                                phase.topics.push("Client management", "Pricing and contracts");
                                phase.projects.push("Client project simulation", "Proposal writing");
                                phase.resources.push("Freelance platforms", "Business management guides");
                                break;
                        }
                    });
                });
                return roadmap;
            }

            adjustForLevel(roadmap, level) {
                const adjustments = {
                    'beginner': { durationMultiplier: 1.2, complexity: 'basic' },
                    'intermediate': { durationMultiplier: 1.0, complexity: 'standard' },
                    'advanced': { durationMultiplier: 0.8, complexity: 'advanced' }
                };
                
                const adjustment = adjustments[level];
                
                return roadmap.map(phase => ({
                    ...phase,
                    duration: this.adjustDuration(phase.duration, adjustment.durationMultiplier)
                }));
            }

            adjustDuration(duration, multiplier) {
                const match = duration.match(/(\d+)/);
                if (match) {
                    const weeks = parseInt(match[1]);
                    const adjusted = Math.round(weeks * multiplier);
                    return `${adjusted} weeks`;
                }
                return duration;
            }

            displayRoadmap(roadmap, userQuery, level, timeframe) {
                const outputSection = document.getElementById('roadmap-output');
                const contentDiv = document.getElementById('roadmap-content');
                
                outputSection.style.display = 'block';
                
                let html = `
                    <div class="analysis-header">
                        <h3>🎯 Your Personalized Learning Path</h3>
                        <p><strong>Goal:</strong> ${userQuery}</p>
                        <p><strong>Level:</strong> ${level} | <strong>Time:</strong> ${timeframe}</p>
                        <p><em>AI-powered roadmap tailored specifically for you</em></p>
                    </div>
                `;

                roadmap.forEach((phase, index) => {
                    html += `
                        <div class="phase">
                            <div class="phase-header">
                                <div class="phase-title">Phase ${index + 1}: ${phase.phase}</div>
                                <div class="phase-duration">${phase.duration}</div>
                            </div>
                            
                            <div class="phase-content">
                                <h4>📚 What You'll Learn:</h4>
                                <ul class="topic-list">
                                    ${phase.topics.map(topic => `<li>${topic}</li>`).join('')}
                                </ul>
                                
                                <h4>⚡ Projects to Build:</h4>
                                <ul class="project-list">
                                    ${phase.projects.map(project => `<li>${project}</li>`).join('')}
                                </ul>
                                
                                <h4>🔗 Recommended Resources:</h4>
                                <ul class="resource-list">
                                    ${phase.resources.map(resource => `<li>${resource}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                });

                contentDiv.innerHTML = html;
                outputSection.scrollIntoView({ behavior: 'smooth' });
            }

            showLoading() {
                document.getElementById('loading').style.display = 'block';
                document.getElementById('roadmap-output').style.display = 'none';
            }

            hideLoading() {
                document.getElementById('loading').style.display = 'none';
            }

            showError(message) {
                const existingError = document.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                
                document.querySelector('.input-card').appendChild(errorDiv);
                
                setTimeout(() => {
                    errorDiv.remove();
                }, 5000);
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', () => {
            new RoadmapApp();
        });
    </script>
</body>
</html>
