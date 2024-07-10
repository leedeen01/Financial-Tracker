import { useState } from "react";
import "./Insights.css";
import * as expensesApi from "../network/expenses_api";

const Insights = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] =  useState([]);
  const surpriseOptions = [
    "How can i improve my finances?",
    "Where do i spend majority of my money on?",
    "Whats my total expense last month?"
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if(!value) {
      setError("Please ask a question")
      return
    }

    try {
      const response = expensesApi.getGeminiResponse(chatHistory, value);
      console.log(response);
      
    } catch(error) {
      setError("Something went wrong! Please try again.")
    }
  }
  return (
      <div className="app">
        <p>
          How can i help you
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise ME!</button>
        </p>
        <div className="input-container">
          <input
            value={value}
            type="text"
            placeholder="Ask me anything about your expenses!"
            onChange={(e) =>setValue(e.target.value)}
          />
          {!error && <button>Ask Me!</button>}
          {error && <button>Clear</button>}
        </div>

        {error && <p>{error}</p>}

        <div className="search-result">
          <div key={""}>
            <p className="answer"></p>
          </div>
        </div>
      </div>
  );
};

export default Insights;
