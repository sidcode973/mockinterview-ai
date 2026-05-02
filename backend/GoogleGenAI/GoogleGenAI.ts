import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateQuestions = async (
  industry: string,
  topic: string,
  type: string,
  role: string,
  numOfQuestions: number,
  duration: number,
  difficulty: string
) => {
  const maxTokens = 500 * numOfQuestions;

  const prompt = `
    Generate total "${numOfQuestions}" "${difficulty}" "${type}" interview questions for the topic "${topic}" in the "${industry}" industry.
    The interview is for a candidate applying for the role of "${role}" and total duration of interview is "${duration}" minutes.

    **Ensure the following:**
    - The questions are well-balanced, including both open-ended and specific questions.
    - Each question is designed to evaluate a specific skill or knowledge area relevant to the role.
    - The questions are clear, concise and engaging for the candidate.
    - The questions are suitable for a "${difficulty}" interview in the "${industry}" industry.
    - Ensure the questions are directly aligned with "${difficulty}" responsibilities and expertise in "${role}".

    **Instructions:**
    - Always follow same format for questions.
    - Provide all questions without any prefix, number, bullet point, hyphen, or markdown formatting.
    - Each question must be on its own line.
    - No question number or bullet points or hyphen is required.
    `;

  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction:
        "You are expert in generating questions tailored to specific roles, industries, experience levels and topic. Your responses should be professional, concise and well-structured.",
      maxOutputTokens: maxTokens,
      temperature: 0.8,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("Failed to generate questions");
  }

  const questions = content
    .trim()
    .split("\n")
    .filter((q: string) => q.trim())
    .map((q: string) => ({
      question: q.trim(),
    }));

  return questions;
};

function extractScoresAndSuggestion(content: string) {
  // Strip markdown bold/italic markers so **Overall score=5** still matches
  const clean = content.replace(/\*+/g, "").replace(/_+/g, "");

  // Flexible regex: case-insensitive, allows spaces around = or :
  const overAllScoreMatch    = clean.match(/overall\s+score\s*[=:]\s*(\d+)/i);
  const relevanceScoreMatch  = clean.match(/relevance\s+score\s*[=:]\s*(\d+)/i);
  const clarityScoreMatch    = clean.match(/clarity\s+score\s*[=:]\s*(\d+)/i);
  const completenessScoreMatch = clean.match(/completeness\s+score\s*[=:]\s*(\d+)/i);
  const suggestionsMatch     = clean.match(/suggestions?\s*[=:]\s*(.*)/i);

  return {
    overallScore: parseInt(overAllScoreMatch?.[1] ?? "0"),
    relevance:    parseInt(relevanceScoreMatch?.[1] ?? "0"),
    clarity:      parseInt(clarityScoreMatch?.[1] ?? "0"),
    completeness: parseInt(completenessScoreMatch?.[1] ?? "0"),
    suggestion:   suggestionsMatch?.[1]?.trim() ?? "",
  };
}

export const evaluateAnswer = async (question: string, answer: string) => {
  const prompt = `
    Evaluate the following answer to the question based on the evaluation criteria and provide the scores for relevance, clarity, and completeness, followed by suggestions in text format.

    **Evaluation Criteria:**
        1. Overall Score: Provide an overall score out of 10 based on the quality of the answer.
        2. Relevance: Provide a score out of 10 based on how relevant the answer is to the question.
        3. Clarity: Provide a score out of 10 based on how clear and easy to understand the explanation is.
        4. Completeness: Provide a score out of 10 based on how well the answer covers all aspects of the question.
        5. Suggestions: Provide any suggestions or improvements to the answer in text.

    **Question:** ${question}
    **Answer:** ${answer}

    **Instructions:**
        - Always follow same format for providing scores and suggestions.
        - Provide the score only like "Overall score=5", "Relevance score=7", "Clarity score=9", "Completeness score=1", for following:
            - Overall score
            - Relevance score
            - Clarity score
            - Completeness score
        - Provide text only for following only like "Suggestions=your_answer_here":
            - Suggestions or improved answer in text.
    `;

  const response = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction:
        "You are an expert evaluator with a strong understanding of assessing answers to interview questions.",
      maxOutputTokens: 500,
      temperature: 0.8,
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("Failed to evaluate answer");
  }
   
  return extractScoresAndSuggestion(content);
};
