import { useState, useEffect } from 'react';
import { Account } from '../models/account';
import * as ExpensesApi from "../network/expenses_api";
import Loader from "../components/loader/Loader";
import { User } from "../models/user";
import AccountList from '../components/accounts/AccountList';
import AccountForm from '../components/accounts/AccountForm';

const Investments = () => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

    // Function to fetch logged-in user
    const fetchLoggedInUser = async () => {
        try {
            const fetchedUser = await ExpensesApi.getLoggedInUser();
            setLoggedInUser(fetchedUser);
        } catch (error) {
            console.error("Error fetching logged-in user:", error);
        }
    };

    useEffect(() => {
        async function loadAccounts() {
            try {
                const accounts = await ExpensesApi.fetchAccount();
                setAccounts(accounts);
            } catch (error) {
                console.error(error);
            }
            }

            if (loggedInUser) {
                const interval = setInterval(fetchLoggedInUser, 5000);
                loadAccounts();
                return () => clearInterval(interval);
            } else {
                fetchLoggedInUser();
            }
    }, [loggedInUser]);

    async function deleteAccount(account: Account) {
        try {
          await ExpensesApi.deleteAccount(account._id);
          setAccounts(accounts.filter((a) => a._id !== account._id));
        } catch (error) {
          console.error(error);
        }
      }
        
    if (!loggedInUser) {
        return (
            <Loader />
        );
    }

    function onAccountSuccess(accounts: Account[]) {
        setAccounts(accounts);
        setShowForm(false);
      }

    return (
        <>
        <div className="container content mb-5">
            <div className="d-flex flex-column">
                <AccountList accounts={accounts} deleteAccount={deleteAccount}></AccountList>
                <button onClick={() => setShowForm(true)} className="budget-button mt-5">
                    +
                </button>
            </div>
        </div>
        {showForm &&
            <AccountForm onDismiss={() => setShowForm(false)} onAccountSuccess={onAccountSuccess} />
        }
        </>
    );
};

export default Investments;