const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.get('/schedules', async (req, res) => {
  try {
    const allSchedules = await pool.query("SELECT * FROM schedules");
    res.json(allSchedules.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/schedules', async (req, res) => {
  try {
    const { description, schedule_date, schedule_start_time, schedule_end_time, classtypes } = req.body;

    const newSchedule = await pool.query(
      "INSERT INTO schedules (description, schedule_date, schedule_start_time, schedule_end_time, classtypes) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [description, schedule_date, schedule_start_time, schedule_end_time, classtypes]
    );

    res.json(newSchedule.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM schedules WHERE schedule_id = $1", [id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(5000, () => {
  console.log("Server has started port 5000");
});