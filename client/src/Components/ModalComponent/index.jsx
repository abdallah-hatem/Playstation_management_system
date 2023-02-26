import {Modal} from "antd"
import React from "react"

export default function ModalComponent({
  title = "title",
  open,
  onOk,
  onCancel,
  children,
}) {
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel}>
      {children}
    </Modal>
  )
}
