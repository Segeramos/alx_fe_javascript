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
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>Category:</strong> ${randomQuote.category}`;
};

// Function to create and add a new quote
const createAddQuoteForm = (text, category) => {
    const newQuote = { text, category };
    quotes.push(newQuote);

    // Create a new quote element
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `Added new quote: "${newQuote.text}" - Category: ${newQuote.category}`;

    // Append the new quote element to the display
    quoteDisplay.appendChild(quoteElement);
};

// Event listener for the form submission
document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const text = document.getElementById('quoteText').value;
    const category = document.getElementById('quoteCategory').value;
    
    createAddQuoteForm(text, category);

    // Clear the input fields
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteCategory').value = '';
});

// Event listener for showing a random quote
document.getElementById('randomQuoteButton').addEventListener('click', showRandomQuote);
