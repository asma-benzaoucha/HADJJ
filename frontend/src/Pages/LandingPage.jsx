import { useNavigate } from "react-router-dom";
import { Stack, Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import Content1 from "../content/LandingPage/Content1";
import Content2 from "../content/LandingPage/Content2";
import Content3 from "../content/LandingPage/Content3";
import Content4 from "../content/LandingPage/Content4";
import Content5 from "../content/LandingPage/Content5";
import Content6 from "../content/LandingPage/Content6";
import Footer from "../content/LandingPage/Footer";
import Logo from "../assets/Logo.png";
import { useEffect, useState, useRef } from "react";

const LandingPage = () => {
  const content1Ref = useRef(null);
  const contentFotterRef = useRef(null);
  const content6Ref = useRef(null);
  const handleScrollToContent1 = () => {
    content1Ref.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToContentFotter = () => {
    contentFotterRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToContent6 = () => {
    content6Ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();
  //if access exits and status is defined and =! null
  const [clicked, setClicked] = useState(false);
  const [access, setAccess] = useState(localStorage.getItem("accessToken"));
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  console.log(role);
  const status = localStorage.getItem("Status");
  console.log("here status", status);
  const process = localStorage.getItem("process");
  console.log("here process", process);

  useEffect(() => {
    if (role === "Candidate" && (status === "C" || process === "R")) {
      navigate("/home/message");
    }
    if (role === "Candidate" && process === "L") {
      navigate("/home/draw");
    }
  }, []);

  useEffect(() => {
    if (role === "GeneralAdmin" || role === "Admin") {
      navigate("/Admin");
    }
  }, []);

  return (
    <>
      <div onClick={() => setClicked(false)} className="Landing-page-Head">
        <Stack
          direction="row"
          sx={{
            height: "90px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(231, 217, 202, 0.2)",
            py: 3,
            px: { xs: 0, md: 6 },
          }}
        >
          <Box
            sx={{
              width: { xs: "100px", md: "250px" },
            }}
          >
            <img style={{ width: "100%" }} src={Logo} />
          </Box>
          <Stack
            direction={"row"}
            sx={{
              gap: { xs: "15px", sm: "25px", md: "50px" },
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: { xs: "18px", sm: "22px" },
                color: "white",
                cursor: "pointer",
              }}
            >
              Home
            </Typography>
            <Typography
              onClick={handleScrollToContent1}
              sx={{
                fontWeight: "500",
                fontSize: { xs: "18px", sm: "22px" },
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
              }}
            >
              Features
            </Typography>
            <Typography
              onClick={() => navigate("/AboutUs")}
              sx={{
                fontWeight: "500",
                fontSize: { xs: "18px", sm: "22px" },
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
              }}
            >
              About us
            </Typography>
            <Typography
              onClick={handleScrollToContent6}
              sx={{
                fontWeight: "500",
                fontSize: { xs: "18px", sm: "22px" },
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
              }}
            >
              FQs
            </Typography>
            <Typography
              onClick={handleScrollToContentFotter}
              sx={{
                fontWeight: "500",
                fontSize: { xs: "18px", sm: "22px" },
                color: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
              }}
            >
              Contact
            </Typography>
          </Stack>
          {!access && (
            <button
              className="button"
              style={{ width: "120px", height: "50px", borderRadius: "15px" }}
              onClick={() => navigate("/Login")}
            >
              login
            </button>
          )}
          {access && (
            <Avatar
              onClick={(e) => {
                e.stopPropagation();
                setClicked(true);
              }}
              sx={{
                position: "relative",
                height: "70px",
                width: "70px",
                backgroundColor: "#AB7595",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {name && name.charAt(0)}
            </Avatar>
          )}
        </Stack>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: { xs: "38px", md: "55px" },
            color: "white",
          }}
        >
          Hajj with Ease <br />
          Faith with Peace
        </Typography>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: { xs: "18px", md: "24px" },
            color: "white",
            ml: "15%",
            mr: "15%",
          }}
        >
          Welcome to our portal, where every visitor is invited to explore the
          magnificence of Hajj with comprehensive support to enable you to fully
          immerse yourself in this unforgettable experience.
        </Typography>
        {!access && (
          <button
            className="button"
            onClick={() => navigate("/Register")}
            style={{
              width: "180px",
              height: "60px",
              borderRadius: "15px",
              marginBottom: "260px",
            }}
          >
            Get started
          </button>
        )}
        {access && (
          <button
            className="button"
            onClick={() => navigate("/Participate")}
            style={{
              width: "180px",
              height: "60px",
              borderRadius: "15px",
              marginBottom: "260px",
            }}
          >
            Register
          </button>
        )}
        {clicked && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{
              position: "absolute",
              width: { xs: "150px", md: "250px" },
              height: { xs: "100px", md: "170px" },
              mt: "90px",
              right: { xs: "40px", md: "80px" },
              bgcolor: "#E7D9CA",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -10,
                right: 10,
                width: "0",
                height: "0",
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderBottom: "10px solid #E7D9CA",
                zIndex: 1000,
              }}
            />

            <Box
              sx={{
                height: "70%",
                width: "95%",
                borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
                p: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  mb: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "90%",
                }}
              >
                <Avatar
                  sx={{
                    height: { xs: "35px", md: "50px" },
                    width: { xs: "35px", md: "50px" },
                    backgroundColor: "#AB7595",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  {name && name.charAt(0)}
                </Avatar>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    my: 1,
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: { xs: "10px", md: "14px" },
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "500",
                      fontSize: { xs: "10px", md: "14px" },
                    }}
                  >
                    {email}
                  </Typography>
                  <button
                    className="button"
                    style={{
                      borderRadius: "5px",
                      width: "80%",
                      height: "40%",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: "500",
                        fontSize: { xs: "12px", md: "16px" },
                      }}
                    >
                      Profile
                    </Typography>
                  </button>
                </Box>
              </Stack>
            </Box>
            <Box
              sx={{
                height: "30%",
                width: "95%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                onClick={() => {
                  localStorage.clear();
                  setAccess(null);
                  setClicked(false);
                }}
                direction="row"
                spacing={1}
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  alignItems: "center",
                  mb: 1,
                  fontWeight: { xs: "400", md: "500" },
                  fontSize: { xs: "14px", md: "18px" },
                  ":hover": { color: "red", cursor: "pointer" },
                }}
              >
                <LogoutIcon />
                <div>logout</div>
              </Stack>
            </Box>
          </Box>
        )}
      </div>
      <div ref={content1Ref}>
        <Content1 />
      </div>
      <Content2 />
      <Content3 />
      <Content4 />
      <Content5 />
      <div ref={content6Ref}>
        <Content6 />
      </div>
      <div ref={contentFotterRef}>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
