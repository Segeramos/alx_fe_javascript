// Array to hold quotes
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "Get busy living or get busy dying.", category: "life" },
    { text: "You miss 100% of the shots you don't take.", category: "motivation" }
];

// Function to display a random quote
const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
};

// Event listener for showing a random quote
document.getElementById('randomQuoteButton').addEventListener('click', showRandomQuote);
