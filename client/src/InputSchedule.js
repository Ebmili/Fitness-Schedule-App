import { useState } from 'react';

const InputSchedule = ({ onScheduleAdded }) => {
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleStartTime, setScheduleStartTime] = useState('');
  const [scheduleEndTime, setScheduleEndTime] = useState('');

  const handleStartTimeChange = (e) => {
    const newStartTimeValue = e.target.value;
    setScheduleStartTime(newStartTimeValue);
  };

  const handleEndTimeChange = (e) => {
    const newEndTimeValue = e.target.value;
    setScheduleEndTime(newEndTimeValue);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          schedule_date: scheduleDate,
          schedule_start_time: scheduleStartTime,
          schedule_end_time: scheduleEndTime,
        }),
      });

      if (response.ok) {
        console.log('Schedule added successfully');
        onScheduleAdded({
          description,
          schedule_date: scheduleDate,
          schedule_start_time: scheduleStartTime,
          schedule_end_time: scheduleEndTime,
        });
        setDescription('');
        setScheduleDate('');
        setScheduleStartTime('');
        setScheduleEndTime('');
      } else {
        console.error('Failed to add schedule');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <h1>Add a schedule</h1>
      <form onSubmit={onSubmitForm}>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Schedule Date:
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </label>
        <label>
          Schedule Start Time:
          <input
            type="time"
            value={scheduleStartTime}
            onChange={handleStartTimeChange}
          />
        </label>
        <label>
          Schedule End Time:
          <input
            type="time"
            value={scheduleEndTime}
            onChange={handleEndTimeChange}
          />
        </label>
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default InputSchedule;
