// controllers/query2.js
// StockTrackr - Query 2: Items in High-Demand Categories
// Pattern: JSON Response

const db = require('../dbConfig');

/**
 * Find items that belong to categories with high order volumes
 * Returns JSON data for client-side rendering
 * 
 * Based on Phase II Query 2:
 * Items in categories where total ordered quantity > 50 units
 */
const getHighDemandCategories = (req, res) => {
  const minQuantity = parseInt(req.query.minQuantity) || 50;
  
  const query = `
    SELECT
      it.item_id,
      it.item_name,
      it.category_id,
      c.category_name,
      it.quantity_in_stock,
      it.price
    FROM items it
    JOIN categories c ON c.category_id = it.category_id
    WHERE it.category_id IN (
      SELECT i.category_id
      FROM order_items oi
      JOIN items i ON i.item_id = oi.item_id
      GROUP BY i.category_id
      HAVING SUM(oi.quantity) > ?
    )
    ORDER BY it.category_id, it.item_id
  `;

  db.query(query, [minQuantity], (err, results) => {
    if (err) {
      console.error('Query 2 error:', err);
      return res.status(500).json({ 
        error: 'Error fetching high-demand category items' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        message: `No items found in categories with total orders > ${minQuantity} units` 
      });
    }

    // Return JSON for client-side rendering
    res.json(results);
  });
};

module.exports = {
  getHighDemandCategories
};


