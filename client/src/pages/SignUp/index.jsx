import { useCallback, useContext, useRef, useState } from "react";
import ButtonComponent from "../../Components/ButtonComponent";
import CardComponent from "../../Components/CardComponent";
import InputComponent from "../../Components/InputComponent";
import { AuthContext } from "../../context/AuthContext";
import LinkComponent from "../../Components/LinkComponent";
import { SIGN_UP } from "./Api";
import { useNavigate } from "react-router-dom";
import { DevicesContext } from "../../context/DevicesContext";

export default function SignUp() {
  const { login } = useContext(AuthContext);
  const { setDevicesNumber, setHourRate } = useContext(DevicesContext);

  let navigate = useNavigate();

  const defaultValues = useRef({
    username: "",
    email: "",
    password: "",
    devices: "",
    hourRate: "",
  });

  const [values, setValues] = useState(defaultValues.current);

  const handleChange = useCallback((e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (Object.values(values).filter((el) => !el).length > 0) {
      alert("Fill the inputs");
      return;
    }

    SIGN_UP(values).then((res) => {
      if (res) {
        setDevicesNumber(res.data.devices);
        setHourRate(res.data.hourRate);
        // FIX! sending user id as token for now
        login(res.data._id);
        navigate("/");
      }
    });
  }

  const inputs = [
    {
      placeholder: "User Name",
      name: "username",
      onChange: handleChange,
    },
    {
      placeholder: "E-Mail",
      name: "email",
      onChange: handleChange,
    },
    {
      placeholder: "Password",
      name: "password",
      type: "password",
      onChange: handleChange,
    },
    {
      placeholder: "Devices Number",
      name: "devices",
      type: "number",
      onChange: handleChange,
    },
    {
      placeholder: "Hour Rate",
      name: "hourRate",
      type: "number",
      onChange: handleChange,
    },
  ];

  return (
    <CardComponent
      title="Sign Up"
      style={{ width: "50%", alignSelf: "center" }}
    >
      <form>
        {inputs.map((el) => (
          <InputComponent
            placeholder={el.placeholder}
            name={el.name}
            onChange={el.onChange}
            type={el.type}
            style={{ marginBottom: 15 }}
          />
        ))}

        <ButtonComponent
          title="submit"
          htmlType="submit"
          style={{ width: "100%" }}
          onClick={handleSubmit}
        />
      </form>

      <LinkComponent title="Log in" url="/login" />
    </CardComponent>
  );
}
