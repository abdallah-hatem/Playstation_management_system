import { Drawer } from "antd";

export default function DrawerComponent({
  onClose,
  open,
  children,
  title = "title",
  placement = "right",
  style,
  bodyStyle,
  closeIcon,
}) {
  return (
    <Drawer
      title={title}
      placement={placement}
      onClose={onClose}
      open={open}
      style={style}
      bodyStyle={bodyStyle}
      closeIcon={closeIcon}
    >
      {children}
    </Drawer>
  );
}
