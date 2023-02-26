import React from "react";
import { Button } from "antd";

export default function ButtonComponent({
  title = "title",
  disabled = false,
  style,
  onClick,
  hidden,
  htmlType,
  type = "primary",
}) {
  return (
    <Button
      type={type}
      htmlType={htmlType}
      disabled={disabled}
      style={{ padding: 0, ...style }}
      onClick={onClick}
      hidden={hidden}
    >
      {title}
    </Button>
  );
}
