import './App.css'
import ReactDOM from "react-dom/client";

//
let stocks = [];

function App() 
{
  // Function to add a new stock to the global array
  function addStock(stock)
  {
    stocks.push(stock); // Add stock to the global array
    renderApp(); // Re-render the app to update the stock list
  }

  return (
    <div className="finance-dashboard">
      <h1><img src="./src/fin_dash_logo.png" alt="Finance Dashboard" className="dashboard-image" /></h1>
      {/* Stock form component to add new stocks */}
      <StockForm onAddStock={addStock} />
      {/* Stock list component to display current stock holdings */}
      <StockList stocks={stocks} />
    </div>
  );
}

// Function to render the entire app
function renderApp() 
{
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

// Initial render of the app 
function StockForm({ onAddStock }) 
{
  function fetchStockPrice(e) 
  {
    const symbol = e.target.value.toUpperCase(); // Get stock symbol from input
    const priceInput = document.getElementById("stock-price"); // Get price input field
    const errorDisplay = document.getElementById("error-message"); // Get error message display element

    if (!symbol) return; // If symbol is empty, do nothing

    // Fetch stock price from Alpha Vantage API
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=R4MJUY96CQ5GH191`)
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        if (data["Global Quote"] && data["Global Quote"]["05. price"]) // Check if data contains valid stock price
        {
          priceInput.value = parseFloat(data["Global Quote"]["05. price"]); // Set price input value
          errorDisplay.textContent = ""; // Clear any previous error messages
        } 
        else
        {
          errorDisplay.textContent = "Stock price unavailable. Please check back later"; // Display error if stock data is not available
        }
})

      .catch(() => 
      {
        errorDisplay.textContent = "Error fetching stock data."; // Handle fetch error
      });
  }

// Handle form submission to add a new stock
function handleSubmit(e) 
{
  e.preventDefault(); // Prevent default form submission behavior

  // Get stock symbol, quantity, and price from form inputs
  const symbol = document.getElementById("stock-symbol").value.toUpperCase(); // Convert symbol to uppercase
  const quantity = document.getElementById("stock-quantity").value; // Get quantity as a string
  const price = document.getElementById("stock-price").value; // Get price as a string
  const stockData = { symbol, quantity: parseFloat(quantity), price: parseFloat(price) }; // Create stock data object

  onAddStock(stockData); // Call the onAddStock function passed as a prop to add the stock

  // Reset form inputs after submission
  document.getElementById("stock-symbol").value = "";
  document.getElementById("stock-quantity").value = "";
  document.getElementById("stock-price").value = "";
  document.getElementById("error-message").textContent = "";
}

// Render the stock form with inputs and submit button
return (
  <div>
  <form onSubmit={handleSubmit} className="stock-form">
    {/* Stock Symbol Input (Auto-fetches price on change) */}
    <input type="text" id="stock-symbol" placeholder="Stock Symbol" required onChange={fetchStockPrice} />
    {/* Stock Quantity Input (Number input, no decimals) */}
    <input type="number" id="stock-quantity" placeholder="Quantity" required step="1" onwheel="this.blur()" />
    {/* Stock Price Input (Disabled, auto-filled on symbol change) */}
    <input type="number" id="stock-price" placeholder="Current Price" required disabled />
    {/* Submit Button to add stock */}
    <button type="submit">Add Stock</button>
    {/* Error message display for stock data issues */}
  </form>
    
    {/* Display error message if stock data is unavailable */}
    <p className="stock-status" id="error-message"></p>
  </div>
  );
}

// Component to display the list of stocks
function StockList({ stocks }) 
{
  return (
    <div className="stock-list">
      <h2>Stock List</h2>
      {stocks.length === 0 ? (
        <p>No stocks added yet.</p> // Display message if no stocks are present
      ) : (
        <ul>
          {stocks.map((stock, index) => (
            <li key={index}>
              {stock.symbol}: {stock.quantity} shares at ${stock.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;