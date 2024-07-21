const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateMtgCard() {
  // Generate a random number between 0 and 10 (inclusive) for mana cost
  const randomManaCost = Math.floor(Math.random() * 11);

  // Generate a random number between 0 and 6 (inclusive) for color
  const randomColorNumber = Math.floor(Math.random() * 7);
  const colors = ['colorless', 'white', 'blue', 'black', 'red', 'green', 'multicolored'];
  const cardColor = colors[randomColorNumber];

  // Generate a random number between 0 and 7 (inclusive) for card type
  const randomTypeNumber = Math.floor(Math.random() * 8);
  const cardTypes = ['land', 'creature', 'artifact', 'enchantment', 'planeswalker', 'battle', 'instant', 'sorcery'];
  const cardType = cardTypes[randomTypeNumber];

  // Generate a random number between 0 and 3 (inclusive) for rarity
  const randomRarityNumber = Math.floor(Math.random() * 4);
  const rarities = ['common', 'uncommon', 'rare', 'mythic rare'];
  const cardRarity = rarities[randomRarityNumber];

  const prompt = `Generate a new Magic: The Gathering card with a mana cost of ${randomManaCost}, color ${cardColor}, card type ${cardType}, and rarity ${cardRarity}. Include the following elements:
  1. card name
  2. mana cost (must be exactly ${randomManaCost}, and should reflect the color ${cardColor})
  3. card type (${cardType})
  4. color (${cardColor})
  5. rarity (${cardRarity})
  6. card text (including any abilities)
  7. power/toughness (if applicable for creatures)
  8. loyalty (if applicable for planeswalkers)
  9. defense (if applicable for battles)
  10. flavor text
  11. brief review of the card (balance, synergy, playability, etc.)

  - Everything should be in english.
  - Double-check to make sure the card makes sense.
  - Double-check to make sure the card is well-designed.
  - The mana cost, color, card type, and rarity should all be consistent and reflect the power level and abilities of the card.
  - If the card is colorless, ensure it doesn't have colored mana symbols in its cost.
  - If it's multicolored, include at least two different colors in its mana cost.
  - If it's a land, it typically shouldn't have a mana cost unless it's a special design.
  - Ensure the card text and abilities are appropriate for the chosen card type.
  - The rarity should be reflected in the card's complexity and power level (e.g., mythic rare cards are typically more powerful or unique than common cards).
  - Remove markdown formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a creative assistant specialized in generating new Magic: The Gathering cards." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      n: 1,
      temperature: 2,
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