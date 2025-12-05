// controllers/query1.js
// StockTrackr - Query 1: Sale Transaction Details (Phase II Query 9)
// Pattern: Direct HTML Generation

const db = require('../dbConfig');

const getOrderDetails = (req, res) => {
  const limit = req.query.limit || 20;
  
  const query = `
    SELECT
      t.transaction_id,
      t.transaction_date,
      u.username,
      i.item_name,
      c.category_name,
      t.quantity,
      o.total_amount AS order_total,
      o.customer_name
    FROM transactions t
    JOIN users u ON u.user_id = t.user_id
    JOIN items i ON i.item_id = t.item_id
    JOIN orders o ON o.order_id = t.order_id
    LEFT JOIN categories c ON c.category_id = i.category_id
    WHERE t.type = 'Out' AND o.order_type = 'Sale'
    ORDER BY t.transaction_date DESC
    LIMIT ?
  `;

  db.query(query, [parseInt(limit)], (err, results) => {
    if (err) {
      console.error('Query 1 error:', err);
      return res.status(500).send(generateErrorPage('Error fetching transaction data'));
    }

    res.send(generateResultsPage(results, limit));
  });
};

function generateResultsPage(results, limit) {
  let html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>StockTrackr — Sale Transaction Details</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<div class="app">
    <header class="topbar">
        <div style="display:flex; align-items:center;">
            <div class="brand">
                <a href="/index.html">
                    <div class="logo">
                        <img src="/assets/logo.png" alt="StockTrackr logo" width="46" height="46">
                    </div>
                </a>
                <div>
                    <div style="font-weight:800; font-size:18px; letter-spacing:-0.2px;">Stock<span style="color:#F6A800">Trackr</span></div>
                </div>
            </div>
            <nav class="navlinks">
                <a href="/index.html">Dashboard</a>
                <a href="/query1.html" aria-current="page">Transactions</a>
                <a href="/query2.html">Inventory</a>
                <a href="/query6.html">Fund Transfer</a>
            </nav>
        </div>
        <div class="right-actions">
            <button class="btn ghost">Manager</button>
            <button class="btn">Logout</button>
        </div>
    </header>

    <main class="main">
        <div class="title">
            <h1>Sale Transaction Details</h1>
            <p class="subtitle">Comprehensive sales transaction audit (8-table JOIN)</p>
        </div>
  `;

  if (results.length === 0) {
    html += `
        <div class="card">
            <div class="alert alert-info">No sale transactions found.</div>
        </div>
    `;
  } else {
    html += `
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Order Total</th>
                        <th>Customer</th>
                    </tr>
                </thead>
                <tbody>
    `;

    results.forEach(row => {
      html += `
                    <tr>
                        <td>${row.transaction_id}</td>
                        <td>${new Date(row.transaction_date).toLocaleString()}</td>
                        <td>${row.username}</td>
                        <td>${row.item_name}</td>
                        <td>${row.category_name || 'N/A'}</td>
                        <td>${row.quantity}</td>
                        <td>$${parseFloat(row.order_total).toFixed(2)}</td>
                        <td>${row.customer_name || 'N/A'}</td>
                    </tr>
      `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;
  }

  html += `
        <div style="margin-top: 24px; text-align: center;">
            <a href="/query1.html" class="btn-primary" style="display: inline-block; text-decoration: none;">Back to Search</a>
        </div>
    </main>
</div>
</body>
</html>
  `;

  return html;
}

function generateErrorPage(errorMessage) {
  return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<div class="app">
    <main class="main">
        <div class="card">
            <div class="alert alert-error">${errorMessage}</div>
            <a href="/query1.html" class="btn-primary" style="display: inline-block; text-decoration: none;">Back</a>
        </div>
    </main>
</div>
</body>
</html>
  `;
}

module.exports = { getOrderDetails };





