import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayementImg from "../../assets/PayementImg.svg";
import axios from "../../Api/base";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import Alert from "@mui/material/Alert";

const Payement = () => {
  //alert status
  const [alertsuc, setAlertSuc] = useState(false);
  const [alertErr, setAlertErr] = useState(false);
  const [alertInfo, setAlertInfo] = useState(false);
  const [err, setErr] = useState("");

  const hideAlert = (nav) => {
    setTimeout(() => {
      setAlertSuc(false);
      setAlertErr(false);
      setAlertInfo(false);

      if (nav) {
        navigate("/Home/Reservation");
      }
    }, 3000);
  };
  //File
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const access = localStorage.getItem("accessToken");

    if (selectedFile) {
      try {
        const response = await axios.post(
          "/payment/validate/",
          {
            file: selectedFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        console.log(response);

        if (
          response.status === 201 ||
          response.data.success ||
          response.status === 200
        ) {
          setAlertSuc(true);
          setErr("Payment validated successfully");
          hideAlert(true);
          navigate("/Home/Reservation");
        }
      } catch (error) {
        setAlertErr(true);
        setErr(
          "Inalid credentials, please upload the file sent to you by email"
        );
        hideAlert(false);
        console.error("Error:", error);
      }
    } else {
      setAlertInfo(true);
      setErr("Please upload a file");
      hideAlert(false);
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {alertErr && (
        <Alert
          sx={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translate(-50%, 0)",
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
          severity="error"
        >
          {err}
        </Alert>
      )}
      {alertsuc && (
        <Alert
          sx={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translate(-50%, 0)",
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
          severity="success"
        >
          {err}
        </Alert>
      )}

      {alertInfo && (
        <Alert
          sx={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translate(-50%, 0)",
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
          severity="info"
        >
          {err}
        </Alert>
      )}
      <Box
        style={{
          height: "120px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginLeft: "20px" }}>Welcome Back</h1>
        <div style={{ flex: 1 }} />
        <button
          onClick={handleLogOut}
          className="button"
          style={{
            marginRight: "40px",
            height: "46px",
            width: "140px",
            borderRadius: 30,
          }}
        >
          Log Out
        </button>
      </Box>
      <Box
        sx={{
          height: { xs: "1000px", md: "80%" },

          width: "100%",
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
          margin: "auto",
          px: { xs: 2, sm: 4, md: 8, lg: 12 },

          gap: { xs: "20px", sm: "40px", md: "80px" },
        }}
      >
        <Box
          sx={{
            width: { xs: "80%", sm: "65%", md: "37%" },
            height: "50%",
            border: "1px solid #ab7595",
            boxShadow: "5px 5px 4px #ab7595",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            py: 3,
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 600 }}>
            Confirmation
          </span>
          <span
            style={{
              color: "rgba(0, 0, 0, 0.8)",
              fontSize: "12px",
              fontWeight: "light",
            }}
          >
            We sent you an Email. Please verify your transaction number
          </span>
          {/* ----------------inputs---------------------*/}
          <form
            className="auth-form Login-form"
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: "80%" }}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required
                id="PDFbutton"
                style={{ width: "100px" }}
              />
              <label htmlFor="PDFbutton" style={{ width: "100%" }}>
                <UploadOutlinedIcon
                  sx={{
                    mr: 2,
                    color: selectedFile ? "green" : "rgb(0, 0, 0, 0.5)",
                  }}
                />
                {selectedFile ? "File uploaded" : "Upload receipt (.pdf) "}
              </label>
            </div>
          </form>
          {/* ----------------inputs---------------------*/}

          <button
            className="button"
            onClick={handleSubmit}
            style={{
              width: "60%",
              maxWidth: "300px",
              height: "40px",
            }}
          >
            Validate
          </button>
        </Box>
        <Box
          sx={{
            width: { xs: "90%", md: "40%" },
            height: "75%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
          }}
        >
          <img
            style={{ height: "100%", width: "100%" }}
            src={PayementImg}
            alt="Payement"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Payement;
