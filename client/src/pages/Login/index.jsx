import { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../Components/ButtonComponent";
import CardComponent from "../../Components/CardComponent/CardComponent";
import InputComponent from "../../Components/InputComponent";
import { AuthContext } from "../../context/AuthContext";
import { DevicesContext } from "../../context/DevicesContext";
import { LOGIN } from "./Api";
import LinkComponent from "../../Components/LinkComponent";
import "./style.css";

export default function Login() {
  let navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { setDevicesNumber } = useContext(DevicesContext);

  const defaultValues = useRef({
    email: "",
    password: "",
  });

  const [values, setValues] = useState(defaultValues.current);
  const [error, setError] = useState(false);

  const handleChange = useCallback((e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!values.email || !values.password) {
      alert("Fill the inputs");
      return;
    }

    LOGIN(values).then((data) => {
      if (data) {
        login(data.user._id);
        navigate("/");
        setDevicesNumber(data.user.devices ?? 3);
        console.log(data, "login data");
        setError(false);
      } else {
        setError(true);
      }
    });
  }

  const inputs = [
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
  ];

  return (
    <CardComponent title="Login" className="card-comp">
      <form>
        {error && (
          <h6 style={{ color: "red", textAlign: "center" }}>
            Wrong E-Mail or password
          </h6>
        )}

        {inputs.map((el) => (
          <InputComponent
            placeholder={el.placeholder}
            name={el.name}
            onChange={el.onChange}
            type={el.type}
            style={{ marginBottom: 15 }}
            // status={el.status}
          />
        ))}

        <ButtonComponent
          title="submit"
          htmlType="submit"
          style={{ width: "100%" }}
          onClick={handleSubmit}
        />
      </form>

      <LinkComponent title="Sign Up" url="/signup" />
    </CardComponent>
  );
}
