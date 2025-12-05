// server.js
const express = require('express');
const path = require('path');
const db = require('./dbConfig');

// Import controllers
const query1Controller = require('./controllers/query1');
const query2Controller = require('./controllers/query2');
const query3Controller = require('./controllers/query3');
const query4Controller = require('./controllers/query4');
const query5Controller = require('./controllers/query5');
const query6Controller = require('./controllers/query6');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/query1', query1Controller.getOrderDetails);
app.get('/api/high-demand-categories', query2Controller.getHighDemandCategories);
app.get('/api/items/above-average', query3Controller.getItemsAboveSupplierAvg);
app.get('/api/suppliers', query3Controller.getSupplierList);
app.get('/api/query4/purchase-totals', query4Controller.getItemPurchaseQuantities);
// Query 5: Category Items Union
app.get('/query5', query5Controller.getEmailDetails);

// Query 6: Transaction Processing, Fund Transfer
app.post('/query6/transfer', query6Controller.transferFunds);
app.get('/query6/bank-accounts', query6Controller.getBankAccounts);
app.post('/query6/simulate-failure', query6Controller.simulateFailure);
app.post('/query6/reset-balances', query6Controller.resetBalances);



// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'StockTrackr API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
        <title>404 - Not Found</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(#ffffff, #f7f7f7);
          }
          h1 { color: #dc3545; }
          a { color: #2f6fbf; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Return to Dashboard</a>
      </body>
    </html>
  `);
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


const PORT = 5001;

app.listen(PORT, () => {
  console.log('StockTrackr Server Started Successfully!');
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
  console.log('.'.repeat(60));
});