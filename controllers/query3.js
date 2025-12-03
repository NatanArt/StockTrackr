// controllers/query3.js
// StockTrackr - Query 3: Users Without Transactions
// Pattern: Direct HTML Generation (returns complete HTML page)

const db = require('../dbConfig');

/**
 * Get users names and emails who have made no transactions.
 * Uses Direct HTML pattern - returns full HTML instead of JSON.
 */
const getNewUsers = (req, res) => {

  // SQL uses subquery to find users without transactions
  const query = `
    SELECT
      u.username,
      u.email
    FROM users u
    WHERE u.id NOT IN (SELECT t.user_id FROM transactions t)
  `;

  db.query(query, [orderType], (err, results) => {
    if (err) {
      console.error('Query 3 error:', err);
      // Return styled error page
      return res.status(500).send(generateErrorPage('Error fetching user data'));
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
    <title>StockTrackr — Users Without Transactions</title>
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
                <a href="/query3.html" aria-current="page">Users Without Transactions</a>
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
            <h1>Users Without Transactions</h1>
            <p class="subtitle">Usernames and emails of users who have not made any transactions</p>
        </div>
  `;

  // If no results, show an info alert instead of a table
  if (results.length === 0) {
    html += `
        <div class="card">
            <div class="alert alert-info">
                No new users (those with 0 transactions) found.
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
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Table rows for each line item
    results.forEach(row => {
      html += `
                    <tr>
                        <td>${row.username}</td>
                        <td>${row.email}</td>
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
          <a href="/query3.html" class="btn-primary btn-back">Back to Search</a>
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
              <a href="/query1.html" class="btn-primary btn-back">Back to Search</a>
            </div>
        </div>
    </main>
</div>
</body>
</html>
  `;
}

module.exports = {
  getNewUsers
};












