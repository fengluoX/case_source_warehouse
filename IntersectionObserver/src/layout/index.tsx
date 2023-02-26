import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode): MenuItem {
  return {
    key: label,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [getItem("basic"), getItem("basics")];

const App: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();

  const handleClick: MenuProps["onClick"] = (info) => {
    navigate(info.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={[items[0]?.key as string]}
          mode="inline"
          onClick={handleClick}
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>{children}</Layout>
    </Layout>
  );
};

export default App;
