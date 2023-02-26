import React from "react";
import { Card } from "antd";

export default function CardComponent({
  title = "title",
  style,
  children,
  loading,
  className,
}) {
  return (
    <Card
      className={`card ${className}`}
      title={title}
      loading={loading}
      style={{ ...style, margin: 15 }}
    >
      {children}
    </Card>
  );
}
