import { useState, useRef, useEffect } from "react";
import "../styles/Timer.css";
import alarmSound from "../assets/alarm.mp3";
import axios from "axios";
import Activity from "./Activity";

const Timer = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [alertActive, setAlertActive] = useState(false);
  const timeInterval = useRef(null);

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [newActivityName, setNewActivityName] = useState("");

  // Play alarm sound effect
  const playSound = () => {
    const audio = new Audio(alarmSound);
    audio.loop = true;
    audio.play();
    return audio;
  };

  useEffect(() => {
    let audio;
    if (alertActive) {
      audio = playSound();
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [alertActive]);

  const fetchSessionData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/v1/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data && data.currentSession) {
        const { activityId, startTime, isRest, restLength, ongoing } =
          data.currentSession;

        const now = Date.now();
        const elapsedTime = Math.floor((now - new Date(startTime)) / 1000);

        if (isRest) {
          setTimer(restLength - elapsedTime > 0 ? restLength - elapsedTime : 0);
        } else {
          setTimer(elapsedTime);
        }

        setIsRest(isRest);
        setIsRunning(ongoing);

        if (ongoing) {
          startTimer();
        }
      }
    } catch (error) {
      console.error("Failed to fetch session data:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("api/v1/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(data.activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const createActivity = async (newActivityName) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/v1/activities",
        { name: newActivityName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setActivities((prev) => [...prev, data.activity]);
      setSelectedActivity(data.activity._id);
      setNewActivityName("");
    } catch (error) {
      console.error("Failed to create activity:", error);
    }
  };

  const endSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "api/v1/sessions/end",
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (data.currentSession) {
        // Rest timer countdown
        timeInterval.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timeInterval.current);
              timeInterval.current = null;
              setIsRest(false);
              setAlertActive(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };
  
  useEffect(() => {
    fetchSessionData();
    fetchActivities();
    return () => clearInterval(timeInterval.current); // Cleanup interval on component unmount
  }, []);

  const startTimer = () => {
    if (!timeInterval.current) {
      // Only start if no interval is running
      timeInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStart = () => {
    if (isRunning || isRest) return;
    setIsRunning(true);
    setAlertActive(false);
    startTimer();
  };

  const handlePause = () => {
    if (!isRunning || isRest) return;
    setIsRunning(false);
    clearInterval(timeInterval.current);
    timeInterval.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsRest(false);
    setAlertActive(false);
    clearInterval(timeInterval.current);
    timeInterval.current = null;
    setTimer(0);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(1, "0");
    const minutes = Math.floor((time / 60) % 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timer);

  return (
    <div>
      <div className={"timer-block"}>
        <div className="timer-container">
          <div className="timer-box">
            <h1>{hours}</h1>
          </div>
          <span className="colon">:</span>
          <div className="timer-box">
            <h1>{minutes}</h1>
          </div>
          <span className="colon">:</span>
          <div className="timer-box">
            <h1>{seconds}</h1>
          </div>
        </div>
        <div className="button-container">
          <button onClick={handleStart} disabled={isRest}>
            Start
          </button>
          <button onClick={endSession} disabled={isRest || timer === 0}>
            {isRest ? "Resting..." : "End Activity"}
          </button>
          <button onClick={handlePause} disabled={isRest}>
            Pause
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
      <Activity
        activities={activities}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        createActivity={createActivity}
      />
    </div>
  );
};

export default Timer;
