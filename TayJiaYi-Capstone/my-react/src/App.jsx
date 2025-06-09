import './App.css';
import { useState, useEffect } from 'react';
import StockForm from './StockForm';
import StockList from './StockList';
import ResetButton from './ResetButton';

// Main App Component - Manages the state of stocks and renders StockForm and StockList components
function App()
{
  // State to manage stocks, initialized from localStorage
  const [stocks, setStocks] = useState(() => 
  {
    const savedStocks = localStorage.getItem("stocks"); // Retrieve saved stocks from localStorage
    return savedStocks ? JSON.parse(savedStocks) : []; // Parse and return saved stocks or an empty array if none exist
  });

  // Effect to save stocks to localStorage whenever stocks state changes
  useEffect(() => 
  {
    localStorage.setItem("stocks", JSON.stringify(stocks)); // Save stocks to localStorage
  }, [stocks]);

  // Function to add a new stock or update an existing one
  function addStock(stock) 
  {
    // Update the stocks state by checking if the stock already exists
    setStocks((prevStocks) => 
    {
      const existingStockIndex = prevStocks.findIndex((s) => s.symbol === stock.symbol); // Check if the stock already exists in the list

      // If the stock already exists, update its quantity and price
      if (existingStockIndex !== -1) 
      {
        // Stock already exists, update its quantity and price
        const updatedStocks = [...prevStocks];
        updatedStocks[existingStockIndex].quantity += stock.quantity; 
        updatedStocks[existingStockIndex].price = stock.price; 
        return updatedStocks;
      } 
      else 
      {
        // Stock does not exist, add it to the list
        return [...prevStocks, stock];
      }
    });
  }

  // Function to reset stocks, clearing the state and localStorage
  function resetStocks() 
  {
    setStocks([]); // Clears the stocks state
    localStorage.removeItem("stocks"); // Removes stocks from localStorage
  }

  // Render the main dashboard with StockForm and StockList components
  return (
    <>
      <div className="finance-dashboard">
        <h1>
          <img src="./src/fin_dash_logo.png" alt="Finance Dashboard" className="dashboard-image" />
        </h1>
        <StockForm onAddStock={addStock} />
        <StockList stocks={stocks} />
      </div>
      
      <ResetButton resetStocks={resetStocks} />
    </>
  );
}

export default App;