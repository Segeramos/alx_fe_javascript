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
    console.log(`"${randomQuote.text}" - Category: ${randomQuote.category}`);
};

// Function to create and add a new quote
const createAddQuoteForm = (text, category) => {
    const newQuote = { text, category };
    quotes.push(newQuote);
    console.log(`Added new quote: "${newQuote.text}" - Category: ${newQuote.category}`);
};

// Example usage:
showRandomQuote(); // Displays a random quote
createAddQuoteForm("Success is not final, failure is not fatal: It is the courage to continue that counts.", "inspiration"); // Adds a new quote
showRandomQuote(); // Displays another random quote