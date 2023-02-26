import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DevicesContext } from "../../context/DevicesContext";
import { EDIT_USER_DEVICES } from "./Api";
import ButtonComponent from "../../Components/ButtonComponent";
import ModalComponent from "../../Components/ModalComponent";
import InputComponent from "../../Components/InputComponent";
import "./style.css";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isLoggedIn, getUserId } = useContext(AuthContext);
  const { setDevicesNumber } = useContext(DevicesContext);
  const [currentRoute, setCurrentRoute] = useState("");

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location]);

  const defaultValues = useRef({
    devices_number: 0,
  });

  const [values, setValues] = useState(defaultValues.current);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = useCallback((e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleDevicesButton() {
    // update devices in local storage
    setDevicesNumber(values["devices_number"]);
    // update devices in database
    EDIT_USER_DEVICES({
      id: getUserId(),
      devices: values["devices_number"],
    });
    setModalOpen(false);
    window.location.reload();
  }

  const buttons = [
    {
      title: "Devices",
      style: { padding: "0 5px" },
      onClick: () => setModalOpen(true),
      hidden: !isLoggedIn() || currentRoute === "/receipts",
    },
    {
      title: currentRoute === "/receipts" ? "Home" : "Receipts",
      style: { padding: "0 5px", marginLeft: 5 },
      onClick: () => {
        if (currentRoute === "/receipts") {
          navigate("/");
        } else {
          navigate("/receipts");
        }
      },
      hidden: !isLoggedIn(),
    },
    {
      title: "logout",
      style: { padding: "0 5px", marginLeft: 5 },
      onClick: handleLogout,
      hidden: !isLoggedIn(),
    },
  ];

  return (
    <div className="navbar-container">
      <h2>PlayStation.</h2>
      <div>
        {buttons.map((el) => (
          <ButtonComponent
            title={el.title}
            style={el.style}
            onClick={el.onClick}
            hidden={el.hidden}
          />
        ))}
      </div>

      <ModalComponent
        title="how many Devices ?"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleDevicesButton}
      >
        <InputComponent
          type="number"
          name="devices_number"
          onChange={handleChange}
        />
      </ModalComponent>
    </div>
  );
}
