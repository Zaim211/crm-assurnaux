import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserTie,
  faCaretLeft,
  faUserTag,
  faThLarge,
  faSignOutAlt,
  faFileContract,
  faChartBar,
  faFilePdf,
  faCalendarAlt,
  faCog,
  faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Divider, Avatar } from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { UserContext } from "../UserContext";
import { ToggleContext } from "./store/ToggleContext";
import logo from "../assets/logo.jpeg";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideBar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : "";
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(UserContext);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const { collapsed, onClickHandler } = useContext(ToggleContext);

  const showProfile = () => setProfileVisible(true);

  const Logout = async () => {
    await axios.post("/logout");
    setToken(null);
    navigate("/SignIn");
  };
  const handleSettingsClick = () => {
    navigate("/Paramètres");
  };

  const getInitials = (name) => {
    const names = name?.split(" ");
    const initials = names?.map((n) => n[0]).join("");
    return initials?.toUpperCase();
  };

  const items = [
    {
      key: "/",
      icon: (
        <FontAwesomeIcon
          icon={faHome}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Dashboard",
      role: ["Admin", "Manager"],
    },
    {
      key: "/leads",
      icon: (
        <FontAwesomeIcon
          icon={faUserTie}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Contacts",
      role: ["Admin", "Manager"],
    },
    {
      key: "/list-leads",
      icon: (
        <FontAwesomeIcon
          icon={faUserTie}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Contacts",
      role: "Commercial",
    },
    {
      key: "/import-leads",
      icon: (
        <FontAwesomeIcon
          icon={faFileImport}
          style={{ fontSize: "24px", marginRight: "10px" }}
        />
      ),
      label: "Importer Leads",
      role: ["Admin", "Manager"],
    },
    {
      key: "/produits",
      icon: (
        <FontAwesomeIcon
          icon={faThLarge}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Produits",
      role: ["Admin", "Manager"],
    },
    {
      label: "Affectation Leads",
      role: ["Admin", "Manager"],
      key: "/affect-leads",
      icon: (
        <FontAwesomeIcon
          icon={faUserTag}
          style={{ fontSize: "18px", marginRight: "10px" }}
        />
      ),
    },
    {
      key: "/CalendrierCommerciale", // Update the key if necessary
      icon: (
        <FontAwesomeIcon
          icon={faCalendarAlt}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Calendrier",
      role: ["Commercial", "Admin"],
    },
    {
      key: "",
      icon: (
        <FontAwesomeIcon
          icon={faChartBar}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Suivi des ventes",
      // role: "Admin",
      children: [
        {
          key: "/Devis",
          icon: (
            <FontAwesomeIcon
              icon={faFileContract}
              style={{ fontSize: "23px", marginRight: "10px" }}
            />
          ),
          label: "Devis",
          role: ["Admin", "Commercial"],
        },
        {
          key: "/Contrats",
          icon: (
            <FontAwesomeIcon
              icon={faFileContract}
              style={{ fontSize: "23px", marginRight: "10px" }}
            />
          ),
          label: "Contrat",
          role: ["Admin", "Commercial"],
        },
        {
          key: "/Factures",
          icon: (
            <FontAwesomeIcon
              icon={faFilePdf}
              style={{ fontSize: "23px", marginRight: "10px" }}
            />
          ),
          label: "Factures",
          role: ["Admin"],
        },
      ],
    },
    // {
    //   key: "/campagnes",
    //   icon: (
    //     <FontAwesomeIcon
    //       icon={faChartBar}
    //       style={{ fontSize: "23px", marginRight: "10px" }}
    //     />
    //   ),
    //   label: "Campagnes",
    //   role: "Admin",
    //   children: [
    //     {
    //       key: "/bannières",
    //       label: "Bannières",

    //       icon: (
    //         <FontAwesomeIcon
    //           icon={faPlusCircle}
    //           style={{ fontSize: "23px", marginRight: "10px" }}
    //         />
    //       ),
    //     },
    //     {
    //       key: "/publicités",
    //       label: "Publicités",

    //       icon: (
    //         <FontAwesomeIcon
    //           icon={faBullhorn}
    //           style={{ fontSize: "23px", marginRight: "10px" }}
    //         />
    //       ),
    //     },
    //     {
    //       key: "/magic-sms",
    //       label: "Magic SMS",
    //       icon: (
    //         <FontAwesomeIcon
    //           icon={faList}
    //           style={{ fontSize: "23px", marginRight: "10px" }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    {
      key: "Paramètres",
      icon: (
        <FontAwesomeIcon
          icon={faCog}
          style={{ fontSize: "23px", marginRight: "10px" }}
        />
      ),
      label: "Paramètres",
      role: "Admin",
      onClick: handleSettingsClick,
    },
  ];

  // const filteredItems = items.filter((item) => {
  //   if (item.role) {
  //     return decodedToken.role === item.role;
  //   }
  //   return true;
  // });
  // const filteredItems = items.filter((item) => {
  //   if (item.role) {
  //     // Check if the user's role matches the item's role(s)
  //     return Array.isArray(item.role)
  //       ? item.role.includes(decodedToken.role)
  //       : item.role === decodedToken.role;
  //   }
  //   return true;
  // });
  const hasAccess = (roleSetting, userRole) => {
    if (!roleSetting) return true;
    return Array.isArray(roleSetting)
      ? roleSetting.includes(userRole)
      : roleSetting === userRole;
  };
  const filteredItems = items
    .map((item) => {
      // Admin sees everything
      // if (decodedToken.role === "Admin") return item;
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          hasAccess(child.role, decodedToken.role)
        );

        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }

        return null; // No visible children, hide the item
      }

      return hasAccess(item.role, decodedToken.role) ? item : null;

      // For others (e.g., Commercial)
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          hasAccess(child.role, decodedToken.role)
        );

        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }

        return null; // no visible children, hide this item
      }

      return hasAccess(item.role, decodedToken.role) ? item : null;
    })
    .filter(Boolean);

  const toggleSidebar = () => {
    if (!decodedToken) {
      // Set sidebar to collapsed if token is missing (not logged in)
      onClickHandler(true);
    } else {
      // Set sidebar to expanded if token exists
      onClickHandler(false);
    }
  };

  useEffect(() => {
    toggleSidebar();
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="bg-white w-full flex flex-col"
      width={240}
    >
      <div
        className="absolute top-4 right-0 cursor-pointer text-purple-900 text-4xl"
        onClick={onClickHandler}
      >
        <FontAwesomeIcon icon={faCaretLeft} />
      </div>

      {/* Profile Section - Always Visible Avatar */}
      <div
        className={`flex items-center space-x-2 px-7 py-4 ${
          collapsed ? "justify-start pl-1" : ""
        }`}
      >
        <Avatar
          src={profileImage}
          className="bg-purple-900 text-white text-lg rounded-md font-bold cursor-pointer hover:shadow-lg transition-all duration-300"
          size={40}
        >
          {!profileImage &&
            (decodedToken ? getInitials(decodedToken.name) : <UserOutlined />)}
        </Avatar>
        {!collapsed && (
          <div
            className="text-gray-800 text-md font-medium cursor-pointer hover:text-blue-600"
            onClick={showProfile}
          >
            <div>{decodedToken?.name}</div>
            <div className="text-sm text-gray-500">{decodedToken?.role}</div>
          </div>
        )}
      </div>

      {/* Sidebar Menu - Main Items */}
      <Menu
        className="font-bold text-gray-600 mt-2 w-full flex-grow"
        theme="white"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
      >
        {filteredItems.map((item) =>
          item.children ? (
            <SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map((child) => (
                <Menu.Item
                  key={child.key}
                  icon={child.icon}
                  className={
                    isActive(child.key)
                      ? "bg-white text-gray-600"
                      : "hover:bg-purple-900 hover:text-white"
                  }
                >
                  {child.label}
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className={
                isActive(item.key)
                  ? "bg-white text-gray-600"
                  : "hover:bg-purple-900 hover:text-white"
              }
            >
              {item.label}
            </Menu.Item>
          )
        )}
      </Menu>

      <Divider className="h-[2px]" style={{ backgroundColor: "#D1D5DB" }} />

      {/* Help, Settings, and Logout Section */}
      <div className="mt-auto">
        <Menu
          className="font-bold bg-white text-gray-600"
          mode="inline"
          selectedKeys={[location.pathname]}
          theme="white"
        >
          {/* <Menu.Item
            key="settings"
            icon={<FontAwesomeIcon icon={faCog} style={{ fontSize: "23px" }} />}
            onClick={handleSettingsClick}
          >
            {"Settings"}
          </Menu.Item> */}

          <Menu.Item
            key="logout"
            icon={
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{ fontSize: "23px" }}
              />
            }
            onClick={Logout}
          >
            {"Se déconnecter"}
          </Menu.Item>
        </Menu>
        <div className="flex justify-start mt-2 py-4 ml-6 ">
    <img src={logo} alt="Logo Bottom" className={`${collapsed ? "w-8" : "w-20"} transition-all rounded-full duration-300`} />
  </div>
      </div>
    </Sider>
  );
};

export default SideBar;
