import React from "react";
import CustomMenu from "../CustomMenu/index";

const menus = [
  {
    title: "部门管理",
    icon: "user",
    key: "/home/structure/department",
  },
  {
    title: "角色管理",
    icon: "user",
    key: "/home/structure/role",
  },
  {
    title: "用户管理",
    icon: "user",
    key: "/home/structure/user",
  },
  {
    title: "审批管理",
    icon: "user",
    key: "/home/structure/approval",
  },
];

class SiderNav extends React.Component {
  render() {
    return (
      <div style={{ height: "100vh", overflowY: "scroll" }}>
        <div style={styles.logo}>问题反馈管理系统</div>
        <CustomMenu menus={menus} />
      </div>
    );
  }
}

const styles = {
  logo: {
    height: "32px",
    background: "rgba(255, 255, 255, .2)",
    margin: "16px",
    lineHeight: "32px",
    textAlign: "center",
    color: "#fff",
  },
};

export default SiderNav;
