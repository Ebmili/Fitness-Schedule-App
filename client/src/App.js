import './App.css';
import InputSchedule from './InputSchedule';
import ListSchedules from './ListSchedules';
import Navbar from './Navbar';

function App() {
  return (
    <>
    <Navbar />
    <div className="container">
      <InputSchedule />
      <ListSchedules />
      
      </div>
    </>
  );
}

export default App;

