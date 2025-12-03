// controllers/query4.js
// StockTrackr - Query 4: Total Purchase Quantities (FULL OUTER JOIN Emulation)
// Pattern: JSON Response
const db = require('../dbConfig');

const getItemPurchaseQuantities = (req, res) => {
    const query = `
        SELECT 
            i.item_id,
            i.item_name,
            COALESCE(SUM(oi.quantity), 0) AS total_purchased
        FROM items i
        LEFT JOIN order_items oi ON i.item_id = oi.item_id
        GROUP BY i.item_id, i.item_name

        UNION

        SELECT 
            i.item_id,
            i.item_name,
            COALESCE(SUM(oi.quantity), 0) AS total_purchased
        FROM items i
        RIGHT JOIN order_items oi ON i.item_id = oi.item_id
        WHERE i.item_id IS NULL
        GROUP BY i.item_id, i.item_name;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Query4 error:", err);
            return res.status(500).json({ error: "Error retrieving item purchase quantities" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No purchase data found." });
        }

        res.json(results);
    });
};

module.exports = {
    getItemPurchaseQuantities
};
