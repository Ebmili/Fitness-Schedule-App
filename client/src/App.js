import React from 'react';
import { useNavigate } from 'react-router-dom'; 

import './App.css';
import InputSchedule from './InputSchedule';
import ListSchedules from './ListSchedules';
import Navbar from './Navbar';

function App() {
  const navigate = useNavigate(); 

  const handleAddScheduleClick = () => {
    navigate('/new-schedule-page');  
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <br />
        <br />
        <button onClick={handleAddScheduleClick}>Add Schedule</button>
        <InputSchedule />
        <ListSchedules />
      </div>
    </>
  );
}

export default App;

