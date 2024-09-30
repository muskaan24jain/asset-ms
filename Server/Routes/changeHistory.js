// routes/changeHistory.js
import express from "express";
import con from "../utils/db.js";

const router = express.Router();

// Get change history for admin
router.get("/", (req, res) => {
  const query = "SELECT * FROM change_history ORDER BY timestamp DESC";
  con.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new entry to the change history
router.post("/", (req, res) => {
  const { user_id, action_type, asset_id, old_value, new_value } = req.body;
  const query =
    "INSERT INTO change_history (user_id, action_type, asset_id, old_value, new_value) VALUES (?, ?, ?, ?, ?)";
  con.query(
    query,
    [user_id, action_type, asset_id, old_value, new_value],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Change history recorded", id: result.insertId });
    }
  );
});

export default router;
