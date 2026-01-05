import { dummySolutions, dummyProblems } from '../data/dummyData';

const GEMINI_API_KEY = "AIzaSyDkIrvGFOG4WL8vokgHq1ZCjucX40L7JgM";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const analyzeIdeaWithGemini = async (userIdea) => {
    try {
        // 1. Prepare the Context (Existing Ideas)
        // We combine Solutions (Ideas) and Problems to check against.
        // For specific duplicate checking, we arguably care most about Solutions.
        const contextList = [...dummySolutions, ...dummyProblems].map(item => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            type: item.type
        }));

        // 2. Construct the Prompt
        const prompt = {
            contents: [{
                parts: [{
                    text: `
            You are an AI Validation Engine for "InnoLink", an innovation platform.
            
            **Task**: Analyze the User's Idea against our Existing Database to check for duplicates and provide a summary.
            
            **User's Idea**:
            "${userIdea}"
            
            **Existing Database** (JSON subset):
            ${JSON.stringify(contextList.slice(0, 15))} 
            
            **Instructions**:
            1. **Summarize**: Create a concise, professional 1-sentence summary of the User's Idea.
            2. **Check Similarity**: meaningful semantic overlap with any item in the database?
               - If similarity > 70%: Mark as Duplicate. Suggest "Collaborate".
               - If similarity 40-70%: Mark as Similar. Suggest "Improve uniqueness".
               - If similarity < 40%: Mark as New. Suggest "Publish".
            3. **Output JSON ONLY**:
            {
              "summary": "string",
              "isDuplicate": boolean,
              "score": number (0-100),
              "recommendation": "Publish" | "Collaborate" | "Improve uniqueness",
              "matchedItem": { "id": "string", "title": "string", "author": "string" } (or null if no match)
            }
          `
                }]
            }]
        };

        // 3. Output Validation & Fetch
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prompt)
        });

        const data = await response.json();

        // 4. Parse Response
        if (data.candidates && data.candidates[0].content) {
            const rawText = data.candidates[0].content.parts[0].text;
            // Clean markdown code blocks if present
            const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(jsonString);

            // Add UI colors based on recommendation (Client-side helper)
            if (result.recommendation === 'Publish') {
                result.color = '#22c55e'; result.bg = '#f0fdf4';
            } else if (result.recommendation === 'Collaborate') {
                result.color = '#dc2626'; result.bg = '#fef2f2';
            } else {
                result.color = '#f59e0b'; result.bg = '#fffbeb';
            }

            return result;
        } else {
            throw new Error("No candidate response");
        }

    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        // Fallback Mock (Graceful degradation)
        return {
            summary: "Analysis unavailable. Proceeding with manual review.",
            isDuplicate: false,
            score: 0,
            recommendation: "Publish",
            matchedItem: null,
            color: '#22c55e', bg: '#f0fdf4'
        };
    }
};
