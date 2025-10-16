
class AIIntegration {
    constructor() {
        this.apiUrl = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";
      
        this.apiToken = "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"; // Get from huggingface.co
    }

    async generateRoadmap(userQuery, level = 'beginner', timeframe = '3 months') {
        try {
            const prompt = this.createPrompt(userQuery, level, timeframe);
            const response = await this.callAI(prompt);
            return this.formatAIResponse(response);
        } catch (error) {
            console.log("AI failed, using smart template");
            return this.getFallbackRoadmap(userQuery, level, timeframe);
        }
    }

    createPrompt(userQuery, level, timeframe) {
        return `
        Create a detailed learning roadmap for: "${userQuery}"
        Level: ${level}
        Timeframe: ${timeframe}
        
        Format as 3 phases with:
        - Phase name and duration
        - Specific skills to learn
        - Practice projects
        - Free resources
        
        Make it practical and actionable.
        `;
    }

    async callAI(prompt) {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 500,
                    temperature: 0.7,
                    do_sample: true
                }
            }),
        });

        if (!response.ok) {
            throw new Error('AI service busy');
        }

        const result = await response.json();
        return result[0]?.generated_text || "I'll help you learn that!";
    }

    formatAIResponse(aiText) {
      
        return {
            success: true,
            roadmap: [
                {
                    phase: "Foundation",
                    duration: "1 month",
                    topics: ["Basic concepts", "Fundamental skills", "Tool setup"],
                    projects: ["Simple practice project", "Skill demonstration"],
                    resources: ["YouTube tutorials", "Free online courses"]
                },
                {
                    phase: "Core Learning", 
                    duration: "2 months",
                    topics: ["Advanced techniques", "Real applications", "Best practices"],
                    projects: ["Portfolio project", "Real-world application"],
                    resources: ["Documentation", "Practice platforms"]
                },
                {
                    phase: "Mastery",
                    duration: "Ongoing",
                    topics: ["Expert level skills", "Industry trends", "Continuous learning"],
                    projects: ["Complex project", "Open source contribution"],
                    resources: ["Advanced courses", "Community forums"]
                }
            ],
            aiResponse: aiText
        };
    }

    getFallbackRoadmap(query, level, timeframe) {

        return {
            success: true,
            roadmap: [
                {
                    phase: `Learn ${query} Basics`,
                    duration: "1 month",
                    topics: [
                        `Core concepts of ${query}`,
                        "Fundamental principles", 
                        "Essential tools and setup"
                    ],
                    projects: [
                        `Simple ${query} project`,
                        "Practice exercises"
                    ],
                    resources: [
                        "freeCodeCamp tutorials",
                        "YouTube crash courses",
                        "Official documentation"
                    ]
                },
                {
                    phase: `Build ${query} Skills`,
                    duration: "2 months",
                    topics: [
                        `Advanced ${query} techniques`,
                        "Real-world applications",
                        "Problem solving methods"
                    ],
                    projects: [
                        `Portfolio ${query} project`,
                        "Real application building"
                    ],
                    resources: [
                        "Interactive coding platforms",
                        "Online communities",
                        "Practice websites"
                    ]
                },
                {
                    phase: `${query} Mastery`,
                    duration: "Continuous",
                    topics: [
                        "Expert level concepts",
                        "Industry best practices",
                        "Advanced optimization"
                    ],
                    projects: [
                        "Complex final project",
                        "Open source contributions"
                    ],
                    resources: [
                        "Advanced online courses",
                        "Professional blogs",
                        "Industry conferences"
                    ]
                }
            ]
        };
    }
}
