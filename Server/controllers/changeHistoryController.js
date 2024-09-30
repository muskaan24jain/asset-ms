import con from "../utils/db.js";

// Get change history records
export const getChangeHistory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        asset_id,
        action_type,
        changed_by,
        change_timestamp,
        old_value,
        new_value
      FROM change_history
      ORDER BY change_timestamp DESC
    `);

    res.json({
      Status: true,
      Result: rows,
    });
  } catch (error) {
    console.error("Error fetching change history:", error);
    res.status(500).json({
      Status: false,
      Error: "An error occurred while fetching change history.",
    });
  }
};
