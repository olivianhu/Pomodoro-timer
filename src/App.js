import { useState } from 'react';
import './App.css';
import Settings from './Settings';
import SettingsContext from './SettingsContext';
import Timer from './Timer';


function App() {
  let [showSettings, setShowSettings] = useState(false);
  let [workMinutes, setWorkMinutes] = useState(25);
  let [breakMinutes, setBreakMinutes] = useState(5);

  return (
    <main>
      <h1>Pomodoro Timer</h1>
      <SettingsContext.Provider value={{
        showSettings, 
        setShowSettings,
        workMinutes,
        breakMinutes,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;
