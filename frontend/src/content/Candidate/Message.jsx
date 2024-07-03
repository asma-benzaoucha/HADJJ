import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../Api/base";

const today = new Date();
const formattedDate = today.toISOString().split("T")[0];

const renderContent = (status, process, deadline) => {
  const navigate = useNavigate();
  const handleModify = () => {
    localStorage.setItem("modify", true);
    navigate("/participate");
  };
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
            {formattedDate > deadline
              ? "Deadline Passed"
              : " Incorrect Data Detected"}
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            {formattedDate > deadline ? (
              "We're sorry, but the deadline for updating information has passed. Unfortunately, you can no longer make changes to your data."
            ) : (
              <span>
                We&apos;ve detected discrepancies in the information provided.
                Please review and update your details accordingly before the
                deadline (<span style={{ color: "red" }}>{deadline}</span>).
                Your cooperation is appreciated.
              </span>
            )}
          </Typography>

          {formattedDate >= deadline ? null : (
            <button
              onClick={handleModify}
              className="button"
              style={{
                width: "150px",
                height: "50px",
                borderRadius: "15px",
                marginTop: "20px",
              }}
            >
              Modify
            </button>
          )}
        </Box>
      );
    case process == "L" && status == "R":
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
    case process == "L" && status == "I":
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
            You are in the Reserve List
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            We sincerely thank you for participating in the Hajj selection
            process this year. You are currently on the reserve list. You may
            start your Hajj procedure at any time if other participants are
            rejected or do not complete their registration processes
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
            Deadline Passed
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            We&lsquo;re sorry, but the deadline for payement has passed,
            Unfortunately, you can no longer eligable.
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
            sx={{
              fontSize: "19px",
              textAlign: "center",
              color: "#000000",
              fontWeight: 600,
            }}
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
            Deadline Passed
          </Typography>
          <Typography
            sx={{ fontSize: "19px", textAlign: "center", color: "#000000" }}
          >
            We&lsquo;re sorry, but the deadline for reservation has passed, you
            can no longer make a reservation.
          </Typography>
        </Box>
      );
    default:
      return null;
  }
};

const Message = () => {
  const [status, setStatus] = useState("");
  const [process, setProcess] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get("/pilgrimage/current");
        console.log(response);
        if (response.status === 200) {
          //setDeadline(response.data.inscription_deadline);
          setDeadline("2025-01-01");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const response = axios
      .get("/auth/status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("Status", response?.data?.status);
        localStorage.setItem("process", response?.data?.process);
        setStatus(response?.data?.status);
        setProcess(response?.data?.process);
      });

    console.log(response.data);
  }, []);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(!refresh);
  }, [process, status]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        left: "345px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
      {renderContent(status, process, deadline)}
    </div>
  );
};

export default Message;
