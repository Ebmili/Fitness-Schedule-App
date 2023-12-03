import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ListSchedules.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const formatTimeString = (timeString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString('pl-PL', options);
};

const formatDateString = (date) => {
  const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('en-EN', options);
  const [weekday, day, month] = formattedDate.split(', ');

  return (
    <div>
      <span className="weekday">{weekday}</span>
      <br />
      <span className="day">{day}</span>
      <span className="month">{month}</span>
    </div>
  );
};

const fetchAndSetSchedules = async (setSchedules, setSelectedDate) => {
  try {
    const response = await axios.get('http://localhost:5000/schedules');
    setSchedules(response.data);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
  }
};

const generateDateOptions = (selectedDate) => {
  const nextThreeDays = [];
  for (let i = -3; i < 4; i++) {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + i);
    nextThreeDays.push(date);
  }
  return nextThreeDays;
};

const calculateDuration = (start, end) => {
  const startTime = new Date(`1970-01-01T${start}Z`);
  const endTime = new Date(`1970-01-01T${end}Z`);

  // Calculate the duration in minutes
  const durationMinutes = (endTime - startTime) / (1000 * 60);

  // Convert minutes to hours and minutes
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${hours}h ${minutes}m`;
};


const ListSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    fetchAndSetSchedules(setSchedules, setSelectedDate);
  }, []);

  useEffect(() => {
    setDateOptions(generateDateOptions(selectedDate));
  }, [selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleNextClick = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handlePrevClick = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/schedules/${id}`);
      fetchAndSetSchedules(setSchedules, setSelectedDate);
    } catch (error) {
      console.error('Error deleting schedule:', error.message);
    }
  };

  const pollForUpdates = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error.message);
    }
    setTimeout(pollForUpdates, 1000);
  }, [setSchedules]);

  useEffect(() => {
    pollForUpdates();
  }, [pollForUpdates]);

  const middleIndex = Math.floor(dateOptions.length / 2);

  const isCurrentDate = (date) => {
    const currentDate = new Date();
    return (
      date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getDate() === currentDate.getDate()
    );
  };

  return (
    <div className="container">
      <h1>Any Classes</h1>
      <div className="date-options">
        <div>
          <button onClick={handlePrevClick} className="arrow left"></button>
        </div>
        {dateOptions.map((date, index) => (
          <div
            key={date.toISOString()}
            className={`date-option ${isCurrentDate(date) ? 'current' : ''} ${
              selectedDate.getTime() === date.getTime() ? 'selected' : ''
            } ${index === middleIndex ? 'middle' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            {formatDateString(date)}
          </div>
        ))}
        <div>
          <button className="arrow right" onClick={handleNextClick}></button>
        </div>
      </div>
      <div className="schedule-container">
        {schedules
          .filter(
            (schedule) =>
              new Date(schedule.schedule_date).toLocaleDateString() ===
              selectedDate.toLocaleDateString()
          )
          .map((schedule) => (
            <div key={schedule.schedule_id} className="schedule-item">
              <div className="schedule-item-time">
                <p>Start Time: {formatTimeString(schedule.schedule_start_time)}</p>
                <p>End Time: {formatTimeString(schedule.schedule_end_time)}</p>
                <p>Duration: {calculateDuration(schedule.schedule_start_time, schedule.schedule_end_time)}</p>
              </div>
              <div className="border-right"></div>
              <div className="schedule-item-details">
                <p>Description: {schedule.description}</p>
              </div>
              <div className="schedule-item-delete">
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleDeleteClick(schedule.schedule_id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListSchedules;
