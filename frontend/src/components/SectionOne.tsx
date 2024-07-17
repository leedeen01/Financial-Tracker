import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Expense } from "../models/expense";
import { Category } from "../models/category";

interface Props {
  expenses: Expense[];
  categories: Category[];
}

const SectionOne = ({ expenses, categories }: Props) => {
  const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return { month, year };
  };

  const { month, year } = getCurrentMonthYear();

  const currentDate = new Date();

  function getTransactions(type: string, month: number, year: number) {
    if (type === "E") {
      return expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          const category = categories.find(
            (cat) => cat.name === expense.category
          );
          const isCurrentMonth =
            expenseDate.getMonth() === month &&
            expenseDate.getFullYear() === year;
          return isCurrentMonth && category && category.type === "Expense";
        })
        .reduce((acc, expense) => acc + expense.amount, 0);
    } else {
      return expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          const category = categories.find(
            (cat) => cat.name === expense.category
          );
          const isCurrentMonth =
            expenseDate.getMonth() === month &&
            expenseDate.getFullYear() === year;
          return isCurrentMonth && category && category.type === "Income";
        })
        .reduce((acc, expense) => acc + expense.amount, 0);
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => {
    const expenseDate = new Date(expense.date);
    const category = categories.find((cat) => cat.name === expense.category);
    const isCurrentMonth =
      expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
    if (isCurrentMonth && category && category.type !== "Income") {
      return sum + expense.amount;
    }
    return sum;
  }, 0);

  function isIncomeCategory(categoryName: string) {
    const category = categories.find((cat) => cat.name === categoryName);
    return category && category.type === "Income";
  }

  const today = new Date();
  const dates: string[] = [];
  for (let i = 4; i > -1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  const todayExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date).toISOString().split("T")[0];
      return expenseDate === dates[4] && !isIncomeCategory(expense.category);
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const getDayName = (dayIndex: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex];
  };

  const expensesByDay = dates.map((date) => {
    const expensesOnDate = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date).toISOString().split("T")[0];
        return expenseDate === date && !isIncomeCategory(expense.category);
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const dayName = getDayName(new Date(date).getDay());

    return {
      name: dayName,
      expense: expensesOnDate.toFixed(2),
    };
  });

  const months: { month: number; year: number }[] = [];
  for (let i = 4; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    months.push({ month: date.getMonth(), year: date.getFullYear() });
  }

  const getMonthName = (month: number, year: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month]} ${year}`;
  };

  const expensesByMonth = months.map(({ month, year }) => {
    const expensesInMonth = getTransactions("E", month, year);
    const monthName = getMonthName(month, year);
    return {
      name: monthName,
      expense: expensesInMonth.toFixed(2),
    };
  });

  const incomeByMonth = months.map(({ month, year }) => {
    const incomeInMonth = getTransactions("I", month, year);
    const monthName = getMonthName(month, year);
    return {
      name: monthName,
      income: incomeInMonth.toFixed(2),
    };
  });

  const calculatePercentageChangeExpense = (
    todayExpense: number,
    yesterdayExpense: number
  ) => {
    if (yesterdayExpense === 0) {
      return {
        percentage: todayExpense > 0 ? "+∞%" : "0%",
        className:
          todayExpense > 0 ? "sectionone-negative" : "sectionone-neutral",
      };
    }
    const percentageChange =
      ((todayExpense - yesterdayExpense) / yesterdayExpense) * 100;
    const formattedPercentage = percentageChange.toFixed(1) + "%";
    return {
      percentage:
        percentageChange >= 0
          ? `+${formattedPercentage}`
          : `${formattedPercentage}`,
      className:
        percentageChange >= 0 ? "sectionone-negative" : "sectionone-positive",
    };
  };

  const calculatePercentageChangeIncome = (
    todayExpense: number,
    yesterdayExpense: number
  ) => {
    if (yesterdayExpense === 0) {
      return {
        percentage: todayExpense > 0 ? "+∞%" : "0%",
        className:
          todayExpense > 0 ? "sectionone-positive" : "sectionone-neutral",
      };
    }
    const percentageChange =
      ((todayExpense - yesterdayExpense) / yesterdayExpense) * 100;
    const formattedPercentage = percentageChange.toFixed(1) + "%";
    return {
      percentage:
        percentageChange >= 0
          ? `+${formattedPercentage}`
          : `${formattedPercentage}`,
      className:
        percentageChange >= 0 ? "sectionone-positive" : "sectionone-negative",
    };
  };

  const calculateTotalSavings = (
    incomeByMonth: { name: string; income: string }[],
    expensesByMonth: { name: string; expense: string }[],
    monthIndex: number
  ) => {
    const income = parseFloat(incomeByMonth[monthIndex].income);
    const expenses = parseFloat(expensesByMonth[monthIndex].expense);
    return income - expenses;
  };

  const calculatePercentageChangeSavings = (
    currentMonthSavings: number,
    previousMonthSavings: number
  ) => {
    if (previousMonthSavings === 0) {
      return {
        percentage: currentMonthSavings > 0 ? "+∞%" : "0%",
        className:
          currentMonthSavings > 0
            ? "sectionone-positive"
            : "sectionone-neutral",
      };
    }
    const percentageChange =
      ((currentMonthSavings - previousMonthSavings) / previousMonthSavings) *
      100;
    const formattedPercentage = percentageChange.toFixed(1) + "%";
    return {
      percentage:
        percentageChange >= 0
          ? `+${formattedPercentage}`
          : `${formattedPercentage}`,
      className:
        percentageChange >= 0 ? "sectionone-positive" : "sectionone-negative",
    };
  };

  const currentMonthSavings = calculateTotalSavings(
    incomeByMonth,
    expensesByMonth,
    4
  );
  const previousMonthSavings = calculateTotalSavings(
    incomeByMonth,
    expensesByMonth,
    3
  );

  const savingsPercentageChange = calculatePercentageChangeSavings(
    currentMonthSavings,
    previousMonthSavings
  );

  const todayExpense = parseFloat(
    expensesByDay[expensesByDay.length - 1].expense
  );
  const yesterdayExpense = parseFloat(
    expensesByDay[expensesByDay.length - 2].expense
  );

  const totalIncome = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const category = categories.find((cat) => cat.name === expense.category);
      const isCurrentMonth =
        expenseDate.getMonth() === month && expenseDate.getFullYear() === year;
      return isCurrentMonth && category && category.type === "Income";
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const percentageChangeResultExpense = calculatePercentageChangeExpense(
    todayExpense,
    yesterdayExpense
  );

  const percentageChangeResultMonthExpense = calculatePercentageChangeExpense(
    totalExpenses,
    getTransactions(
      "E",
      (currentDate.getMonth() - 1) % 12,
      currentDate.getFullYear()
    )
  );

  const percentageChangeResultMonthIncome = calculatePercentageChangeIncome(
    totalIncome,
    getTransactions(
      "I",
      (currentDate.getMonth() - 1) % 12,
      currentDate.getFullYear()
    )
  );

  const savingsData = [
    {
      type: "Expenses",
      value: totalExpenses,
    },
    {
      type: "Income",
      value: totalIncome,
    },
  ];

  // Define the payload type
  interface TooltipPayload {
    name: string;
    value: number;
  }

  // Define the props for the CustomTooltip component
  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        >
          <p>{`${payload[0].name}: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="row g-3 mb-3">
        {/* Weekly Expense */}
        <div className="col-md-6">
          <div className="card h-md-100">
            <div className="card-header pb-0">
              <h6 className="mb-2 mt-2 d-flex align-items-center">
                Today's Expenses
              </h6>
            </div>

            <div className="card-body d-flex flex-column justify-content-end">
              <div className="row justify-content-between">
                <div className="col align-self-end">
                  <p className="fs-5 mb-1 lh-1">${todayExpenses.toFixed(2)}</p>
                  <span
                    className={`badge rounded-pill fs-11 ${percentageChangeResultExpense.className}`}
                  >
                    {percentageChangeResultExpense.percentage}
                  </span>
                </div>
                <div className="col-auto ps-0">
                  <BarChart width={200} height={100} data={expensesByDay}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      domain={[0, "auto"]}
                    />
                    <Tooltip />
                    <Bar dataKey="expense" fill="#8BAFFF" />
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Savings */}
        <div className="col-md-6">
          <div className="card h-md-100">
            <div className="card-header pb-0">
              <h6 className="mb-2 mt-2 d-flex align-items-center">
                {currentDate.toLocaleString("default", { month: "long" })}'s
                Savings
                <span className="sectionone-tooltip-container ms-1">
                  <i className="fa fa-question"></i>
                  <span className="sectionone-tooltip-text">
                    Calculated by taking Income - Expenses
                  </span>
                </span>
              </h6>
            </div>

            <div className="card-body d-flex flex-column justify-content-end">
              <div className="row justify-content-between">
                <div className="col-auto align-self-end">
                  <div className="fs-5 mb-1 lh-1">
                    ${currentMonthSavings.toFixed(2)}
                  </div>
                  <span
                    className={`badge rounded-pill fs-11 ${savingsPercentageChange.className}`}
                  >
                    {savingsPercentageChange.percentage}
                  </span>
                </div>
                <div className="col-auto ps-0">
                  <PieChart width={200} height={100}>
                    <Pie
                      data={savingsData}
                      dataKey="value"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      innerRadius={30}
                      isAnimationActive={true}
                    >
                      <Cell key={`Expenses`} fill="#DA396A" />
                      <Cell key={`Income`} fill="#04A85A" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="col-md-6">
          <div className="card h-md-100">
            <div className="card-header pb-0">
              <h6 className="mb-2 mt-2 d-flex align-items-center">
                {currentDate.toLocaleString("default", { month: "long" })}'s
                Expenses
              </h6>
            </div>

            <div className="card-body d-flex flex-column justify-content-end">
              <div className="row justify-content-between">
                <div className="col-auto align-self-end">
                  <div className="fs-5 mb-1 lh-1">
                    $
                    {getTransactions(
                      "E",
                      currentDate.getMonth(),
                      currentDate.getFullYear()
                    ).toFixed(2)}
                  </div>
                  <span
                    className={`badge rounded-pill fs-11 ${percentageChangeResultMonthExpense.className}`}
                  >
                    {percentageChangeResultMonthExpense.percentage}
                  </span>
                </div>
                <div className="col-auto ps-0">
                  <AreaChart width={200} height={100} data={expensesByMonth}>
                    <defs>
                      <linearGradient
                        id="expenseColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#DA396A"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#DA396A"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      domain={[0, "auto"]}
                    />
                    <Tooltip />
                    <Area
                      dataKey="expense"
                      stroke="#DA396A"
                      fillOpacity={1}
                      fill="url(#expenseColor)"
                    />
                  </AreaChart>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="col-md-6">
          <div className="card h-md-100">
            <div className="card-header pb-0">
              <h6 className="mb-2 mt-2 d-flex align-items-center">
                {currentDate.toLocaleString("default", { month: "long" })}'s
                Income
              </h6>
            </div>

            <div className="card-body d-flex flex-column justify-content-end">
              <div className="row justify-content-between">
                <div className="col-auto align-self-end">
                  <div className="fs-5 mb-1 lh-1">
                    $
                    {getTransactions(
                      "I",
                      currentDate.getMonth(),
                      currentDate.getFullYear()
                    ).toFixed(2)}
                  </div>
                  <span
                    className={`badge rounded-pill fs-11 ${percentageChangeResultMonthIncome.className}`}
                  >
                    {percentageChangeResultMonthIncome.percentage}
                  </span>
                </div>
                <div className="col-auto ps-0">
                  <AreaChart width={200} height={100} data={incomeByMonth}>
                    <defs>
                      <linearGradient
                        id="incomeColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#04A85A"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#04A85A"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={false}
                      domain={[0, "auto"]}
                    />
                    <Tooltip />
                    <Area
                      dataKey="income"
                      stroke="#04A85A"
                      fillOpacity={1}
                      fill="url(#incomeColor)"
                    />
                  </AreaChart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionOne;
