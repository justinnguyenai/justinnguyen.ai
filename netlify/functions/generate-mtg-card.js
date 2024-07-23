const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateMtgCard() {
  // Generate a random number between 0 and 7 (inclusive) for card type
  const randomTypeNumber = Math.floor(Math.random() * 8);
  const cardTypes = ['land', 'creature', 'artifact', 'enchantment', 'planeswalker', 'battle', 'instant', 'sorcery'];
  const cardType = cardTypes[randomTypeNumber];

 // Set rarity based on card type
 let cardRarity;
 if (cardType === 'planeswalker') {
   cardRarity = 'mythic rare';
 } else {
   const randomRarityNumber = Math.floor(Math.random() * 3);
   const rarities = ['uncommon', 'rare', 'mythic rare'];
   cardRarity = rarities[randomRarityNumber];
 }

  // Generate mana cost based on card type
  const randomManaCost = cardType === 'land' ? 0 : Math.floor(Math.random() * 10) + 1;

  // Generate color based on mana cost
  let cardColor;
  if (cardType === 'land' || cardType === 'artifact') {
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

1. Card Type: ${cardType}
2. Rarity: ${cardRarity}
3. Total Mana Value: ${randomManaCost}
4. Color: ${cardColor}

Please provide the following information in a structured format WITHOUT any Markdown formatting:

Card Name:
Mana Cost: (Use {W} for White, {U} for Blue, {B} for Black, {R} for Red, {G} for Green, {0} for lands, and {1}, {2}, {3}, etc. for generic mana. Ensure the mana cost reflects the card's color and total mana value.)
Card Type:
Rarity:
Card Text:${additionalAttribute ? '\n' + additionalAttribute : ''}
Flavor Text:
---
Brief Review: (<6 sentences on balance, synergy, playability, etc.)

Ensure that:
- The card name is creative and thematic.
- The mana cost accurately reflects the specified color and total mana value:
  * For colorless cards (including artifacts), use only {C} or generic mana symbols.
  * For colored cards, include at least one mana symbol of the specified color.
  * For multicolored cards, include at least two different color symbols.
  * The sum of all mana symbols should equal the specified total mana value.
  * Lands should have no mana cost.
  * For colorless cards (including artifacts), use generic mana symbols like {1}, {2}, {3}, etc.
  * Use generic mana symbols ({1}, {2}, {3}, etc.) instead of multiple colorless mana symbols ({C}).
- The card text is clear, concise, and follows Magic: The Gathering conventions.
- All elements are consistent with the card's color, type, and rarity.
- The card is balanced and interesting for gameplay.
- Only include Power/Toughness for creatures, Loyalty for planeswalkers, and Defense for battles.
- Do not use any special formatting characters like asterisks or underscores.
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