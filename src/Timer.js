import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import SettingsContext from "./SettingsContext";
import { useContext, useState, useEffect, useRef } from 'react';
import sound from './sounds/alarm.wav'

const red = '#f54e4e';
const green = '#4aec8c';

function Timer( ) {
    const alarm = new Audio(sound); 
    const [isPaused, setIsPaused] = useState(true);
    const settingsInfo = useContext(SettingsContext);
    const [mode, setMode] = useState('work') // work/break/null
    const [secondsLeft, setSecondsLeft] = useState(settingsInfo.workMinutes * 60);

    let secondsLeftRef = useRef(secondsLeft);
    let isPausedRef = useRef(isPaused);
    let modeRef = useRef(mode);
    

    function initTimer() {
        setSecondsLeft(settingsInfo.workMinutes * 60);
    }

    function switchMode() {
        setIsPaused(true)
        isPausedRef.current = true;

        let newMode = modeRef.current === 'work' ? 'break' : 'work';
        let newSecondsLeft = newMode === 'work' ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
        setMode(newMode);
        modeRef.current = newMode;

        setSecondsLeft(newSecondsLeft);
        secondsLeftRef.current = newSecondsLeft;

        newMode === 'work' ? document.querySelector('body').style.backgroundImage = 'linear-gradient(to bottom right, #30384b 0%, #ad464d 100%)' : document.querySelector('body').style.backgroundImage = 'linear-gradient(to bottom right, #30384b 0%, #3d946c 100%)'
    }

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }
    
    useEffect(() => {
        console.log(secondsLeft, 'seconds left');
        console.log(totalSeconds, 'total seconds');
        console.log(percentage, 'percent')
        console.log(mode, 'mode')
    }, [secondsLeft])

    useEffect(() => {
        initTimer();

        const interval = setInterval(() => {
            if (isPausedRef.current) return;
            if (secondsLeftRef.current === 0) {
                alarm.play();
                return switchMode();
            }

            tick();
        }, 10);
        return () => clearInterval(interval);

    }, [settingsInfo]);

    const totalSeconds = mode === 'work' 
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeftRef.current / totalSeconds * 100);

    const minutes = Math.floor(secondsLeftRef.current / 60);
    let seconds = secondsLeftRef.current % 60;
    if (seconds < 10) seconds = '0' + seconds;

    return(
        <div>
            <div className='modes'>
                <button onClick={() => {
                    switchMode();
                }} 
                style={mode === 'work' ? {backgroundColor: 'rgba(0, 0, 0, 0.1)'} : {backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                className='with-text'>Work</button>
                <button onClick={() => {
                    switchMode();
                }} 
                style={mode === 'break' ? {backgroundColor: 'rgba(0, 0, 0, 0.15)'} : {backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
                className='with-text'>Break</button>
            </div>
            <div style={{maxWidth: '340px', margin: '0 auto'}}>
                <CircularProgressbar 
                value={percentage} 
                text={`${minutes}:${seconds}`} 
                styles={buildStyles({
                    maxWidth: '340px',
                    textColor: '#fff',
                    pathColor: mode === 'work' ? red : green,
                    trailColor: 'rgba(255, 255, 255, .2)',

                })}/>
            </div>
            <div style={{marginTop: '40px'}}>
                {mode === 'work' ? <h3>Time for work!</h3> : <h3>Break time!</h3> }
            </div>

            <div style={{marginTop: '-10px'}}>
                {isPaused 
                ? <PlayButton onClick={() => {
                    setIsPaused(false) 
                    isPausedRef.current = false;
                }} /> 
                : <PauseButton onClick={() => {
                    setIsPaused(true)
                    isPausedRef.current = true;
                }} />}
            </div>
            <div style={{marginTop: '30px'}}>
                <SettingsButton 
                    onClick={() => {settingsInfo.setShowSettings(true)}}
                />
            </div>
        </div>
    )
}

export default Timer;