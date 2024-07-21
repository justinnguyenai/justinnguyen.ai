from openai import OpenAI
import os

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_mtg_card():
    prompt = """Generate a new Magic: The Gathering card. Include the following elements:
    1. card name
    2. mana cost
    3. card type
    4. rarity
    5. card text (including any abilities)
    6. power/toughness (if applicable)
    7. flavor text
    8. brief review of the card (balance, synergy, playability, etc.)

    Double-check to make sure the card makes sense, is well-designed, and is balanced (not overpowered, not underpowered). Remove markdown formatting."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative assistant specialized in generating new Magic: The Gathering cards."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            n=1,
            stop=None,
            temperature=1,
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    print("Generating a new Magic: The Gathering card...")
    card = generate_mtg_card()
    print(card)