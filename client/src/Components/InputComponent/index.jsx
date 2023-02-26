import { Input } from "antd";

export default function InputComponent({
  placeholder = "placeholder",
  name,
  onChange,
  type,
  style,
  onKeyUp,
  status,
}) {
  return (
    <Input
      status={status}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      type={type}
      style={style}
      onKeyUp={onKeyUp}
    />
  );
}
