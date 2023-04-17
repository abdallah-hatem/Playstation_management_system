import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DevicesContext } from "../../context/DevicesContext";
import { ADD_RECEIPT } from "../../pages/Main/Api";
import ButtonComponent from "../ButtonComponent";
import CardComponent from "../CardComponent";
import ModalComponent from "../ModalComponent";
import PopUpComponent from "../PopUpComponent";

function Stopwatch({ title = "title", deviceId }) {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [infoStartTime, setInfoStartTime] = useState(0);
  const [infoEndTime, setInfoEndTime] = useState(0);

  const [hours, setHours] = useState(
    Math.floor(elapsedTime / (60 * 60 * 1000)) ?? 0
  );
  const [minutes, setMinutes] = useState(
    Math.floor((elapsedTime / (60 * 1000)) % 60)
  );
  const [seconds, setSeconds] = useState(Math.floor((elapsedTime / 1000) % 60));

  useEffect(() => {
    // Restore startTime and elapsedTime from localStorage if they exist
    const storedStartTime = localStorage.getItem(`startTime${deviceId}`);
    const storedElapsedTime = localStorage.getItem(`elapsedTime${deviceId}`);
    if (storedStartTime && storedElapsedTime) {
      setStartTime(parseInt(storedStartTime));
      setElapsedTime(parseInt(storedElapsedTime));
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    // Save startTime and elapsedTime to localStorage when the component unmounts

    let isPaused =
      !isRunning && (hours !== 0 || minutes !== 0 || seconds !== 0);

    return () => {
      if (isRunning) {
        localStorage.setItem(`startTime${deviceId}`, startTime);
        localStorage.setItem(`elapsedTime${deviceId}`, elapsedTime);
      }
    };
  }, [startTime, elapsedTime]);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, startTime]);

  useEffect(() => {
    setHours(Math.floor(elapsedTime / (60 * 60 * 1000)));
    setMinutes(Math.floor((elapsedTime / (60 * 1000)) % 60));
    setSeconds(Math.floor((elapsedTime / 1000) % 60));
  }, [elapsedTime]);

  function resetNumbers() {
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  }

  const timeFormat = useMemo(
    () =>
      `${new Date().getHours() % 12 || 12}:${
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes()
      }`,
    [startTime]
  );

  const handleStart = () => {
    if (!isRunning) {
      const now = Date.now();
      setStartTime(now - elapsedTime);
      !infoStartTime && setInfoStartTime(timeFormat);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    localStorage.removeItem(`elapsedTime${deviceId}`);
  };

  const handleReset = () => {
    setIsRunning(false);
    resetNumbers();
    localStorage.removeItem(`elapsedTime${deviceId}`);
    localStorage.removeItem(`startTime${deviceId}`);
    setInfoStartTime(0);
    setInfoEndTime(0);
    window.location.reload();
  };

  //////////////////////////////////////////////////
  const { getUserId } = useContext(AuthContext);
  const { getHourRate } = useContext(DevicesContext);

  const [charge, setCharge] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // set charge for 0.5$/min
  useEffect(() => {
    setCharge(
      (hours * getHourRate() + minutes * (getHourRate() / 60)).toFixed(1)
    );
  }, [elapsedTime]);

  function borderColor() {
    if (isRunning) {
      return "green";
    } else if (!startTime) {
      return "blue";
    }
  }

  const dateFormat = `${
    new Date().getMonth() + 1
  }/${new Date().getDate()}/${new Date().getFullYear()}`;

  function handleOk() {
    ADD_RECEIPT({
      date: dateFormat,
      charge: Math.round(charge),
      user: String(getUserId()),
    }).then(() => {
      handleReset();
      setModalOpen(false);
    });
  }

  function handleDone() {
    handlePause();
    setModalOpen(true);
    setInfoEndTime(timeFormat);
  }

  let paused = !isRunning && hours === 0 && minutes === 0 && seconds === 0;

  const buttons = [
    {
      title: !paused ? "Resume" : "Start",
      style: { backgroundColor: "orange", width: "30%" },
      onClick: handleStart,
      disabled: isRunning,
    },
    {
      title: "Pause",
      style: { width: "30%" },
      onClick: handlePause,
      disabled: !isRunning,
    },
    {
      title: "Reset",
      style: { backgroundColor: "red", width: "30%" },
      onClick: handleReset,
      disabled: paused,
    },
  ];

  const info = [
    { title: "Start", content: infoStartTime },
    { title: "End", content: infoEndTime },
  ];

  return (
    <CardComponent
      title={title}
      style={{ width: "300px", borderColor: borderColor() }}
    >
      <div className="watch">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>

      <div className="d-flex flex-column justify-content-between p-1">
        <div className="d-flex justify-content-between mb-3">
          {info.map((el) => (
            <span className="info">
              {el.title}: {el.content}
            </span>
          ))}
        </div>
        <span className="info">Charge: ${charge}</span>
      </div>

      <div className="d-flex flex-column justify-content-between p-1 mt-3">
        <div className="top-button-container">
          {buttons.map((el) =>
            el.title === "Reset" ? (
              <PopUpComponent
                title="Reset"
                message="Are you sure to reset ?"
                onConfirm={el.onClick}
              >
                <ButtonComponent
                  title={el.title}
                  style={el.style}
                  disabled={el.disabled}
                />
              </PopUpComponent>
            ) : (
              <ButtonComponent
                title={el.title}
                style={el.style}
                onClick={el.onClick}
                disabled={el.disabled}
              />
            )
          )}
        </div>

        <PopUpComponent
          title="Submit"
          message="Are you sure to end ?"
          onConfirm={handleDone}
        >
          <ButtonComponent
            title="Done"
            style={{ backgroundColor: "green" }}
            disabled={!(charge > 0)}
          />
        </PopUpComponent>
      </div>
      <ModalComponent
        title="Receipt"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
      >
        <div className="receipt">
          <p className="info">Start: {infoStartTime}</p>
          <p className="info">End: {infoEndTime}</p>
          <p className="info">
            Timer: <span>{hours}</span>:<span>{minutes}</span>:
            <span>{seconds}</span>
          </p>
          <p className="info">Charge: ${charge}</p>
        </div>
      </ModalComponent>

      {/* <StopWatch /> */}
    </CardComponent>
  );
}

export default Stopwatch;
