// controllers/query1.js
// StockTrackr - Query 1: Complete Order Information
// Pattern: Direct HTML Generation (returns complete HTML page)

const db = require('../dbConfig');

/**
 * Get complete order information including supplier/customer and items.
 * Uses Direct HTML pattern - returns full HTML instead of JSON.
 */
const getOrderDetails = (req, res) => {
  const orderType = req.query.orderType || 'Purchase'; // default filter

  // SQL joins orders, suppliers/customers, and line items
  const query = `
    SELECT
      o.order_id,
      o.order_date,
      o.order_type,
      CASE 
        WHEN o.order_type = 'Purchase' THEN s.supplier_name
        WHEN o.order_type = 'Sale' THEN o.customer_name
      END AS party_name,
      i.item_name,
      oi.quantity,
      oi.unit_price,
      (oi.quantity * oi.unit_price) AS line_total
    FROM orders o
    LEFT JOIN suppliers s ON o.supplier_id = s.supplier_id   -- supplier only for purchases
    JOIN order_items oi ON oi.order_id = o.order_id           -- line items
    JOIN items i ON i.item_id = oi.item_id                    -- item info
    WHERE o.order_type = ?
    ORDER BY o.order_date DESC, o.order_id, oi.order_item_id
  `;

  db.query(query, [orderType], (err, results) => {
    if (err) {
      console.error('Query 1 error:', err);
      // Return styled error page
      return res.status(500).send(generateErrorPage('Error fetching order data'));
    }

    // Send full rendered HTML page
    res.send(generateResultsPage(orderType, results));
  });
};

// Build the complete results HTML page
function generateResultsPage(orderType, results) {
  let html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>StockTrackr — ${orderType} Order Details</title>
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
                <a href="/query1.html" aria-current="page">Orders</a>
                <a href="/query2.html">Categories</a>
                <a href="/query3.html">Stock Comparison</a>
                <a href="/query4.html">Purchase Quantities</a>
                <a href="/query5.html">Contact List</a>
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
            <h1>${orderType} Order Details</h1>
            <p class="subtitle">Complete order information with line items</p>
        </div>
  `;

  // If no results, show an info alert instead of a table
  if (results.length === 0) {
    html += `
        <div class="card">
            <div class="alert alert-info">
                No ${orderType.toLowerCase()} orders found.
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
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>${orderType === 'Purchase' ? 'Supplier' : 'Customer'}</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Line Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Table rows for each line item
    results.forEach(row => {
      html += `
                    <tr>
                        <td>${row.order_id}</td>
                        <td>${new Date(row.order_date).toLocaleDateString()}</td>
                        <td>${row.party_name || 'N/A'}</td>
                        <td>${row.item_name}</td>
                        <td>${row.quantity}</td>
                        <td>$${parseFloat(row.unit_price).toFixed(2)}</td>
                        <td>$${parseFloat(row.line_total).toFixed(2)}</td>
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
          <a href="/query1.html" class="btn-primary btn-back">Back to Search</a>
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
  getOrderDetails
};












