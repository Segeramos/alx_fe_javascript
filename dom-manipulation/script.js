const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL
const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

document.addEventListener('DOMContentLoaded', () => {
    displayQuotes();
    populateCategories();
});

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

// Function to fetch quotes from the simulated server
const fetchQuotesFromServer = async () => {
    try {
        const response = await fetch(apiUrl); // Fetch data from the mock API
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json(); // Parse JSON response
        // Map the API data to match your quote structure
        return data.map(item => ({
            text: item.title,  // Use title as the quote text
            category: 'General' // Assign a default category
        }));
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return []; // Return an empty array in case of error
    }
};

// existing function
const syncWithServer = async () => {
    const newQuotes = await fetchQuotesFromServer();
    // Further logic to handle new quotes...
};


// Function to populate categories dynamically
const populateCategories = () => {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = ''; // Clear existing options
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = 'All Categories';
    categoryFilter.appendChild(defaultOption);

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from local storage
    const lastCategory = localStorage.getItem('lastSelectedCategory');
    if (lastCategory) {
        categoryFilter.value = lastCategory;
        filterQuotes(lastCategory); // Filter quotes based on the last selected category
    }
};

// Function to show a random quote
const showRandomQuote = () => {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = 'No quotes available.';
        return;
    }

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

    // Update categories after adding a new quote
    populateCategories(); 

    // Refresh quotes display
    displayQuotes(); 
};

// Function to display quotes based on selected category
const filterQuotes = (category) => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear existing quotes

    const filteredQuotes = category && category !== 'all' 
        ? quotes.filter(quote => quote.category === category) 
        : quotes;

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `"${quote.text}" - Category: ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });

    // Save last selected category to local storage
    localStorage.setItem('lastSelectedCategory', category);
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
                populateCategories(); // Update category filter
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file. Please try again.');
            }
        };
        reader.readAsText(file);
    }
};

// Function to sync fetched quotes with local storage
const syncWithServer = async () => {
    const newQuotes = await fetchQuotesFromServer();
    if (newQuotes.length) {
        let conflictResolved = false;

        newQuotes.forEach(fetchedQuote => {
            const existingQuoteIndex = quotes.findIndex(existing => existing.text === fetchedQuote.text);
            if (existingQuoteIndex > -1) {
                // Conflict detected: notify user
                if (confirm(`Conflict detected for quote "${fetchedQuote.text}". Do you want to keep the server version?`)) {
                    // If user agrees, overwrite existing quote with the server's version
                    quotes[existingQuoteIndex] = fetchedQuote;
                    conflictResolved = true;
                }
            } else {
                // If it's a new quote, add it to the local array
                quotes.push(fetchedQuote);
            }
        });

        if (conflictResolved) {
            alert('Conflicts resolved and data updated from the server.');
            saveQuotes(); // Save to local storage
            displayQuotes(); // Refresh quotes display
            populateCategories(); // Update categories after syncing
        } else {
            alert('Data updated from the server without conflicts.');
            saveQuotes(); // Save to local storage
            displayQuotes(); // Refresh quotes display
            populateCategories(); // Update categories after syncing
        }
    }
};

// Set interval for syncing with the server every 30 seconds
setInterval(syncWithServer, 30000);

// Event listener for the form submission
document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    
    createAddQuoteForm(text, category);

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
});

// Event listener for showing a random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for exporting quotes
document.getElementById('exportButton').addEventListener('click', exportQuotes);

// Event listener for importing quotes
document.getElementById('importInput').addEventListener('change', importQuotes);

// Event listener for category filtering
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    filterQuotes(selectedCategory);
});

// Display existing quotes and populate categories when the application initializes
displayQuotes();
populateCategories();


// Function to post a new quote to the server
const postQuoteToServer = async (quote) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // Set the request method to POST
            headers: {
                'Content-Type': 'application/json' // Set the content type to JSON
            },
            body: JSON.stringify(quote) // Convert the quote object to JSON
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json(); // Parse the JSON response
        return data; // Return the created quote data (or handle it as needed)
    } catch (error) {
        console.error('Error posting quote:', error);
    }
};


const createAddQuoteForm = async (text, category) => {
    const newQuote = { text, category };

    // First, add the new quote to local storage
    quotes.push(newQuote);
    saveQuotes(); // Save updated quotes array to local storage

    // Post the new quote to the server
    const postedQuote = await postQuoteToServer(newQuote);
    
    if (postedQuote) {
        // Optionally, handle the postedQuote response here
        console.log('Quote posted successfully:', postedQuote);
    }

    // Update categories after adding a new quote
    populateCategories(); 

    // Refresh quotes display
    displayQuotes(); 
};

// Check for the syncQuotes function

const syncQuotes = async () => {
    const newQuotes = await fetchQuotesFromServer();

    if (newQuotes.length) {
        let conflictResolved = false;

        newQuotes.forEach(fetchedQuote => {
            const existingQuoteIndex = quotes.findIndex(existing => existing.text === fetchedQuote.text);
            if (existingQuoteIndex > -1) {
                // Conflict detected: notify user
                if (confirm(`Conflict detected for quote "${fetchedQuote.text}". Do you want to keep the server version?`)) {
                    // If user agrees, overwrite existing quote
                    quotes[existingQuoteIndex] = fetchedQuote;
                    conflictResolved = true;
                }
            } else {
                // If it's a new quote, add it to the local array
                quotes.push(fetchedQuote);
            }
        });

        // Save updated quotes to local storage
        saveQuotes();
        displayQuotes();
        populateCategories();

        // Show notification based on whether conflicts occurred
        if (conflictResolved) {
            showNotification('Conflicts resolved and data updated from the server.');
        } else {
            showNotification('Quotes synced with server!');
        }
    }
};




// Sync quotes every 30 seconds
setInterval(syncQuotes, 30000);

// Or on a button click
document.getElementById('syncButton').addEventListener('click', syncQuotes);

// notification function 

const showNotification = (message) => {
    const notificationDiv = document.getElementById('notification');
    notificationDiv.textContent = message;

    // Automatically clear the notification after a few seconds
    setTimeout(() => {
        notificationDiv.textContent = '';
    }, 3000); // Clear after 3 seconds
};

const postQuoteToServer = async (quote) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        showNotification('Quote posted successfully!'); // Notify on successful post
        return data;
    } catch (error) {
        console.error('Error posting quote:', error);
        showNotification('Failed to post quote.'); // Notify on failure
    }
};

