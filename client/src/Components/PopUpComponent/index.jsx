import {Popconfirm} from "antd"

export default function PopUpComponent({
  title = "title",
  message = "message",
  children,
  onConfirm,
  onCancel,
}) {
  return (
    <Popconfirm
      title={title}
      description={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
    >
      {children}
    </Popconfirm>
  )
}
