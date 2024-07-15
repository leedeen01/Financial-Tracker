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
    async function loadExpenses() {
      try {
        const expenses = await expensesApi.fetchExpense(); // Assuming fetchExpense() returns a Promise<Expense[]>
        return expenses;
      } catch (error) {
        console.error(error);
        return []; // Return empty array or handle error case appropriately
      }
    }
  
    async function fetchData() {
      setLoading(true);
  
      try {
        const expenses = await loadExpenses();
  
        if (expenses.length > 0) {
          let prompt = "Here are my expenses, how can i save more money";
          prompt += expenses.map(e => `Description: ${e.description}, Amount: ${e.amount}, Category: ${e.category}, Date: ${e.date}`).join("\n");
          prompt += "Make it in point form and replace without any bold and newline"
          await initialResponse(prompt);          
        } else {
          setValue("No expenses found."); 
        }
      } catch (error) {
        console.error("Error loading expenses:", error);
        setError("Failed to load expenses. Please try again."); 
      } finally {
        setLoading(false);
      }
    }
  
    fetchData(); 
  
  }, []); 
  

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const initialResponse = async (value: string) => {
    setLoading(true);
    if (!value) {
      setError("Please ask a question");
      return;
    }
    try {
      const response = await expensesApi.getGeminiResponse( [], value);

      setChatHistory([
        {
          role: "user",
          parts: [{text: "Heres how you can cut down on your spending!"}],
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

  const getResponse = async () => {
    console.log("hi");

    setLoading(true);
    if (!value) {
      setError("Please ask a question");
      return;
    }

    try {
      const response = await expensesApi.getGeminiResponse( chatHistory, value);
      console.log(response);
      console.log("hi2");

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
    <div className="container content">
      <div className="row mt-5">
        <p className="insights-text">
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

        {error && <p className="insights-text">{error}</p>}

        <div className="search-result">
          {chatHistory.map((chatItem, index) => (
            <div key={index}>
              <p className="answer insights-text">{chatItem.role} : {chatItem.parts[0].text}</p>          
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
