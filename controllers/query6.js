// controllers/query6.js
// StockTrackr — Demonstration of SQL Transactions
// Pattern: JSON Reponse.

const db = require('../dbConfig');

// POST: Perform fixed fund transfer (transaction demo)
const transferFunds = (req, res) => {
    const FROM_ACCOUNT = 1; // Alice
    const TO_ACCOUNT = 2;   // Bob
    const AMOUNT = 100;     // Fixed transfer

    db.beginTransaction(err => {
        if (err) {
            console.error("Begin transaction error:", err);
            return res.status(500).json({ status: "error", message: "Could not start transaction" });
        }

        const subtractSender = `
            UPDATE BankAccounts
            SET balance = balance - ${AMOUNT}
            WHERE account_id = ${FROM_ACCOUNT} AND balance >= ${AMOUNT};
        `;

        db.query(subtractSender, (err, result) => {
            if (err || result.affectedRows === 0) {
                console.error("Withdraw error or insufficient funds:", err);
                return db.rollback(() => {
                    res.status(400).json({ status: "fail", message: "Insufficient funds or SQL error — transaction rolled back" });
                });
            }

            const addRecipient = `
                UPDATE BankAccounts
                SET balance = balance + ${AMOUNT}
                WHERE account_id = ${TO_ACCOUNT};
            `;

            db.query(addRecipient, (err, result) => {
                if (err || result.affectedRows === 0) {
                    console.error("Deposit error:", err);
                    return db.rollback(() => {
                        res.status(500).json({ status: "fail", message: "Could not deposit to target account — rolled back" });
                    });
                }

                db.commit(err => {
                    if (err) {
                        console.error("Commit error:", err);
                        return db.rollback(() => {
                            res.status(500).json({ status: "error", message: "Transaction failed during commit — rolled back" });
                        });
                    }

                    res.json({ status: "success", message: `Transferred $${AMOUNT} from Alice to Bob` });
                });
            });
        });
    });
};

// GET: Retrieve bank accounts
const getBankAccounts = (req, res) => {
    const query = `SELECT * FROM BankAccounts ORDER BY account_id`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: "Error loading bank accounts" });
        if (results.length === 0) return res.status(404).json({ status: "empty", message: "No bank account data found" });

        res.json({ status: "success", accounts: results });
    });
};

// POST: Simulate a transaction failure
const simulateFailure = (req, res) => {
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ status: "error", message: "Cannot start transaction" });

        const failureSQL = `
            UPDATE BankAccounts
            SET balance = balance + 50
            WHERE account_id = 9999
        `;

        db.query(failureSQL, (err, result) => {
            if (err || result.affectedRows === 0) {
                console.log("Simulated failure triggered:", err);
                return db.rollback(() => {
                    res.json({ status: "fail", message: "An intentional SQL error occurred — transaction rolled back" });
                });
            }

            db.commit(() => {
                res.json({ status: "success", message: "Simulated failure did not fail — unexpected" });
            });
        });
    });
};

// POST: Reset balances to original values
const resetBalances = (req, res) => {
    const resetSQL = `
        UPDATE BankAccounts
        SET balance = CASE
            WHEN account_id = 1 THEN 500
            WHEN account_id = 2 THEN 300
            ELSE balance
        END
        WHERE account_id IN (1,2);
    `;

    db.query(resetSQL, (err, result) => {
        if (err) {
            console.error("Reset balances error:", err);
            return res.status(500).json({ status: "error", message: "Could not reset balances" });
        }

        res.json({ status: "success", message: "Balances reset to original values" });
    });
};

module.exports = {
    transferFunds,
    getBankAccounts,
    simulateFailure,
    resetBalances
};
