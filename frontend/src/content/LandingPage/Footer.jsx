import { Box, Stack, Typography, Link } from "@mui/material";
import { Facebook, Instagram, X, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  const access = localStorage.getItem("accessToken");
  return (
    <Box
      sx={{
        backgroundColor: "#E7D9CA",
        py: 4,
        px: { xs: 2, md: 6 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Box>
        <div className="BawabatElHajj"></div>

        <Typography variant="body2" sx={{ color: "#AB7595", mb: 1 }}>
          Contact us:
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          info@nom_website.com
        </Typography>
        <Stack direction="row" spacing={2}>
          <Facebook
            fontSize="medium"
            sx={{ color: "#AB7595" }}
            className="icon "
          />

          <Instagram
            fontSize="medium"
            sx={{ color: "#AB7595" }}
            className="icon "
          />
          <X fontSize="medium" sx={{ color: "#AB7595" }} className="icon " />
          <LinkedIn
            fontSize="medium"
            sx={{ color: "#AB7595" }}
            className="icon "
          />
        </Stack>
      </Box>
      <Box
        sx={{ textAlign: { xs: "center", md: "left" }, mt: { xs: 4, md: 0 } }}
      >
        <Stack direction="column" spacing={1}>
          <Link
            href="#"
            underline="none"
            sx={{ color: "black", fontSize: "16px" }}
          >
            features
          </Link>
          <Link
            href="/aboutus"
            underline="none"
            sx={{ color: "black", fontSize: "16px" }}
          >
            about us
          </Link>
          {!access && (
            <Link
              href="/Register"
              underline="none"
              sx={{ color: "black", fontSize: "16px" }}
            >
              Register now
            </Link>
          )}
          {access && (
            <Link
              href="/participate"
              underline="none"
              sx={{ color: "black", fontSize: "16px" }}
            >
              Participate
            </Link>
          )}
        </Stack>
      </Box>
      <Box
        sx={{ textAlign: { xs: "center", md: "left" }, mt: { xs: 4, md: 0 } }}
      >
        <Stack direction="column" spacing={1}>
          <Link
            href="#"
            underline="none"
            sx={{ color: "black", fontSize: "16px" }}
          >
            contact us
          </Link>
          <Link
            href="#"
            underline="none"
            sx={{ color: "black", fontSize: "16px" }}
          >
            FAQs
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
