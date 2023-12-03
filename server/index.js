const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.post('/schedules', async (req, res) => {
  try {
    const { description, schedule_date, schedule_start_time, schedule_end_time } = req.body;

    // Use the current time directly in the SQL query
    const newSchedule = await pool.query(
      "INSERT INTO schedules (description, schedule_date, schedule_start_time, schedule_end_time, schedule_time) VALUES($1, $2, $3, $4, CURRENT_TIME) RETURNING *",
      [description, schedule_date, schedule_start_time, schedule_end_time]
    );

    res.json(newSchedule.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get('/schedules', async (req, res) => {
  try {
  const allSchedules = await pool.query("SELECT * FROM schedules");
  res.json(allSchedules.rows)
} catch (err) {
  console.error(err.message);
}
});

app.get("/schedules/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const schedule = await pool.query("Select * FROM schedules WHERE schedule_id = $1", [id])
    res.json(schedule.rows[0])
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/schedules/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const { description } = req.body;
    const updateSchedule = await pool.query("UPDATE schedules SET description = $1 WHERE schedule_id = $2", [description, id]
    );
    res.json("Schedule was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/schedules/:id", async(req, res) => {
  try {
    const {id} = req.params;
    const deleteSchedule = await pool.query("DELETE FROM schedules WHERE schedule_id = $1", 
    [id]
    );
    res.json("Schedule was deleted")
  } catch (err) {
    console.error(err.message);
  }
});


app.listen(5000, () => {
  console.log("Server has started port 5000");
});
