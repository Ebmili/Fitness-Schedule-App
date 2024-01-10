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
    const { description, schedule_date, schedule_start_time, schedule_end_time } = req.body;

    const newSchedule = await pool.query(
      "INSERT INTO schedules (description, schedule_date, schedule_start_time, schedule_end_time) VALUES($1, $2, $3, $4) RETURNING *",
      [description, schedule_date, schedule_start_time, schedule_end_time]
    );

    res.json(newSchedule.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server has started port 5000");
});