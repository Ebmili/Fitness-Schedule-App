import { useState } from 'react';

const InputSchedule = ({ onScheduleAdded, selectedClassType }) => {
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleStartTime, setScheduleStartTime] = useState('');
  const [scheduleEndTime, setScheduleEndTime] = useState('');
  const [classType, setClassType] = useState('');

  const handleStartTimeChange = (e) => {
    const newStartTimeValue = e.target.value;
    setScheduleStartTime(newStartTimeValue);
  };

  const handleEndTimeChange = (e) => {
    const newEndTimeValue = e.target.value;
    setScheduleEndTime(newEndTimeValue);
  };

  const handleLocalClassTypeChange = (e) => {
    const value = e.target.value;
    setClassType(value);
    console.log('Selected Class Type in InputSchedule:', value);
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
          classtypes: classType,
        }),
      });
  
      if (response.ok) {
        console.log('Schedule added successfully');
        onScheduleAdded({
          description,
          schedule_date: scheduleDate,
          schedule_start_time: scheduleStartTime,
          schedule_end_time: scheduleEndTime,
          classtypes: classType,
        });
        setDescription('');
        setScheduleDate('');
        setScheduleStartTime('');
        setScheduleEndTime('');
        setClassType('');
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
        <label>
  Select Class Type:
  <select value={classType} onChange={handleLocalClassTypeChange}>
    <option value="">Select Class Type</option>
    <option value="Cardio">Cardio</option>
    <option value="Fullbody">Fullbody</option>
    <option value="Strength">Strength</option>
    <option value="Zumba">Zumba</option>
    <option value="Yoga">Yoga</option>
    <option value="Dance">Dance</option>
  </select>
</label>
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default InputSchedule;