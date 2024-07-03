import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PropTypes from "prop-types";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { TextField } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import axios from "../../Api/base";

const regex = /^[0-9]+$/;

const UserValidation = ({ onClose, user }) => {
  console.log(localStorage.getItem("wilaya"));
  const [description, setDescription] = useState("");
  const [openDescription, setOpenDescription] = useState(false);
  const [participationNumber, setParticipationNumber] = useState(0);
  const [validParticipationNumber, setValidParticipationNumber] =
    useState(false);
  const [participateNumFocus, setParticipateNumFocus] = useState(false);

  useEffect(() => {
    setValidParticipationNumber(regex.test(participationNumber));
  }, [participationNumber]);

  UserValidation.propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  console.log(user);

  const handleDownloadPDF = (user) => {
    // Assuming user.file contains the path or URL to the PDF file
    const decodedData = atob(user.file);

    const byteArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      byteArray[i] = decodedData.charCodeAt(i);
    }

    // Create a Blob from the byte array
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.pdf"; // Set the filename for the downloaded file
    link.target = "_blank"; // Open in new tab

    // Trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  };

  const handleRefuse = () => {
    setOpenDescription(true);
  };
  const handleAccept = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (participationNumber) {
      setParticipationNumber(parseInt(participationNumber));
    }
    console.log(participationNumber);
    try {
      const response = await axios.post(
        "/profile/decision/",
        {
          is_accepted: true,
          nin: user.nin,
          inscription_count: parseInt(participationNumber),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Request failed : Invalid cardenalities");
    }
  };
  const handleMotif = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        "/profile/decision/",
        {
          is_accepted: false,
          nin: user.nin,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        onClose();
        setOpenDescription(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Request failed ");
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const buttonStyle = {
    height: "46px",
    width: "35%",
    borderRadius: 30,
    backgroundColor: isHovered ? "#AA9880" : "#E7D9CA",
    color: "#000000",
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <>
      {!openDescription && (
        <Box
          sx={{
            position: "absolute",
            transform: "translate(-50%,-50%)",
            left: "50%",
            top: "50%",
            width: {
              xs: "95%",
              sm: "500px",
              md: user.gender === "Female" ? "900px" : "500px",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            p: { xs: 1, sm: 2 },
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 1)",
            maxHeight: "95%",
          }}
        >
          <h5
            style={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: "30px",
              height: 51,
            }}
          >
            Validation
          </h5>

          <CloseIcon
            onClick={onClose}
            sx={{
              position: "absolute",
              top: "24px",
              right: "24px",
              cursor: "pointer",
              ":hover": { color: "red" },
            }}
          />
          {user.gender === "Male" ? (
            <p style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.5)" }}>
              Please check user images to validate the information
            </p>
          ) : (
            <p style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.5)" }}>
              Please check user & companion images to validate information
            </p>
          )}

          <Box
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                p: 2,
                width: {
                  xs: "95%",
                  sm: "420px",
                },
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: { xs: "100%", sm: "290px" },
              }}
            >
              <Stack
                direction={"column"}
                spacing={0.5}
                sx={{
                  width: "50%",
                  height: "260px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {user?.gender === "Female" && (
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "15px",
                      position: "relative",
                      bottom: "10px",
                      textDecoration: "underline",
                    }}
                  >
                    User :
                  </span>
                )}
                <span style={{ fontWeight: 500, fontSize: "15px" }}>
                  First name:
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {user.first_name}
                </span>
                <span style={{ fontWeight: 500, fontSize: "15px" }}>
                  Last name:
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {user.last_name}
                </span>
                <span style={{ fontWeight: 500, fontSize: "15px" }}>
                  Wilaya
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {localStorage.getItem("wilaya")}
                </span>
                <span style={{ fontWeight: 500, fontSize: "15px" }}>
                  Municipal
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {user.municipal}
                </span>
              </Stack>
              <Stack
                direction={"column"}
                spacing={1}
                sx={{
                  width: "50%",
                  height: "260px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontWeight: 500, fontSize: "15px" }}>
                  Birth date:
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {user.contact}
                </span>
                <span style={{ fontWeight: 500, fontSize: "15px" }}>NIN:</span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {user.nin}
                </span>
                <span style={{ fontWeight: 500, fontSize: "13px" }}>
                  Date of passport&apos;s expiration:
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#D01717",
                  }}
                >
                  {user.nin}
                </span>
                <form className="auth-form Login-form">
                  <div
                    className={
                      !validParticipationNumber &&
                      participationNumber &&
                      !participateNumFocus
                        ? "invalid-input"
                        : "input"
                    }
                    style={{
                      borderRadius: "5px",
                      height: "30px",
                      width: "180px",
                    }}
                  >
                    <ConfirmationNumberIcon
                      fontSize="small"
                      sx={{ color: "rgb(0, 0, 0, 0.7)", ml: "2px" }}
                    />
                    <input
                      type="text"
                      placeholder="Participation Number: "
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      onChange={(e) => setParticipationNumber(e.target.value)}
                      onFocus={() => setParticipateNumFocus(true)}
                      onBlur={() => setParticipateNumFocus(false)}
                    />
                  </div>
                  {!validParticipationNumber &&
                    participationNumber &&
                    !participateNumFocus && (
                      <div className="error-container">
                        <span className="error-msg">Invalid input</span>
                      </div>
                    )}
                </form>
              </Stack>
            </Box>
            {user?.gender === "Female" && (
              <Box
                sx={{
                  p: 2,
                  width: {
                    xs: "95%",
                    sm: "420px",
                  },
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: { xs: "100%", sm: "290px" },
                }}
              >
                <Stack
                  direction={"column"}
                  spacing={0.5}
                  sx={{
                    width: "50%",
                    height: "260px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "15px",
                      position: "relative",
                      bottom: "10px",
                      textDecoration: "underline",
                    }}
                  >
                    Companion :
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "15px" }}>
                    First name:
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {user.companion.first_name}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "15px" }}>
                    Last name:
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {user.companion.last_name}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "15px" }}>
                    Wilaya
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {localStorage.getItem("wilaya")}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "15px" }}>
                    Municipal
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {user.municipal}
                  </span>
                </Stack>
                <Stack
                  direction={"column"}
                  spacing={1}
                  sx={{
                    width: "50%",
                    height: "260px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: "15px" }}>
                    Birth date:
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {user.companion.birth_date}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "15px" }}>
                    NIN:
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {user.companion.nin}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: "13px" }}>
                    Date of passport&apos;s expiration:
                  </span>
                  <span
                    style={{
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#D01717",
                    }}
                  >
                    {user.companion.passport_expiration_date}
                  </span>
                </Stack>
              </Box>
            )}
          </Box>
          <div>
            <input
              type="button"
              value={user.file}
              onClick={() => handleDownloadPDF(user)}
              style={{ display: "none" }}
              id="PDFbutton"
            />
            <label style={{ width: "250px" }} htmlFor="PDFbutton">
              <DownloadIcon sx={{ mr: 2, color: "rgb(0, 0, 0, 0.7)" }} />
              See PDF proof images
            </label>
          </div>
          <Stack
            direction={"row"}
            spacing={4}
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={handleAccept}
              className="button"
              style={{
                height: "46px",
                width: "35%",
                borderRadius: 30,
              }}
            >
              Accept
            </button>
            <button
              onClick={handleRefuse}
              className="button"
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Refuse
            </button>
          </Stack>
        </Box>
      )}

      {openDescription && (
        <Box
          sx={{
            position: "absolute",
            transform: "translate(-50%,-50%)",
            left: "50%",
            top: "50%",
            width: {
              xs: "95%",
              sm: "500px",
              md: user.gender === "Female" ? "900px" : "500px",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            p: { xs: 1, sm: 2 },
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 1)",
            maxHeight: "95%",
          }}
        >
          <h5
            style={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: "30px",
              height: 51,
            }}
          >
            Refusal&rsquo;s motif
          </h5>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={handleDescriptionChange}
            sx={{ width: "90%" }}
          />
          <button
            className="button"
            style={{ height: "46px", width: "40%", marginTop: "20px" }}
            onClick={handleMotif}
          >
            Send motif
          </button>

          <ChevronLeftIcon
            fontSize="large"
            onClick={() => {
              setOpenDescription(false);
            }}
            sx={{
              color: "rgb(0, 0, 0, 0.7)",
              position: "absolute",
              top: "24px",
              left: "24px",
              cursor: "pointer",
              ":hover": { color: "#AB7595" },
            }}
          />
        </Box>
      )}
    </>
  );
};

export default UserValidation;
