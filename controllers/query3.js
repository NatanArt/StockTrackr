// controllers/query3.js
// StockTrackr - Items Priced Above Supplier Average
// Pattern: JSON Response

const db = require('../dbConfig');

/**
 * Returns items whose price is above the average price for their supplier
 * Accepts optional query parameter: supplier_id to filter by specific supplier
 */
const getItemsAboveSupplierAvg = (req, res) => {
  const supplierId = req.query.supplier_id ? parseInt(req.query.supplier_id) : null;

  let query = `
    SELECT I1.item_id, I1.item_name, I1.price, I1.quantity_in_stock,
           I1.category_id, I1.supplier_id, s.supplier_name
    FROM items AS I1
    JOIN suppliers s ON s.supplier_id = I1.supplier_id
    WHERE I1.price > (
      SELECT AVG(I2.price)
      FROM items AS I2
      WHERE I1.supplier_id = I2.supplier_id
    )
  `;

  const params = [];
  if (supplierId) {
    query += ` AND I1.supplier_id = ?`;
    params.push(supplierId);
  }

  query += ` ORDER BY I1.supplier_id, I1.item_id`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('QueryAboveSupplierAvg error:', err);
      return res.status(500).json({ error: 'Error fetching items above supplier average price' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No items found above supplier average price' });
    }

    res.json(results);
  });
};

/**
 * Returns list of suppliers for dropdown menu
 */
const getSupplierList = (req, res) => {
  const query = `SELECT supplier_id, supplier_name FROM suppliers ORDER BY supplier_name`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Supplier list error:', err);
      return res.status(500).json({ error: 'Error fetching suppliers' });
    }

    res.json(results);
  });
};

module.exports = {
  getItemsAboveSupplierAvg,
  getSupplierList
};
