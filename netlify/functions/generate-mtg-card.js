const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateMtgCard() {
  // Generate a random number between 0 and 3 (inclusive) for rarity
  const randomRarityNumber = Math.floor(Math.random() * 4);
  const rarities = ['common', 'uncommon', 'rare', 'mythic rare'];
  const cardRarity = rarities[randomRarityNumber];

  // Generate a random number between 0 and 7 (inclusive) for card type
  const randomTypeNumber = Math.floor(Math.random() * 8);
  const cardTypes = ['land', 'creature', 'artifact', 'enchantment', 'planeswalker', 'battle', 'instant', 'sorcery'];
  const cardType = cardTypes[randomTypeNumber];

  // Generate mana cost based on card type
  const randomManaCost = cardType === 'land' ? 0 : Math.floor(Math.random() * 10) + 1;

  // Generate color based on mana cost
  let cardColor;
  if (randomManaCost === 0 || cardType === 'artifact') {
    cardColor = 'colorless';
  } else if (randomManaCost >= 2) {
    const colors = ['white', 'blue', 'black', 'red', 'green', 'multicolored'];
    cardColor = colors[Math.floor(Math.random() * colors.length)];
  } else {
    const colors = ['white', 'blue', 'black', 'red', 'green'];
    cardColor = colors[Math.floor(Math.random() * colors.length)];
  }

  const cardTypeAttributes = {
    creature: 'Power/Toughness:',
    planeswalker: 'Loyalty:',
    battle: 'Defense:'
  };

  const additionalAttribute = cardTypeAttributes[cardType] || '';

  const prompt = `Generate a new Magic: The Gathering card with the following specifications:

1. Mana Cost: ${randomManaCost}
2. Color: ${cardColor}
3. Card Type: ${cardType}
4. Rarity: ${cardRarity}

Please provide the following information in a structured format WITHOUT any Markdown formatting:

Card Name:
Mana Cost: (Use {W} for White, {U} for Blue, {B} for Black, {R} for Red, {G} for Green, 0 if mana cost is 0, {5} for 5 colorless for example)
Card Type:
Card Text:${additionalAttribute ? '\n' + additionalAttribute : ''}
Flavor Text:
---
Brief Review: (<6 sentences on balance, synergy, playability, etc.)

Ensure that:
- The card name is creative and thematic.
- The mana cost reflects the color and power level. For lands and colorless cards, there should be no colored mana symbols in the cost.
- If the card is multicolored, include at least two different colors in its mana cost.
- The card text is clear, concise, and follows Magic: The Gathering conventions.
- All elements are consistent with the card's color, type, and rarity.
- The card is balanced and interesting for gameplay.
- Do not use any special formatting characters like asterisks or underscores.
- Only include Power/Toughness for creatures, Loyalty for planeswalkers, and Defense for battles.
- Do not include empty lines.
- Include the '---' separator exactly as shown above to divide the flavor text from the brief review.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a Magic: The Gathering card designer with extensive knowledge of the game's rules, mechanics, and design principles. Provide card information in plain text without any special formatting." },
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