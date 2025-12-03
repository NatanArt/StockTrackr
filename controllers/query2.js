// controllers/query2.js
// StockTrackr - Query 2: Net Inventory Change (Phase II Query 10)
// Pattern: JSON Response

const db = require('../dbConfig');

const getHighDemandCategories = (req, res) => {
  const query = `
    SELECT
      it.item_id AS item_id,
      it.item_name AS item_name,
      cat.category_name AS category_name,
      it.quantity_in_stock AS current_stock,
      COALESCE(SUM(CASE WHEN tr.type = 'In' THEN tr.quantity ELSE 0 END), 0) AS total_in,
      COALESCE(SUM(CASE WHEN tr.type = 'Out' THEN tr.quantity ELSE 0 END), 0) AS total_out,
      (COALESCE(SUM(CASE WHEN tr.type = 'In' THEN tr.quantity ELSE 0 END), 0)
       - COALESCE(SUM(CASE WHEN tr.type = 'Out' THEN tr.quantity ELSE 0 END), 0)) AS net_change,
      it.quantity_in_stock + (COALESCE(SUM(CASE WHEN tr.type = 'In' THEN tr.quantity ELSE 0 END), 0)
       - COALESCE(SUM(CASE WHEN tr.type = 'Out' THEN tr.quantity ELSE 0 END), 0)) AS projected_stock
    FROM items it
    LEFT JOIN transactions tr ON tr.item_id = it.item_id
    LEFT JOIN categories cat ON cat.category_id = it.category_id
    GROUP BY it.item_id, it.item_name, cat.category_name, it.quantity_in_stock
    ORDER BY net_change DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Query 2 error:', err);
      return res.status(500).json({ 
        error: 'Error fetching inventory change data' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        message: 'No inventory data found' 
      });
    }

    res.json(results);
  });
};

module.exports = { getHighDemandCategories };




