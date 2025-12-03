// controllers/query5.js
// StockTrackr - Collect emails of suppliers and users
// Pattern: Direct HTML Generation (returns complete HTML page)

const db = require('../dbConfig');

/**
 * Get complete email list for all users and suppliers
 * in order to send out email blasts for newsletters
 * and important updates. Also used for getting customers
 * in touch with the companies supplying their product.
 */
const getEmailDetails = (req, res) => {
    // SQL showcases how to use union on two queries to get results of both tables
    const query = `
        SELECT u.username AS theName, u.role AS Role, u.email AS Email
        FROM users u
        UNION
        SELECT s.supplier_name AS theName, 'Supplier' AS Role, s.email AS Email
        FROM suppliers s
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Query 5 error:', err);
            // Return styled error page
            return res.status(500).send(generateErrorPage('Error fetching order data'));
        }

        // Send full rendered HTML page
        res.send(generateResultsPage(results));
    });
};

// Build the complete results HTML page
function generateResultsPage(results) {
    let html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>StockTrackr — Contact List</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<div class="app">
    <!-- Top navigation bar -->
    <header class="topbar">
        <div style="display:flex; align-items:center;">
            <div class="brand">
                <a href="/index.html">
                    <div class="logo">
                        <img src="/assets/logo.png" alt="StockTrackr logo" width="46" height="46">
                    </div>
                </a>
                <div>
                    <div style="font-weight:800; font-size:18px; letter-spacing:-0.2px;">
                      Stock<span style="color:#F6A800">Trackr</span>
                    </div>
                </div>
            </div>

            <!-- Navigation links -->
            <nav class="navlinks">
                <a href="/index.html">Dashboard</a>
                <a href="/query1.html">Orders</a>
                <a href="/query2.html">Categories</a>
                <a href="/query3.html">Stock Comparison</a>
                <a href="/query4.html">Purchase Quantities</a>
                <a href="/query5.html" aria-current="page">Contact List</a>
                <a href="/query6.html">Transactions</a>
            </nav>
        </div>

        <div class="right-actions">
            <button class="btn ghost">Manager</button>
            <button class="btn">Logout</button>
        </div>
    </header>

    <main class="main">
        <!-- Page title -->
        <div class="title">
            <h1>Email List</h1>
            <p class="subtitle">Email list of all users including students and suppliers</p>
        </div>
  `;

    // If no results, show an info alert instead of a table
    if (results.length === 0) {
        html += `
        <div class="card">
            <div class="alert alert-info">
                No users found.
            </div>
        </div>
    `;
    } else {
        // Table header
        html += `
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
    `;

        // Table rows for each line item
        results.forEach(row => {
            html += `
                    <tr>
                        <td>${row.theName}</td>
                        <td>${row.Role}</td>
                        <td>${row.Email}</td>
                    </tr>
      `;
        });

        html += `
                </tbody>
            </table>
        </div>
    `;
    }

    // Back button
    html += `
        <div style="margin-top: 24px; text-align: center;">
          <a href="/query5.html" class="btn-primary btn-back">Back</a>
        </div>
    </main>
</div>
</body>
</html>
  `;

    return html;
}

// Simple styled error page
function generateErrorPage(errorMessage) {
    return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>StockTrackr — Error</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<div class="app">
    <main class="main">
        <div class="card">
            <div class="alert alert-error">
                ${errorMessage}
            </div>

            <!-- Back link -->
            <div style="margin-top: 24px; text-align: center;">
              <a href="/query5.html" class="btn-primary btn-back">Back</a>
            </div>
        </div>
    </main>
</div>
</body>
</html>
  `;
}

module.exports = {
    getEmailDetails
};