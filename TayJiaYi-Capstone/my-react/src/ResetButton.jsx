import React from "react";

// Reset Button Component - Clears all stocks from the list
function ResetButton({ resetStocks }) 
{
  return (
    <button onClick={resetStocks} className="reset-button">
      Reset Stocks
    </button>
  );
}

export default ResetButton;