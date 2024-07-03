import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";
import Photo from "../assets/AdminImg.png";
import Newyear from "../assets/NewYear.png";
import Random from "../assets/Random.png";
import axios from "../Api/base";

const SidebarDataGeneral = [
  {
    title: "Dashboard",
    path: "/Admin",
    icon: <HomeIcon />,
  },
  {
    title: "Season",
    path: "/Admin/Season",
    icon: <img src={Newyear} />,
  },
  {
    title: "Lottery",
    path: "/Admin/Method",
    icon: <img src={Random} />,
  },
  {
    title: "Admins",
    path: "/Admin/Admins",
    icon: <FaUserCog />,
  },
];

const SidebarDataAdmin = [
  {
    title: "Dashboard",
    path: "/Admin",
    icon: <HomeIcon />,
  },
  {
    title: "Members",
    path: "/Admin/Members",
    icon: <PersonIcon />,
  },
  {
    title: "Doctors",
    path: "/Admin/Doctors",
    icon: <FaUserDoctor />,
  },
  {
    title: "Lottery",
    path: "/Admin/Lottery",
    icon: <img src={Random} />,
  },
];

const AdminInterface = () => {
  const [isDone, setIsDone] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const response = await axios.get("/lottery/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const done = response.data.done;
        const all = response.data.all;
        setIsAll(all);
        setIsDone(done);
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };
    check();
  }, [clicked]);
  console.log("isDone is ", isDone);
  console.log("isAll is ", isAll);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const lastPathSegment = location.pathname.split("/").pop(); // Get the last segment of the pathname

    if (lastPathSegment === "Admin") {
      setSelectedItem("Dashboard");
    } else if (lastPathSegment === "Method") {
      setSelectedItem("Lottery");
    } else if (
      lastPathSegment === "drawtype" ||
      lastPathSegment === "grouping" ||
      lastPathSegment === "DrawType" ||
      lastPathSegment === "Grouping" ||
      lastPathSegment === "Winners" ||
      lastPathSegment === "winners"
    ) {
      setSelectedItem("Lottery");
    } else {
      setSelectedItem(lastPathSegment);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setClicked(!clicked);

    setSelectedItem(item.title);
    console.log("item tile is ", item.title);
    if (item.title === "Lottery" && role === "Admin") {
      if (isDone === false && isAll === true) {
        navigate("/Admin/DrawType");
      } else if (isDone === true && isAll === false) {
        navigate("/Admin/Grouping");
      } else if (isDone === true && isAll === true) {
        navigate("/Admin/Winners");
      }
    } else {
      navigate(item.path);
    }
    console.log("second effect is done");
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
            src={Photo}
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
          {role == "GeneralAdmin" && (
            <ul className="Sidebar-List">
              {SidebarDataGeneral.map((item, index) => {
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
          )}
          {role == "Admin" && (
            <ul className="Sidebar-List">
              {SidebarDataAdmin.map((item, index) => {
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
          )}
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

export default AdminInterface;
