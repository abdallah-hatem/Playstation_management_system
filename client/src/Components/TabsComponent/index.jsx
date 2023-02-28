import { Tabs } from "antd";

export default function TabsComponent({ items }) {
  return <Tabs defaultActiveKey="1" items={items} />;
}
