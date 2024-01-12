CREATE TABLE schedules (
  schedule_id SERIAL PRIMARY KEY,
  description VARCHAR(255),
  schedule_date DATE,
  schedule_start_time TIME,
  schedule_end_time TIME,
  classtypes VARCHAR(255)
);
