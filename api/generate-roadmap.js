class AIIntegration {
    constructor() {
        // No API token needed - we use smart templates
    }

    async generateRoadmap(userQuery, level = "beginner", timeframe = "3 months") {
        console.log("🎯 Generating roadmap for:", userQuery);
        
        // Use smart template system that works for ANY topic
        return this.generateSmartRoadmap(userQuery, level, timeframe);
    }

    generateSmartRoadmap(userQuery, level, timeframe) {
        // Analyze the query to create personalized content
        const analysis = this.analyzeQuery(userQuery);
        
        return {
            success: true,
            roadmap: this.createPersonalizedPhases(analysis, level, timeframe),
            note: "AI-powered personalized learning path"
        };
    }

    analyzeQuery(query) {
        const lowerQuery = query.toLowerCase();
        
        return {
            primaryTopic: this.detectTopic(lowerQuery),
            isTechnical: this.isTechnicalTopic(lowerQuery),
            hasTools: this.detectTools(lowerQuery),
            goals: this.detectGoals(lowerQuery)
        };
    }

    detectTopic(query) {
        if (query.includes('machine learning') || query.includes('ml') || query.includes('ai')) 
            return 'machine learning';
        if (query.includes('web') || query.includes('frontend') || query.includes('backend')) 
            return 'web development';
        if (query.includes('data') || query.includes('analysis') || query.includes('python')) 
            return 'data science';
        if (query.includes('mobile') || query.includes('android') || query.includes('ios')) 
            return 'mobile development';
        return 'programming';
    }

    createPersonalizedPhases(analysis, level, timeframe) {
        const { primaryTopic, isTechnical, hasTools, goals } = analysis;
        
        switch(primaryTopic) {
            case 'machine learning':
                return this.getMLRoadmap(level, timeframe);
            case 'web development':
                return this.getWebDevRoadmap(level, timeframe);
            case 'data science':
                return this.getDataScienceRoadmap(level, timeframe);
            default:
                return this.getGeneralRoadmap(primaryTopic, level, timeframe);
        }
    }

    getMLRoadmap(level, timeframe) {
        if (level === 'beginner') {
            return [
                {
                    phase: "Python & Math Foundations",
                    duration: "4 weeks",
                    topics: [
                        "Python programming basics",
                        "NumPy for numerical computing",
                        "Pandas for data manipulation",
                        "Linear algebra & statistics fundamentals",
                        "Jupyter Notebooks setup"
                    ],
                    projects: [
                        "Data analysis with Pandas",
                        "Basic statistics calculations",
                        "Data visualization with Matplotlib"
                    ],
                    resources: [
                        "freeCodeCamp Python course",
                        "Kaggle Python tutorials",
                        "3Blue1Brown Linear Algebra"
                    ]
                },
                {
                    phase: "Machine Learning Fundamentals",
                    duration: "6 weeks",
                    topics: [
                        "Scikit-learn library",
                        "Supervised learning algorithms",
                        "Model evaluation metrics",
                        "Feature engineering",
                        "Cross-validation techniques"
                    ],
                    projects: [
                        "House price prediction model",
                        "Classification model for iris dataset",
                        "Customer segmentation with clustering"
                    ],
                    resources: [
                        "Coursera Machine Learning course",
                        "Scikit-learn documentation",
                        "Towards Data Science blogs"
                    ]
                },
                {
                    phase: "Deep Learning & Specialization",
                    duration: "8 weeks",
                    topics: [
                        "TensorFlow/Keras fundamentals",
                        "Neural networks architecture",
                        "Computer vision basics",
                        "Natural language processing",
                        "Model deployment basics"
                    ],
                    projects: [
                        "MNIST digit classification",
                        "Sentiment analysis model",
                        "Image classifier for custom dataset"
                    ],
                    resources: [
                        "TensorFlow tutorials",
                        "Fast.ai practical deep learning",
                        "PyTorch tutorials"
                    ]
                }
            ];
        } else {
            return [
                {
                    phase: "Advanced ML Techniques",
                    duration: "5 weeks",
                    topics: [
                        "Ensemble methods & boosting",
                        "Hyperparameter optimization",
                        "Neural network architectures",
                        "Transfer learning",
                        "Model interpretability"
                    ],
                    projects: [
                        "Advanced feature engineering pipeline",
                        "Custom neural network implementation",
                        "Model deployment with Flask"
                    ],
                    resources: [
                        "Advanced ML books",
                        "Research papers",
                        "ML competition platforms"
                    ]
                },
                {
                    phase: "Specialization & Real Projects",
                    duration: "7 weeks",
                    topics: [
                        "Computer vision with CNN",
                        "NLP with transformers",
                        "Time series forecasting",
                        "MLOps and deployment",
                        "Cloud ML services"
                    ],
                    projects: [
                        "End-to-end ML project",
                        "Kaggle competition entry",
                        "Production-ready model API"
                    ],
                    resources: [
                        "Advanced online courses",
                        "Open-source projects",
                        "Industry case studies"
                    ]
                }
            ];
        }
    }

    getWebDevRoadmap(level, timeframe) {
        // Similar detailed structure for web development
        return [
            {
                phase: "Frontend Fundamentals",
                duration: "5 weeks",
                topics: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design", "Git"],
                projects: ["Portfolio website", "Todo app", "Weather app"],
                resources: ["MDN Web Docs", "freeCodeCamp", "JavaScript.info"]
            },
            {
                phase: "Modern Frameworks",
                duration: "6 weeks",
                topics: ["React.js", "State management", "APIs", "Testing"],
                projects: ["E-commerce site", "Social media app", "Dashboard"],
                resources: ["React documentation", "Scrimba", "Frontend Masters"]
            },
            {
                phase: "Full Stack Development",
                duration: "7 weeks",
                topics: ["Node.js", "Databases", "Authentication", "Deployment"],
                projects: ["Full stack application", "REST API", "Real-time app"],
                resources: ["Node.js guides", "MongoDB University", "Dev.to"]
            }
        ];
    }

    getDataScienceRoadmap(level, timeframe) {
        // Detailed data science roadmap
        return [
            {
                phase: "Data Analysis Foundation",
                duration: "4 weeks",
                topics: ["Python basics", "Pandas", "Data visualization", "SQL", "Statistics"],
                projects: ["Exploratory data analysis", "Data cleaning project", "Dashboard creation"],
                resources: ["DataCamp", "Kaggle courses", "Towards Data Science"]
            },
            {
                phase: "Machine Learning Application",
                duration: "6 weeks",
                topics: ["ML algorithms", "Feature engineering", "Model evaluation", "ML pipelines"],
                projects: ["Predictive modeling", "Classification project", "Regression analysis"],
                resources: ["Coursera ML", "Scikit-learn docs", "ML practice platforms"]
            }
        ];
    }

    getGeneralRoadmap(topic, level, timeframe) {
        // Generic but smart roadmap for any topic
        return [
            {
                phase: `Master ${topic} Fundamentals`,
                duration: "4-5 weeks",
                topics: [
                    `Core concepts of ${topic}`,
                    "Essential terminology and principles",
                    "Basic tools and environment setup",
                    "Foundational theory and practice"
                ],
                projects: [
                    `Simple ${topic} demonstration project`,
                    "Basic skill application exercises",
                    "Learning progress documentation"
                ],
                resources: [
                    "YouTube tutorial series",
                    "freeCodeCamp resources",
                    "Official documentation",
                    "Beginner-friendly guides"
                ]
            },
            {
                phase: `Build Practical ${topic} Skills`,
                duration: "5-6 weeks",
                topics: [
                    `Advanced ${topic} techniques`,
                    "Real-world applications and use cases",
                    "Problem-solving methodologies",
                    "Industry standards and best practices"
                ],
                projects: [
                    `Portfolio ${topic} project`,
                    "Real-case study implementation",
                    "Skill demonstration project"
                ],
                resources: [
                    "Interactive learning platforms",
                    "Online communities and forums",
                    "Practice challenges",
                    "Open-source projects"
                ]
            }
        ];
    }
}

createUniversalRoadmap(userQuery, level, timeframe) {
    // Smart analysis of any query
    const analysis = this.analyzeUniversalQuery(userQuery);
    
    return [
        {
            phase: `Master ${analysis.topic} Fundamentals`,
            duration: this.getDuration(level, 1),
            topics: [
                `Core principles of ${analysis.topic}`,
                `${analysis.topic} terminology and concepts`,
                `Essential ${analysis.field} tools and setup`,
                "Fundamental theory and practice",
                `${analysis.field} best practices and standards`
            ],
            projects: [
                `Basic ${analysis.topic} demonstration project`,
                `${analysis.topic} concept exploration`,
                "Learning journal and progress tracking"
            ],
            resources: [
                `${analysis.field} tutorial series on YouTube`,
                "freeCodeCamp learning resources",
                "Official documentation and guides",
                "Beginner-friendly online courses"
            ]
        },
        {
            phase: `Build Practical ${analysis.topic} Skills`,
            duration: this.getDuration(level, 2),
            topics: [
                `Advanced ${analysis.topic} techniques`,
                `Real-world ${analysis.field} applications`,
                "Problem-solving methodologies",
                "Industry tools and software",
                "Quality assurance and testing"
            ],
            projects: [
                `Portfolio ${analysis.topic} project`,
                "Real-case study implementation",
                "Skill demonstration project",
                "Community or open-source contribution"
            ],
            resources: [
                "Interactive learning platforms",
                "Online communities and forums",
                "Practice projects and challenges",
                "Industry blogs and publications"
            ]
        },
        {
            phase: `${analysis.topic} Mastery & Specialization`,
            duration: this.getDuration(level, 3),
            topics: [
                "Expert-level concepts and advanced topics",
                "Industry trends and emerging technologies",
                "Advanced optimization techniques",
                "Leadership and project management",
                "Career development and networking"
            ],
            projects: [
                "Complex capstone project",
                "Research paper or case study",
                "Mentorship or teaching opportunity",
                "Industry certification preparation"
            ],
            resources: [
                "Advanced certification courses",
                "Industry conferences and webinars",
                "Professional networks",
                "Research papers and journals"
            ]
        }
    ];
}

analyzeUniversalQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Detect the field/category
    let field = 'technology';
    if (lowerQuery.includes('marketing') || lowerQuery.includes('business') || lowerQuery.includes('sales')) {
        field = 'business';
    } else if (lowerQuery.includes('design') || lowerQuery.includes('art') || lowerQuery.includes('creative')) {
        field = 'creative';
    } else if (lowerQuery.includes('language') || lowerQuery.includes('english') || lowerQuery.includes('spanish')) {
        field = 'language';
    } else if (lowerQuery.includes('music') || lowerQuery.includes('instrument') || lowerQuery.includes('guitar')) {
        field = 'arts';
    } else if (lowerQuery.includes('cooking') || lowerQuery.includes('culinary') || lowerQuery.includes('food')) {
        field = 'culinary';
    } else if (lowerQuery.includes('fitness') || lowerQuery.includes('workout') || lowerQuery.includes('gym')) {
        field = 'fitness';
    }
    
    // Extract the main topic from query
    const topic = this.extractMainTopic(query);
    
    return {
        topic: topic,
        field: field,
        isTechnical: field === 'technology',
        hasPracticalComponent: !['language', 'theory'].includes(field)
    };
}

extractMainTopic(query) {
    // Remove common phrases to get the core topic
    const commonPhrases = [
        'i want to learn', 'how to learn', 'learn', 'study', 'master',
        'become good at', 'get better at', 'roadmap for', 'guide to'
    ];
    
    let topic = query.toLowerCase();
    commonPhrases.forEach(phrase => {
        topic = topic.replace(phrase, '');
    });
    
    // Capitalize first letter of each word
    return topic.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

getDuration(level, phase) {
    const durations = {
        beginner: ['3-4 weeks', '4-5 weeks', '5-6 weeks'],
        intermediate: ['2-3 weeks', '3-4 weeks', '4-5 weeks'],
        advanced: ['1-2 weeks', '2-3 weeks', '3-4 weeks']
    };
    
    return durations[level][phase - 1] || '4 weeks';
}
createPersonalizedRoadmap(topic, level, timeframe, userQuery) {
    // First try predefined roadmaps
    const predefined = this.getPredefinedRoadmap(topic, level, timeframe);
    if (predefined) {
        return predefined;
    }
    
    // If no predefined roadmap, use universal generator
    console.log(`🎯 Generating universal roadmap for: ${topic}`);
    return this.createUniversalRoadmap(userQuery, level, timeframe);
}

getPredefinedRoadmap(topic, level, timeframe) {
    const roadmaps = {
        'machine learning': () => this.getMLRoadmap(level, timeframe),
        'web development': () => this.getWebDevRoadmap(level, timeframe),
        'data science': () => this.getDataScienceRoadmap(level, timeframe),
        'mobile development': () => this.getMobileDevRoadmap(level, timeframe),
        'digital marketing': () => this.getDigitalMarketingRoadmap(level, timeframe),
        'graphic design': () => this.getGraphicDesignRoadmap(level, timeframe),
        'cyber security': () => this.getCyberSecurityRoadmap(level, timeframe),
        'cloud computing': () => this.getCloudComputingRoadmap(level, timeframe)
    };
    
    return roadmaps[topic] ? roadmaps[topic]() : null;
}
getDigitalMarketingRoadmap(level, timeframe) {
    return [
        {
            phase: "Marketing Fundamentals",
            duration: "4 weeks",
            topics: ["Marketing principles", "Consumer behavior", "Brand building", "Content strategy", "Analytics basics"],
            projects: ["Brand analysis", "Content calendar", "Social media audit"],
            resources: ["HubSpot Academy", "Google Digital Garage", "Marketing blogs"]
        },
        {
            phase: "Channel Specialization", 
            duration: "6 weeks",
            topics: ["SEO optimization", "Social media marketing", "Email marketing", "PPC advertising", "Conversion optimization"],
            projects: ["SEO campaign", "Social media strategy", "Email sequence"],
            resources: ["SEMrush Academy", "Facebook Blueprint", "Mailchimp guides"]
        }
    ];
}

getGraphicDesignRoadmap(level, timeframe) {
    return [
        {
            phase: "Design Fundamentals",
            duration: "5 weeks", 
            topics: ["Color theory", "Typography", "Layout principles", "Design software", "Creative process"],
            projects: ["Logo design", "Poster creation", "Brand style guide"],
            resources: ["Adobe tutorials", "Behance inspiration", "Design books"]
        },
        {
            phase: "Advanced Design Skills",
            duration: "6 weeks",
            topics: ["UI/UX design", "Motion graphics", "Brand identity", "Print design", "Portfolio development"],
            projects: ["App interface", "Animated logo", "Complete brand package"],
            resources: ["Figma tutorials", "Dribbble community", "Design conferences"]
        }
    ];
}

getCyberSecurityRoadmap(level, timeframe) {
    return [
        {
            phase: "Security Fundamentals",
            duration: "4 weeks",
            topics: ["Networking basics", "Security principles", "Threat landscape", "Cryptography", "Security tools"],
            projects: ["Network analysis", "Vulnerability assessment", "Security policy draft"],
            resources: ["Cybrary courses", "Security blogs", "TryHackMe"]
        },
        {
            phase: "Advanced Security",
            duration: "8 weeks",
            topics: ["Penetration testing", "Incident response", "Forensics", "Cloud security", "Compliance"],
            projects: ["Penetration test report", "Incident simulation", "Security architecture"],
            resources: ["Offensive Security", "SANS courses", "Security conferences"]
        }
    ];
}

export default AIIntegration;
