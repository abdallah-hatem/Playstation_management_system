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
  const { setDevicesNumber } = useContext(DevicesContext);
  const [currentRoute, setCurrentRoute] = useState("");
  const [drawer, setDrawer] = useState(false);

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
    }).then(() => {
      setModalOpen(false);
      window.location.reload();
    });
  }

  const navItems = [
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
      style: { padding: "0 5px", marginLeft: 5, color: "red" },
      onClick: handleLogout,
      hidden: !isLoggedIn(),
    },
  ];

  return (
    <div className="navbar-container">
      <h2>PlayStation.</h2>
      <div className="nav-items-container">
        {navItems.map((el) => (
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
        {navItems.map((el) => (
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
