const { GoogleGenerativeAI } = require("@google/generative-ai");

const evaluateAnswer = async (role, category, questionText, answerText, suggestedAnswer = "") => {
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Detect poor/incorrect/empty answers locally first to ensure instant, high-quality, and robust response
  const cleanedAnswer = (answerText || "").trim().toLowerCase();
  const isPoorAnswer = 
    cleanedAnswer.length === 0 ||
    cleanedAnswer === "no idea" ||
    cleanedAnswer.includes("don't know") ||
    cleanedAnswer.includes("dont know") ||
    cleanedAnswer === "idk" ||
    cleanedAnswer === "skip" ||
    cleanedAnswer === "none" ||
    cleanedAnswer === "test" ||
    cleanedAnswer.split(/\s+/).length < 4;

  if (isPoorAnswer) {
    return getMockEvaluation(answerText, suggestedAnswer, questionText);
  }

  if (!apiKey || apiKey.startsWith("AQ.YOUR_MOCK")) {
    console.warn("Using mock evaluation fallback since Gemini API Key is not set or placeholder.");
    return getMockEvaluation(answerText, suggestedAnswer, questionText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert technical and HR interviewer. Evaluate the candidate's answer for the following question.
      
      Candidate Role: ${role}
      Question Category: ${category}
      Question: "${questionText}"
      Candidate's Answer: "${answerText}"
      Suggested Ideal Answer for Reference: "${suggestedAnswer}"

      CRITICAL INSTRUCTIONS:
      1. If the candidate's answer is incorrect, irrelevant, or indicates lack of knowledge (even if not caught by pre-filters):
         - Assign a low score (between 0 and 20).
         - In the "weaknesses" list, explicitly explain that the answer is incorrect, insufficient, or missing core concepts.
         - In "strengths", put a note stating the answer needs improvement.
         - In "improvedAnswer", provide a short, concise, and refined model answer based on the Suggested Ideal Answer.
         - In "tips", provide actionable recommendations and suggestions to learn this topic.
      2. If the candidate's answer is a valid attempt, evaluate it fairly on a scale of 0 to 100 based on accuracy and technical depth.

      Provide your evaluation in a strictly formatted JSON response. Do not include any markdown formatting like \`\`\`json or \`\`\` around the JSON.
      Your output must be a single parseable JSON object with the exact fields:
      - score: A number between 0 and 100 indicating answer quality
      - strengths: An array of strings highlighting specific positive aspects of their answer
      - weaknesses: An array of strings pointing out missed details, incorrect statements, or areas for improvement
      - improvedAnswer: A highly refined, professional model answer (in the first person) that showcases how they should have answered the question
      - tips: An array of short, actionable tips to perform better next time

      JSON:
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    console.log("Gemini API Response received (length:", responseText.length, "chars)");

    try {
      // Clean any markdown formatting that may wrap the JSON
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      cleanedResponse = cleanedResponse.trim();

      const evaluation = JSON.parse(cleanedResponse);
      return {
        score: typeof evaluation.score === "number" ? evaluation.score : 70,
        strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : ["Attempted response"],
        weaknesses: Array.isArray(evaluation.weaknesses) ? evaluation.weaknesses : ["Could add more details"],
        improvedAnswer: evaluation.improvedAnswer || suggestedAnswer || "A revised model answer based on your skills.",
        tips: Array.isArray(evaluation.tips) ? evaluation.tips : ["Review concepts in depth."],
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON, falling back to mock parser", parseError.message);
      return parseRawResponse(responseText, suggestedAnswer, questionText);
    }
  } catch (error) {
    console.error("Gemini API Error, falling back to mock evaluation:", error.message);
    return getMockEvaluation(answerText, suggestedAnswer, questionText);
  }
};

const parseRawResponse = (text, suggestedAnswer = "", questionText = "") => {
  try {
    const scoreMatch = text.match(/"score":\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
    return {
      score,
      strengths: ["Clear communication structure", "Good core conceptual understanding"],
      weaknesses: ["Can provide deeper practical implementation details"],
      improvedAnswer: suggestedAnswer || "Here is a refined version of your answer integrating industry best practices.",
      tips: ["Structure using the STAR framework.", "Mention real-world project usage."],
    };
  } catch (e) {
    return getMockEvaluation("", suggestedAnswer, questionText);
  }
};

const getMockEvaluation = (answerText, suggestedAnswer = "", questionText = "") => {
  const cleanedAnswer = (answerText || "").trim().toLowerCase();
  
  const isPoorAnswer = 
    cleanedAnswer.length === 0 ||
    cleanedAnswer === "no idea" ||
    cleanedAnswer.includes("don't know") ||
    cleanedAnswer.includes("dont know") ||
    cleanedAnswer === "idk" ||
    cleanedAnswer === "skip" ||
    cleanedAnswer === "none" ||
    cleanedAnswer === "test" ||
    cleanedAnswer.split(/\s+/).length < 4;

  if (isPoorAnswer) {
    return {
      score: 10,
      strengths: [
        "No strengths identified. The response was empty, incorrect, or indicated no knowledge of the topic."
      ],
      weaknesses: [
        "Your answer is incorrect, empty, or insufficient to evaluate.",
        `The question specifically asks about: "${questionText || "the specified topic"}"`,
      ],
      improvedAnswer: suggestedAnswer || "A proper answer should explain the core concepts of the question clearly and accurately.",
      tips: [
        "Review the suggested refined model answer to build your knowledge base.",
        "Take time to study the key concepts related to this question's category.",
        "Try to formulate at least a basic explanation, even if you are not fully certain next time."
      ]
    };
  }

  const wordCount = answerText ? answerText.split(/\s+/).length : 0;
  let score = 55;
  if (wordCount > 15) score = 70;
  if (wordCount > 30) score = 82;
  if (wordCount > 60) score = 90;

  return {
    score,
    strengths: [
      "Attempted to answer the question with a reasonable description.",
      "Response shows willingness to communicate thoughts and structure the answer."
    ],
    weaknesses: [
      "Could incorporate more concrete real-world examples.",
      "Technical details could be expanded to demonstrate depth of experience."
    ],
    improvedAnswer: suggestedAnswer || "A comprehensive response should explain the concept directly, provide a brief example, and highlight best practices.",
    tips: [
      "Structure your answer using the STAR method for behavioral questions, or the Concept-Example-Benefit format for technical ones.",
      "Be concise but descriptive with technical terminology.",
      "Explain the trade-offs or decisions behind your technical choices."
    ]
  };
};

module.exports = {
  evaluateAnswer,
};
