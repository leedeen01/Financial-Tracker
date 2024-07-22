import { MdDelete, MdEdit } from "react-icons/md";
import { Account } from "../../models/account";
import { useEffect, useState, useContext } from "react";
import * as ExpensesApi from "../../network/expenses_api";
import { currencies } from "../../models/user";
import { BaseCurrency } from "../../App";
import AccountEditForm from "./AccountEditForm";

interface AccountListProps {
    accounts: Account[];
    deleteAccount: (account: Account) => void;
}

const AccountList = ({ accounts, deleteAccount }: AccountListProps) => {
    const [baseC] = useContext(BaseCurrency);
    const [stockPrices, setStockPrices] = useState<any[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true);
    const [showForm, setShowForm] = useState(false);
    const [editAccount, setEditAccount] = useState<Account>();

    function findPrice(account: Account) {
        if (stockPrices.find(stock => stock.stockName === account.name)?.latestPrice) {
            return (stockPrices.find(stock => stock.stockName === account.name)?.latestPrice);
        } else {
            return 0;
        }
    }

    function onEdit(account: Account) {
        setEditAccount(account);
        setShowForm(true);
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
            <h1 className="mx-auto mt-5">Net Worth: {currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
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
                                        <td>{currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{account.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>
                                            <div className="expenselist-button-container gap-2">
                                                <MdEdit
                                                    className="text-muted expenselist-editdel"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(account);
                                                    }}
                                                />
                                                <MdDelete 
                                                    className="text-muted expenselist-editdel"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        deleteAccount(account);
                                                    }}
                                                />
                                            </div>
                                        </td>
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
                                <th className="hide-header">Average Cost</th>
                                <th className="hide-header">Current Price</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockAccounts.map((account) => {
                                return (
                                    <tr key={account._id}>
                                        <td>{account.name}</td>
                                        <td>{account.count}</td>
                                        <td className="hide-cell">{currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{(account.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="hide-cell">{currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{findPrice(account).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>
                                            <div className="d-flex flex-column justify-content-center align-items-center">
                                                <div>{currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{account.count ? (findPrice(account) * account.count).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0.00}</div>
                                                <div style={{color: (findPrice(account) - account.amount) >= 0 ? 'var(--light-green)' : 'var(--light-red)', fontSize: "12px"}}>
                                                {((findPrice(account) - account.amount) / account.amount) * 100 >= 0
                                                    ? `+${(((findPrice(account) - account.amount) / account.amount) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                                    : `${(((findPrice(account) - account.amount) / account.amount) * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="expenselist-button-container gap-2">
                                                <MdEdit
                                                    className="text-muted expenselist-editdel"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(account);
                                                    }}
                                                />
                                                <MdDelete 
                                                    className="text-muted expenselist-editdel"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        deleteAccount(account);
                                                    }}
                                                />
                                            </div>
                                        </td>
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
        {editAccount && showForm &&
            <AccountEditForm account={editAccount} onDismiss={() => setShowForm(false)} onAccountEditSuccess={() => setShowForm(false)} />
        }
        </>
    );
}

export default AccountList;