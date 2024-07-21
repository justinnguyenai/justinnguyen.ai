document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateButton');
    const cardDisplay = document.getElementById('cardDisplay');
    
    generateButton.addEventListener('click', async function() {
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        cardDisplay.textContent = 'Generating new card...';

        try {
            const response = await fetch('/.netlify/functions/generate-mtg-card');
            const data = await response.json();
            
            if (data.card) {
                cardDisplay.innerHTML = data.card.replace(/\n/g, '<br>');
            } else {
                cardDisplay.textContent = 'Failed to generate card. Please try again.';
            }
        } catch (error) {
            console.error('Error:', error);
            cardDisplay.textContent = 'An error occurred. Please try again.';
        } finally {
            generateButton.disabled = false;
            generateButton.textContent = 'Generate';
        }
    });
});