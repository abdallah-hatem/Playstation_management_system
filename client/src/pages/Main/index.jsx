import { useContext } from "react";
import Device from "../../Components/Device";
import FinalStopWatch from "../../Components/Device/FinalStopWatch";
import { DevicesContext } from "../../context/DevicesContext";

export default function Main() {
  const { getDevicesNumber } = useContext(DevicesContext);

  function renderDevices() {
    const newDevices = [];
    for (let index = 0; index < getDevicesNumber(); index++) {
      // newDevices.push(<Device title={`Device ${index + 1}`} />);
      newDevices.push(
        <FinalStopWatch deviceId={index} title={`Device ${index + 1}`} />
      );
    }
    return newDevices;
  }

  return <div className="devices-container">{renderDevices()}</div>;
}
