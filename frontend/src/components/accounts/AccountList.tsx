import { MdDelete } from "react-icons/md";
import { Account } from "../../models/account";
import { useEffect, useState } from "react";
import * as ExpensesApi from "../../network/expenses_api";

interface AccountListProps {
    accounts: Account[];
    deleteAccount: (account: Account) => void;
}

const AccountList = ({ accounts, deleteAccount }: AccountListProps) => {
    const [stockPrices, setStockPrices] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true);

    function findPrice(account: Account) {
        if (stockPrices.find(stock => stock.stockName === account.name)?.latestPrice) {
            return (stockPrices.find(stock => stock.stockName === account.name)?.latestPrice);
        } else {
            return 0;
        }
    }

    useEffect(() => {
        async function stockPrice(accounts: Account[]) {
            try {
                const p = await ExpensesApi.fetchStockPrice(accounts);
                setStockPrices(p);
                setRefresh(false);
            } catch (error) {
                console.error(error);
            }
        }
        if (refresh) {
            stockPrice(accounts);
        }
    }, [accounts, refresh]);

    const handleRefreshPrices = async () => {
        setRefresh(true);
    };

    const bankAccounts = accounts.filter((account) => account.type === "Bank");
    const stockAccounts = accounts.filter((account) => account.type === "Stock");
    const netWorth = accounts.reduce((sum, account) => {
        if (account.type === 'Stock' && account.count) {
            return sum + (findPrice(account) * account.count);
        } else {
            return sum + account.amount;
        }
    }, 0);

    return (
        <>
        <div className="container content">
            <h1>Net Worth: ${netWorth.toFixed(2)}</h1>
            <h2>Bank Accounts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bankAccounts.map((account) => {
                        return (
                            <tr key={account._id}>
                                <td>{account.name}</td>
                                <td>${account.amount}</td>
                                <td><MdDelete onClick={() => deleteAccount(account)} className="expenselist-editdel"></MdDelete></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <h2>Investments</h2>
            <button onClick={handleRefreshPrices}>Refresh Prices</button>
            <table>
                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>Shares Held</th>
                        <th>Average Cost</th>
                        <th>Current Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stockAccounts.map((account) => {
                        return (
                            <tr key={account._id}>
                                <td>{account.name}</td>
                                <td>{account.count}</td>
                                <td>${(account.amount).toFixed(2)}</td>
                                <td>${findPrice(account).toFixed(2)}</td>
                                <td><MdDelete onClick={() => deleteAccount(account)} className="expenselist-editdel"></MdDelete></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default AccountList;