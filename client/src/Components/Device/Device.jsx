import { useContext, useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { ADD_RECEIPT } from "../../pages/Main/Api";
import { AuthContext } from "../../context/AuthContext";
import CardComponent from "../CardComponent/CardComponent";
import ButtonComponent from "../ButtonComponent";
import PopUpComponent from "../PopUpComponent";
import ModelComponent from "../ModalComponent";
import "./style.css";

function Device({ title = "title" }) {
  const { getUserId } = useContext(AuthContext);

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false, offsetTimestamp: new Date() });

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [charge, setCharge] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const hourlyRate = 50;

  // set charge for 0.5$/min
  useEffect(() => {
    setCharge((hours * hourlyRate + minutes * (hourlyRate / 60)).toFixed(1));
  }, [hours, minutes]);

  const timeFormat = `${new Date().getHours() % 12 || 12}:${
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes()
  }`;

  const dateFormat = `${
    new Date().getMonth() + 1
  }/${new Date().getDate()}/${new Date().getFullYear()}`;

  function handleStart() {
    start();
    endTime === 0 && setStartTime(timeFormat);
    setEndTime(0);
  }

  function handlePause() {
    pause();
    setEndTime(timeFormat);
  }

  function handleReset() {
    reset(new Date(), false);
    setStartTime(0);
    setEndTime(0);
    setCharge(0);
  }

  function handleDone() {
    handlePause();
    setModalOpen(true);
  }

  function handleOk() {
    ADD_RECEIPT({
      date: dateFormat,
      charge: Math.round(charge),
      user: String(getUserId()),
    }).then(() => {
      setModalOpen(false);
      handleReset();
    });
  }

  function borderColor() {
    if (isRunning) {
      return "green";
    } else if (endTime !== 0) {
      return "blue";
    }
  }

  const buttons = [
    {
      title: endTime === 0 ? "Start" : "Resume",
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
      disabled: seconds === 0 && minutes === 0 && hours === 0,
    },
  ];

  const info = [
    { title: "Start", content: startTime },
    { title: "End", content: endTime },
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
            disabled={!charge}
          />
        </PopUpComponent>
      </div>
      <ModelComponent
        title="Receipt"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
      >
        <div className="receipt">
          <p className="info">start: {startTime}</p>
          <p className="info">
            Timer: <span>{hours}</span>:<span>{minutes}</span>:
            <span>{seconds}</span>
          </p>
          <p className="info">Charge: ${charge}</p>
        </div>
      </ModelComponent>
    </CardComponent>
  );
}

export default Device;
