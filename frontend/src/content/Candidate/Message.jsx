import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const status = localStorage.getItem("Status");
const process = localStorage.getItem("process");

const renderContent = (status, process) => {
  switch (true) {
    case process == "I" && status == "P":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#000000" }}
          >
            Verification Underway
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            Your request is valuable to us, and we are committed to providing
            accurate and timely information. Our team is diligently working to
            verify the details you&lsquo;ve provided.
          </Typography>
        </Box>
      );
    case process == "I" && status == "R":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#000000" }}
          >
            Another Message for I and R
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            This is a different message for the case where process is I and
            status is R.
          </Typography>
        </Box>
      );
    case process == "L":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#000000" }}
          >
            Unfortunately !
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            We sincerely thank you for participating in the Hajj selection
            process this year. Although you were not selected this time, your
            intention and commitment are truly valuable
          </Typography>
        </Box>
      );
    case process == "V":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#000000" }}
          >
            Refused !
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            the doctor has not accepted you after your medical examination for
            the Hajj pilgrimage.For more information check your Email .Best luck
          </Typography>
        </Box>
      );
    case process == "P":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#000000" }}
          >
            Different Process P
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            This is a message for the case where process is P.
          </Typography>
        </Box>
      );
    case process == "R" && status == "C":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#AB7595" }}
          >
            Done !
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            We wish you an accepted Hajj and a spiritually fulfilling
            experience!
          </Typography>
        </Box>
      );
    case process == "R" && status == "R":
      return (
        <Box
          sx={{
            width: "619px",
            height: "251px",
            padding: "25px",
            borderRadius: "20px",
            border: "3px solid #AB7595",
            backgroundColor: "white",
            marginBottom: "90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ fontSize: "30px", height: "65px", color: "#000000" }}
          >
            Different Process R and Status P
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            This is a message for the case where process is R and status is P.
          </Typography>
        </Box>
      );
    default:
      return null;
  }
};

const Message = () => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="Unfortunately-body">
      <button
        onClick={handleLogOut}
        className="button"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          height: "46px",
          width: "140px",
          fontSize: "18px",
          borderRadius: 30,
        }}
      >
        Log Out
      </button>
      {renderContent(status, process)}
    </div>
  );
};

export default Message;
