import useAuth from "../Context/useAuth";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Avatar } from "@mui/material";
import Stepper from "../Components/Stepper";
import { useTheme, useMediaQuery } from "@mui/material";
import HorStepper from "../Components/HorStepper";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const name = localStorage.getItem("name");
  const phase = localStorage.getItem("process");
  let step = 1;
  const status = localStorage.getItem("Status");
  console.log("phase is ", phase, "status is ", status);

  if (phase === "I") {
    step = 1;
  } else if (phase === "L") {
    step = 2;
  } else if (phase === "V") {
    step = 3;
  } else if (phase === "P") {
    step = 4;
  } else if (phase === "R" && status === "P") {
    step = 5;
  } else if (phase === "R" && status === "C") {
    step = 6;
  }

  useEffect(() => {
    const routes = {
      R: { R: "Message", P: "Reservation", C: "Message" },
      L: { P: "Draw" },
      V: { P: "VisitMed" },
      P: { P: "payement" },
      I: { P: "Message" },
      null: { null: "/" },
    };

    if (status && phase && routes[phase]?.[status]) {
      navigate(routes[phase][status]);
    } else if (status === "R") {
      navigate("Message");
    }
  }, [status, phase]);

  const handleclick = () => {
    navigate("Draw");
  };

  const theme = useTheme();
  const isXsMd = useMediaQuery(theme.breakpoints.between("xs", "md"));

  return (
    //--------------------------------------------SIDEBAR------------------------------------//

    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          width: { xs: "100%", md: "300px" },
          borderTopRightRadius: { xs: "0px", md: "20px" },
          borderBottomLeftRadius: { xs: "20px", md: "0px" },
          height: { xs: "200px", md: "100vh" },
        }}
      >
        <Box
          sx={{
            height: { xs: "100%", md: "30%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: { xs: "30%", md: "100%" },
            borderTopRightRadius: { xs: "0px", md: "20px" },
            borderBottomLeftRadius: { xs: "20px", md: "0px" },
            backgroundColor: "#996986",
            borderBottom: "2px solid rgba(0, 0, 0, 0.4)",
            py: { xs: 1, md: 2 },
          }}
        >
          <Avatar
            onClick={handleclick}
            src="/broken-image.jpg"
            sx={{
              width: { xs: "11vh", sm: "15vh" },
              height: { xs: "11vh", sm: "15vh" },
            }}
          />
          <div
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {name}
          </div>
          <Box sx={{ mt: 1 }}>
            <button
              style={{
                width: "110px",
                height: "5vh",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "16px",
                border: "none",
                backgroundColor: "#E7D9CA",
                cursor: "pointer",
              }}
            >
              Edit profile
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            position: "relative",
            paddingTop: "20px",
            height: { xs: "100%", md: "70%" },
            background: "rgba(153, 105, 134, 0.95)",
            width: "100%",
            alignContent: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
        >
          {isXsMd ? <HorStepper /> : <Stepper Step={step} />}
        </Box>
      </Box>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;
