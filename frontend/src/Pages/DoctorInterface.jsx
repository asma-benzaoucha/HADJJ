import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
//import { SidebarData } from "./SidebarData";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import Photo from "../assets/AdminImg.png";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = [
  {
    title: "Dashboard",
    path: "/Doctor",
    icon: <HomeIcon />,
  },
  {
    title: "Patients",
    path: "/Doctor/Patients",
    icon: <HomeIcon />,
  },

  {
    title: "Log Out",
    path: "/",
    icon: <LogoutIcon />,
  },
];

const DoctorInterface = () => {
  const profile_pic = localStorage.getItem("profile_pic");
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const name = localStorage.getItem("name");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastPathSegment = location.pathname.split("/").pop(); // Get the last segment of the pathname

    if (lastPathSegment === "Doctor") {
      setSelectedItem("Dashboard");
    } else {
      setSelectedItem(lastPathSegment);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setSelectedItem(item.title);
    console.log("item tile is ", item.title);
    if (item.title === "Log Out") {
      localStorage.clear();
    }
    navigate(item.path);
  };

  return (
    //--------------------------------------------SIDEBAR------------------------------------//

    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          width: { xs: "100%", md: "300px" },
          borderTopRightRadius: { xs: "0px", md: "20px" },
          borderBottomLeftRadius: { xs: "20px", md: "0px" },
          height: { xs: "200px", md: "100%" },
        }}
      >
        <Box
          sx={{
            height: { xs: "100%", md: "30%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "30%", md: "100%" },
            borderTopRightRadius: { xs: "0px", md: "20px" },
            borderBottomLeftRadius: { xs: "20px", md: "0px" },
            backgroundColor: "#996986",
            borderBottom: "2px solid rgba(0, 0, 0, 0.4)",
          }}
        >
          <Avatar
            src={`data:image/png;base64,${profile_pic}`}
            alt={name}
            sx={{
              width: { xs: "70px", sm: "90px", md: "110px" },
              height: { xs: "70px", sm: "90px", md: "110px" },
            }}
          />
          <div style={{ color: "white", fontWeight: "600", marginTop: "10px" }}>
            {name}
          </div>
        </Box>
        <Box
          sx={{
            paddingTop: "20px",
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            justifyContent: "space-between",
            height: { xs: "100%", md: "70%" },
            background: "#ab7595",
            width: "100%",
          }}
        >
          <ul className="Sidebar-List">
            {Sidebar.map((item, index) => {
              return (
                <li
                  id={selectedItem === item.title ? "active" : ""}
                  className="row"
                  key={index}
                  onClick={() => handleItemClick(item)}
                >
                  <Box
                    sx={{
                      flex: "30%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box
                    sx={{
                      flex: "70%",
                      fontWeight: "600",
                      fontSize: { xs: "14px", md: "21px" },
                    }}
                  >
                    {item.title}
                  </Box>
                </li>
              );
            })}
          </ul>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DoctorInterface;
