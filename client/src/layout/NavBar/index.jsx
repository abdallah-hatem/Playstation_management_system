import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DevicesContext } from "../../context/DevicesContext";
import { EDIT_USER_DEVICES } from "./Api";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import ButtonComponent from "../../Components/ButtonComponent";
import ModalComponent from "../../Components/ModalComponent";
import InputComponent from "../../Components/InputComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import "./style.css";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isLoggedIn, getUserId } = useContext(AuthContext);
  const { setDevicesNumber, setHourRate, getHourRate, getDevicesNumber } =
    useContext(DevicesContext);
  const [currentRoute, setCurrentRoute] = useState("");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location]);

  const defaultValues = useRef({
    devices_number: getDevicesNumber(),
    hour_rate: getHourRate(),
  });

  const [values, setValues] = useState(defaultValues.current);
  const [modalOpen, setModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleChange = useCallback((e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  function handleLogout() {
    logout();
    setLogoutModalOpen(false);
    navigate("/login");
  }

  function handleSettingsButton() {
    // update devices in local storage
    setDevicesNumber(values["devices_number"]);
    setHourRate(values["hour_rate"]);
    // update devices in database
    EDIT_USER_DEVICES({
      id: getUserId(),
      devices: values["devices_number"],
      hourRate: values["hour_rate"],
    }).then(() => {
      setModalOpen(false);
      window.location.reload();
    });
  }

  const navButtons = [
    {
      title: "Settings",
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
      style: { padding: "0 5px", marginLeft: 5, color: "red" },
      onClick: () => setLogoutModalOpen(true),
      hidden: !isLoggedIn(),
    },
  ];

  const settingsInputs = [
    {
      label: "number of devices",
      type: "number",
      name: "devices_number",
      value: values["devices_number"],
      onChange: handleChange,
      style: { marginBottom: 15 },
    },
    {
      label: "Hour Rate",
      type: "number",
      name: "hour_rate",
      value: values["hour_rate"],
      onChange: handleChange,
      style: { marginBottom: 15 },
    },
  ];

  return (
    <div className="navbar-container">
      <h2>PlayStation.</h2>
      <div className="nav-items-container">
        {navButtons.map((el) => (
          <ButtonComponent
            type="text"
            title={el.title}
            style={{ ...el.style, fontSize: 18 }}
            onClick={el.onClick}
            hidden={el.hidden}
          />
        ))}
      </div>

      {/* Responsive Navbar */}
      <MenuOutlined className="responsive" onClick={() => setDrawer(true)} />

      <DrawerComponent
        title=""
        open={drawer}
        onClose={() => setDrawer(false)}
        closeIcon={<CloseOutlined style={{ fontSize: 28 }} />}
      >
        {navButtons.map((el) => (
          <p
            className="responsive-nav-items"
            style={{ color: el.title === "logout" && "red" }}
            onClick={() => {
              el.onClick();
              setDrawer(false);
            }}
          >
            {el.title}
          </p>
        ))}
      </DrawerComponent>

      {/* Modals */}

      <ModalComponent
        title="Settings"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSettingsButton}
      >
        {settingsInputs.map((el) => (
          <InputComponent
            label={el.label}
            type={el.type}
            name={el.name}
            value={el.value}
            onChange={el.onChange}
            style={el.style}
          />
        ))}
      </ModalComponent>

      <ModalComponent
        title="Are you sure you want to log out ?"
        okText="Yes"
        cancelText="No"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onOk={handleLogout}
      />
    </div>
  );
}
