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

  const prompt = `Generate a new Magic: The Gathering card with the following specifications:

1. Mana Cost: ${randomManaCost}
2. Color: ${cardColor}
3. Card Type: ${cardType}
4. Rarity: ${cardRarity}

Please provide the following information in a structured format:

- Card Name:
- Mana Cost: (Use {W} for White, {U} for Blue, {B} for Black, {R} for Red, {G} for Green, and {C} for Colorless)
- Type Line:
- Card Text:
- Power/Toughness: (if creature)
- Loyalty: (if planeswalker)
- Defense: (if battle)
- Flavor Text:
- Brief Review: (<8 sentences on balance, synergy, playability, etc.)

Ensure that:
- The card name is creative and thematic.
- The mana cost reflects the color and power level.
- The card text is clear, concise, and follows Magic: The Gathering conventions.
- All elements are consistent with the card's color, type, and rarity.
- The card is balanced and interesting for gameplay.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Magic: The Gathering card designer with extensive knowledge of the game's rules, mechanics, and design principles." },
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