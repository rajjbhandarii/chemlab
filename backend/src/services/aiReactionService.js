const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIReactionService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.isConfigured = this.apiKey && this.apiKey !== 'your_gemini_api_key_here';
    if (this.isConfigured) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }
  }

  async predictReaction(reactantFormulas) {
    // Also recheck in case environment variable was loaded late
    if (!this.isConfigured && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      this.apiKey = process.env.GEMINI_API_KEY;
      this.isConfigured = true;
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    }

    if (!this.isConfigured) {
      console.warn('AIReactionService called, but GEMINI_API_KEY is not configured.');
      return null;
    }

    const prompt = `You are an expert chemist. A user has mixed the following chemicals: ${reactantFormulas.join(' and ')}.
Please predict the chemical reaction that occurs. If no significant reaction occurs, predict what happens (e.g., they just mix, or one dissolves).

Respond with a strictly formatted JSON object that adheres exactly to this schema:
{
  "reactants": ["string (formula of reactant 1)", "string (formula of reactant 2)"],
  "reactantNames": ["string (name of reactant 1)", "string (name of reactant 2)"],
  "products": [
    {
      "name": "string",
      "formula": "string (use proper Unicode subscripts like ₂ and ₄ if possible)",
      "physicalState": "Solid|Liquid|Gas|Aqueous",
      "color": "string"
    }
  ],
  "balancedEquation": "string (e.g., HCl + NaOH → NaCl + H₂O)",
  "reactionType": "Neutralization|Combustion|Precipitation|Single Displacement|Double Displacement|Redox|Synthesis|Decomposition|No Reaction",
  "energy": "Exothermic|Endothermic|Neutral",
  "observations": ["string", "string"],
  "explanation": "string (A clear, concise explanation of the reaction mechanism)",
  "dangerLevel": "Safe|Caution|Unsafe|Highly Dangerous",
  "safetyWarnings": [
    {
      "type": "string (e.g., Corrosive, Flammable)",
      "severity": "Low|Medium|High|Critical",
      "description": "string"
    }
  ],
  "funFact": "string (An interesting fact about this specific reaction or its products)"
}`;

    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2, // Keep it factual and consistent
        }
      });
      
      const responseText = result.response.text();
      const reactionData = JSON.parse(responseText);
      reactionData.isPopular = false; // Add default flag
      return reactionData;
    } catch (error) {
      console.error('Error predicting reaction with Gemini:', error);
      return null;
    }
  }
}

module.exports = new AIReactionService();
