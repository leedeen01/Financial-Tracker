import { useEffect, useState } from "react";
import "./Insights.css";
import * as expensesApi from "../network/expenses_api";
import { history } from "../models/gemini";
import { useContext } from "react";
import { Context } from "../App";
import Loader from "../components/loader/Loader";
import { Expense } from "../models/expense";

const Insights = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState<history[]>([]);
  const [loading, setLoading] = useContext(Context);
  const [expense, setExpense] = useState<Expense[]>([]);

  const surpriseOptions = [
    "How can i improve my finances?",
    "Where do i spend majority of my money on?",
    "Whats my total expense last month?",
  ];

  useEffect(() => {
    async function loadExpenses() {
      try {
        const expenses = await expensesApi.fetchExpense();
        return expenses;
      } catch (error) {
        console.error(error);
        return [];
      }
    }

    async function fetchData() {
      setLoading(true);

      try {
        const expenses = await loadExpenses();
        setExpense(expenses);
        if (expenses.length > 0) {
          let prompt =
            "Reply like a financial consultant, Imagine a person has the following expenses...";
          prompt += expenses
            .map(
              (e) =>
                `On ${e.date}, I purchased a ${e.description} for $${e.amount}. It falls under the ${e.category} category in my expense list.`
            )
            .join("\n");
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
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const initialResponse = async (value: string) => {
    setLoading(true);
    if (!value) {
      setError("Please ask a question");
      return;
    }
    try {
      const response = await expensesApi.getGeminiResponse([], value);

      setChatHistory([
        {
          role: "user",
          parts: [{ text: "Heres how you can cut down on your spending!" }],
        },
        {
          role: "model",
          parts: [{ text: response }],
        },
      ]);
      setValue("");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setError("Something went wrong! Please try again.");
    }
  };

  const getResponse = async () => {
    setLoading(true);
    if (!value) {
      setError("Please ask a question");
      return;
    }
    
    try {
      const prompt = value + expense
      .map(
        (e) =>
          `On ${e.date}, i Bought ${e.description} (Category: ${e.category}) for $${e.amount}`
      )
      const response = await expensesApi.getGeminiResponse(chatHistory, prompt);
      const cleanedResponse = response.replace(/\*\*|\n|\r/g, '');

      setChatHistory([
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: cleanedResponse }],
        },
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      getResponse();
    }
  };

  return (
    <div className="container content mb-5">
      <div className="row mt-5">
        <p className="insights-text">
          How can I help you
          <button
            className="surprise"
            onClick={surprise}
            disabled={!chatHistory}
          >
            Surprise ME!
          </button>
        </p>
        {loading ? (
          <Loader />
        ) : (
          <div className="input-container">
            <input
              value={value}
              type="text"
              placeholder="Ask me anything about your expenses!"
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {!error && <button onClick={getResponse}>Ask Me!</button>}
            {error && <button onClick={clear}>Clear</button>}
          </div>
        )}

        {error && <p className="insights-text">{error}</p>}

        <div className="search-result">
          {chatHistory.map(
            (chatItem, index) =>
              index !== 0 && index !== 1 && (
                <div key={index}>
                  <pre className="answer insights-text">
                    {chatItem.role} : {chatItem.parts[0].text}
                  </pre>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
