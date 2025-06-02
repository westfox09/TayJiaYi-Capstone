import { useState, useEffect } from 'react';

// Stock Form Component - Handles adding new stocks
function StockForm({ onAddStock }) 
{
  const [symbol, setSymbol] = useState(''); // Stock symbol input
  const [price, setPrice] = useState(null); // Current stock price
  const [error, setError] = useState(''); // Error message for stock fetching

  // Effect to fetch stock price when symbol changes
  useEffect(() => 
    {
    if (!symbol) return; // Skip fetching if symbol is empty

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=R4MJUY96CQ5GH191`)
      .then(response => response.json())
      .then(data => 
     {
        // Check if the response contains the stock price
        if (data["Global Quote"] && data["Global Quote"]["05. price"]) 
        {
          setPrice(parseFloat(data["Global Quote"]["05. price"])); // Set the stock price
          setError(''); // Clear any previous error message
        } 
        // If the stock price is not available, set an error message
        else 
        {
          setError("Stock price unavailable. Please check back later."); // Set error message
          setPrice(null); // Reset price to null
        }
      })

      // Handle errors in fetching stock data
      .catch(() => 
     {
        setError("Error fetching stock data."); // Set error message
        setPrice(null); // Reset price to null
      });
  }, [symbol]);

  // Handle form submission to add a stock
  function handleSubmit(e) 
  {
    // Prevent default form submission behavior
    e.preventDefault();
    const quantity = Number(document.getElementById("stock-quantity").value); // Stock quantity input
    const purchasePrice = Number(document.getElementById("stock-price").value); // Purchase price input

     // Validate inputs before adding stock
    if (!symbol || isNaN(quantity) || isNaN(purchasePrice) || price === null) // Check if symbol, quantity, or price is invalid
    {
        setError("Stock price unavailable. Not able to add!"); // Set error message
        return;
    }

  onAddStock({ symbol, quantity, price: purchasePrice }); // Call the onAddStock function to add the stock with symbol, quantity, and purchase price

  // Reset form fields after submission
  setSymbol('');
  setPrice(null);
  setError('');
}

  // Render the stock form with inputs for symbol, quantity, and purchase price
  return (
    <div>
      <form onSubmit={handleSubmit} className="stock-form">
        <input type="text" id="stock-symbol" value={symbol} placeholder="Stock Symbol"
          onChange={(e) => setSymbol(e.target.value.toUpperCase())} required />
        <input type="number" id="stock-quantity" placeholder="Quantity" required />
        <input type="number" id="stock-price" value={price || ''} placeholder="Purchase Price" required disabled />
        <button type="submit">Add Stock</button>
      </form>

      <p className="stock-status">{error}</p>
    </div>
  );
}

export default StockForm;