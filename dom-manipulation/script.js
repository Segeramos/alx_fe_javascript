// Function to load quotes from local storage
const loadQuotes = () => {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
};

// Initialize the quotes array from local storage
let quotes = loadQuotes();

// Function to save quotes to local storage
const saveQuotes = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
};

// Function to display a random quote
const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>Category:</strong> ${randomQuote.category}`;

    // Store the last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
};

// Function to create and add a new quote
const createAddQuoteForm = (text, category) => {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes(); // Save updated quotes array to local storage

    // Create a new quote element
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    const quoteElement = document.createElement('div');
    quoteElement.textContent = `Added new quote: "${newQuote.text}" - Category: ${newQuote.category}`;

    // Append the new quote element to the display
    quoteDisplay.appendChild(quoteElement);
};

// Load existing quotes into the display
const displayQuotes = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear existing quotes
    quotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `"${quote.text}" - Category: ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });

    // Retrieve and display the last viewed quote from session storage
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quote = JSON.parse(lastViewedQuote);
        const lastQuoteElement = document.createElement('div');
        lastQuoteElement.textContent = `Last viewed quote: "${quote.text}" - Category: ${quote.category}`;
        quoteDisplay.appendChild(lastQuoteElement);
    }
};

// Function to export quotes to a JSON file
const exportQuotes = () => {
    const json = JSON.stringify(quotes, null, 2); // Pretty print JSON
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
};

// Function to import quotes from a JSON file
const importQuotes = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                quotes = importedQuotes; // Update quotes array
                saveQuotes(); // Save to local storage
                displayQuotes(); // Update the display
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file. Please try again.');
            }
        };
        reader.readAsText(file);
    }
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

// Event listener for exporting quotes
document.getElementById('exportButton').addEventListener('click', exportQuotes);

// Event listener for importing quotes
document.getElementById('importInput').addEventListener('change', importQuotes);

// Display existing quotes when the application initializes
displayQuotes();

