import { useEffect, useState } from "react";
import "./Insights.css";
import * as expensesApi from "../network/expenses_api";
import { history } from "../models/gemini";
import { useContext } from "react";
import { Context } from "../App";
import Loader from "../components/loader/Loader";

const Insights = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState<history[]>([]);
  const surpriseOptions = [
    "How can i improve my finances?",
    "Where do i spend majority of my money on?",
    "Whats my total expense last month?"
  ];

  const [loading, setLoading] = useContext(Context);

  useEffect(() => {

  },[])

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    setLoading(true);
    if (!value) {
      setError("Please ask a question");
      return;
    }

    try {
      const response = await expensesApi.getGeminiResponse( chatHistory, value);
      console.log(response);
      
      setChatHistory([
        ...chatHistory,
        {
          role: "user",
          parts: [{text: value}],
        },
        {
          role: "model",
          parts: [{text: response}],
        }
      ]);
      setValue("");
      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      setError("Something went wrong! Please try again.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="app">
      <p>
        How can I help you
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise ME!
        </button>
      </p>
      {loading ? <Loader /> : <div className="input-container">
        <input
          value={value}
          type="text"
          placeholder="Ask me anything about your expenses!"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask Me!</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>}

      {error && <p>{error}</p>}

      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <p className="answer">{chatItem.role} : {chatItem.parts[0].text}</p>          
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
