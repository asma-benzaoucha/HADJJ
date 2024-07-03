import { useNavigate } from "react-router-dom";
import { Stack, Box, Typography } from "@mui/material";
import Footer from "./Footer";
import Logo from "../../assets/Logo.png";
import Image from "../../assets/aboutUs.svg";
import Quoets from "../../assets/Quotes.png";
import { useRef } from "react";

const AboutUs = () => {
  const navigate = useNavigate();
  const contentFotterRef = useRef(null);

  const handleScrollToContentFotter = () => {
    contentFotterRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Stack
        direction="row"
        sx={{
          height: "90px",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#AB7595",
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
            mr: { sm: "3%", xl: "30%" },
          }}
        >
          <Typography
            onClick={() => navigate("/")}
            sx={{
              fontWeight: "500",
              fontSize: { xs: "14px", sm: "22px" },
              cursor: "pointer",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Home
          </Typography>

          <Typography
            sx={{
              fontWeight: "500",
              fontSize: { xs: "14px", sm: "22px" },
              color: "white",
              cursor: "pointer",
            }}
          >
            About us
          </Typography>

          <Typography
            onClick={handleScrollToContentFotter}
            sx={{
              fontWeight: "500",
              fontSize: { xs: "14px", sm: "22px" },
              color: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
            }}
          >
            Contact
          </Typography>
        </Stack>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          position: "relative",
        }}
      >
        <img src={Image} style={{ width: "100%" }} />
        <Typography
          sx={{
            position: "absolute",
            color: "white",
            fontWeight: 500,
            fontSize: { sx: "16px", sm: "26px" },
            left: "10%",
            bottom: "10%",
          }}
        >
          Home &gt; About Us
        </Typography>
      </Box>
      <Box
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <img style={{ position: "relative", right: "40%" }} src={Quoets} />
        <Typography
          sx={{
            fontSize: { sx: "18px", sm: "32px", fontWeight: 600 },
            position: "relative",
            right: "30%",
            bottom: "20px",
          }}
        >
          Who are we ?
        </Typography>
        <Box
          sx={{
            border: "2px solid #D6D4D4",
            width: { xs: "90%", sm: "80%", md: "60%" },
            px: { xs: 2, md: 6 },
            py: 2,
            display: "flex",
            justifyContent: "center",
            borderRadius: "15px",
            flexDirection: "column",
            color: "black",
            bgcolor: "rgba(231, 217, 202, 0.3)",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            sx={{ fontWeight: "medium", fontsize: { sx: "14px", sm: "24px" } }}
          >
            <span style={{ fontWeight: "bold" }}>Welcome</span> to our platform
            dedicated to managing all aspects of the ElHadj pilgrimage. We are a
            committed team of professionals who strive to provide a seamless and
            efficient experience for all pilgrims. Our mission is to support and
            guide you through every step of your spiritual journey, ensuring
            that your pilgrimage is as smooth and stress-free as possible.
          </Typography>
          <Typography
            sx={{ fontWeight: "medium", fontsize: { sx: "14px", sm: "24px" } }}
          >
            Our platform offers a comprehensive range of services, including:
          </Typography>
          <Typography
            sx={{
              fontWeight: "medium",
              fontsize: { sx: "14px", sm: "24px" },
              position: "relative",
              left: "12px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#AB7595" }}>
              &#x2022; Registration:
            </span>{" "}
            Easily sign up as a candidate for the pilgrimage through our
            user-friendly online system.
          </Typography>
          <Typography
            sx={{
              fontWeight: "medium",
              fontsize: { sx: "14px", sm: "24px" },
              position: "relative",
              left: "12px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#AB7595" }}>
              &#x2022; Lottery Management:
            </span>{" "}
            Participate in a fair and transparent lottery process for the
            allocation of pilgrimage slots.
          </Typography>
          <Typography
            sx={{
              fontWeight: "medium",
              fontsize: { sx: "14px", sm: "24px" },
              position: "relative",
              left: "12px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#AB7595" }}>
              &#x2022; Medical Check-ups and Fee Payments:
            </span>{" "}
            Schedule and manage your medical examinations, as well as handle all
            necessary fee payments with ease.
          </Typography>
          <Typography
            sx={{
              fontWeight: "medium",
              fontsize: { sx: "14px", sm: "24px" },
              position: "relative",
              left: "12px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#AB7595" }}>
              &#x2022; Hotel Reservations:
            </span>{" "}
            Book your accommodation in advance, ensuring a comfortable stay
            throughout your pilgrimage.
          </Typography>
          <Typography
            sx={{
              fontWeight: "medium",
              fontsize: { sx: "14px", sm: "24px" },
              position: "relative",
              left: "12px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#AB7595" }}>
              &#x2022; Step-by-Step Guidance:
            </span>{" "}
            Receive detailed orientation and support, guiding you through each
            phase of your pilgrimage.
          </Typography>
          <Typography
            sx={{ fontWeight: "medium", fontsize: { sx: "14px", sm: "24px" } }}
          >
            We are here to ensure that your ElHadj experience is organized,
            efficient, and spiritually fulfilling. Join us, and let us help you
            embark on this important journey with confidence and peace of mind.
          </Typography>
        </Box>
      </Box>
      <div ref={contentFotterRef}>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
