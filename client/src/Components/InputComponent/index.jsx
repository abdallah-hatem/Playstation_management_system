import { Input } from "antd";

export default function InputComponent({
  placeholder,
  name,
  onChange,
  type,
  style,
  onKeyUp,
  status,
  label,
  value,
}) {
  return (
    <>
      {label && (
        <label htmlFor="" style={{ marginBottom: 5 }}>
          {label}
        </label>
      )}
      <Input
        status={status}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        style={style}
        onKeyUp={onKeyUp}
      />
    </>
  );
}
