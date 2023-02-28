import { Modal } from "antd";
import React from "react";

export default function ModalComponent({
  title = "title",
  open,
  onOk,
  onCancel,
  children,
  okText,
  cancelText,
}) {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      okText={okText}
      onCancel={onCancel}
      cancelText={cancelText}
    >
      {children}
    </Modal>
  );
}
