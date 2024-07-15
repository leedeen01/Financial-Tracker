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
        <div className="container content d-flex flex-column gap-5">
            <h1 className="mx-auto mt-5">Net Worth: ${netWorth.toFixed(2)}</h1>
            <div className="col-md-12">
                <div className="card h-md-100">
                <div className="card-header pb-0">
                <div className="row align-items-center">
                    <div className="col">
                    <h6 className="mb-2 mt-2 d-flex align-items-center">
                        Bank Accounts
                    </h6>
                    </div>
                </div>
                </div>

                <div className="card-body p-0">
                    <div className="d-flex justify-content-center table-responsive">
                    <table className="table table-bordered table-striped text-center">
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Balance</th>
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
                    </div>
                </div>
                </div>

                <div className="card h-md-100 mt-4">
                <div className="card-header pb-0">
                <div className="row align-items-center">
                    <div className="card-header pb-0 d-flex align-items-center justify-content-between">
                        <h6 className="mb-2 mt-2 d-flex align-items-center">
                            Investment Portfolio
                        </h6>
                        <button onClick={handleRefreshPrices} className="expenselist-button expenselist-button-add"><i className="fa fa-refresh"></i></button>
                    </div>
                </div>
                </div>

                <div className="card-body p-0">
                    <div className="d-flex justify-content-center table-responsive">
                    <table className="table table-bordered table-striped text-center">
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
                </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AccountList;