import { useState, useEffect } from 'react';

// Stock List Component - Displays the list of stocks with profit/loss calculations
function StockList({ stocks }) 
{
  const [prices, setPrices] = useState({}); // State to hold current prices and profit/loss calculations

  // Effect to fetch current stock prices and calculate profit/loss
  useEffect(() => {
    if (stocks.length === 0) return; // Skip fetching if no stocks are present

    // Create an object to hold updated prices and profit/loss for each stock
    const updatedPrices = {};

    // Fetch current prices for each stock and calculate profit/loss
    Promise.all(stocks.map((stock) =>
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=R4MJUY96CQ5GH191`)
        .then(response => response.json())
        .then(data =>
        {
            // Check if the response contains the stock price
          if (data["Global Quote"] && data["Global Quote"]["05. price"]) 
        {
            let currentPrice = parseFloat(data["Global Quote"]["05. price"]); // Get the current stock price
            let profitLoss = (currentPrice - stock.price) * stock.quantity; // Calculate profit/loss based on purchase price and quantity
            updatedPrices[stock.symbol] = { currentPrice, profitLoss }; // Store the current price and profit/loss in the updatedPrices object
          }
        })

    )).then(() => setPrices(updatedPrices)); // Update the prices state with the fetched data
  }, [stocks]);

    // Render the stock list with profit/loss information
  return (
    <div className="stock-list">
      <h2>Stock List</h2>
      {stocks.length === 0 ? (
        <p>No stocks added yet.</p>
      ) : (
        <ul>
          {stocks.map((stock, index) =>
          {
            const profitLoss = prices[stock.symbol]?.profitLoss ?? "Fetching..."; // Get the profit/loss for the stock, or show "Fetching..." if not available
            const profitLossClass = profitLoss > 0 ? "profit-text" : profitLoss < 0 ? "loss-text" : "neutral-text";
            // Determine the class for profit/loss text based on its value

            // Render each stock with its symbol, quantity, purchase price, and profit/loss
            return (
              <li key={index}>
                <p><strong>Symbol:</strong> <strong>{stock.symbol}</strong></p>
                <p>Quantity: {stock.quantity}</p>
                <p>Purchase Price: ${(stock.quantity * stock.price).toFixed(2)}</p>
                <p className={profitLossClass}>
                  Profit/Loss: {profitLoss !== "Fetching..."
                    ? (profitLoss > 0 ? `+ $${profitLoss.toFixed(2)}` : profitLoss < 0 ? `- $${Math.abs(profitLoss).toFixed(2)}` : `$${profitLoss.toFixed(2)}`)
                    : "Fetching market price..."
                  }
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default StockList;