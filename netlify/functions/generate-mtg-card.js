const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateMtgCard() {
  const prompt = `Generate a new Magic: The Gathering card. Include the following elements:
  1. card name
  2. mana cost
  3. card type
  4. rarity
  5. card text (including any abilities)
  6. power/toughness (if applicable)
  7. flavor text
  8. brief review of the card (balance, synergy, playability, etc.)

  Double-check to make sure the card makes sense, is well-designed, and is balanced (not overpowered, not underpowered).`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative assistant specialized in generating new Magic: The Gathering cards." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      n: 1,
      temperature: 1,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
}

exports.handler = async function(event, context) {
  try {
    const card = await generateMtgCard();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://justinnguyen.ai",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ card: card })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://justinnguyen.ai",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: 'Failed to generate card' })
    };
  }
};