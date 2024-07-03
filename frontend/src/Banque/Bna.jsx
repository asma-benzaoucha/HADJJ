import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaIdCard } from "react-icons/fa";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BNAImage from "../assets/BNA-bank.jpg";
import Alert from "@mui/material/Alert";

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ninRegex = /^[0-9]{18}$/; // Assuming NIN consists of 9 digits

function Bna() {
  //alert status
  const [alertsuc, setAlertSuc] = useState(false);
  const [alertErr, setAlertErr] = useState(false);
  const [alertInfo, setAlertInfo] = useState(false);
  const [err, setErr] = useState("");

  const hideAlert = () => {
    setTimeout(() => {
      setAlertSuc(false);
      setAlertErr(false);
      setAlertInfo(false);
    }, 3000);
  };
  const [submitted, setSubmitted] = useState(false);
  // First name states
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  // Last name states
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  // NIN states
  const [nin, setNin] = useState("");
  const [validNin, setValidNin] = useState(false);
  const [ninFocus, setNinFocus] = useState(false);
  // Email states
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  // State states
  const [state, setState] = useState("");
  const [validState, setValidState] = useState(false);

  const [stateOptions, setStateOptions] = useState([]);

  useEffect(() => {
    setValidFirstName(nameRegex.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(nameRegex.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidNin(ninRegex.test(nin));
  }, [nin]);

  useEffect(() => {
    setValidEmail(emailPattern.test(email));
  }, [email]);

  useEffect(() => {
    setValidState(state); // Assuming state is required
  }, [state]);

  const navigate = useNavigate();

  const handleWilaya = (e) => {
    setState(parseInt(e.target.value));
    console.log("State: ", state);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/administrative/wilayas"
        );
        console.log(response.data);

        const fetchedOptions = response.data.map((item) => ({
          value: item.name,
          label: item.id,
        }));

        setStateOptions(fetchedOptions);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      validFirstName &&
      validLastName &&
      validNin &&
      validEmail &&
      validState
    ) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        nin: nin,
        email: email,
        wilaya: state,
      };
      console.log(data);

      try {
        const response = await axios.post(
          "http://localhost:8001/api/transactions/new",
          {
            nin: nin,
            first_name: firstName,
            last_name: lastName,
            email: email,
            wilaya: state,
          }
        );
        console.log(response.data);
        console.log("here");

        if (response.status === 201 && response.data.success) {
          setAlertSuc(true);
          setErr("Transaction successful");
          hideAlert();
        }
      } catch (error) {
        // Handle errors here
        console.error("Error:", error);
        setAlertErr(true);
        setErr("Transaction failed");
        hideAlert();
      }
    } else {
      setAlertInfo(true);
      setErr("Please fill in all fields correctly");
      hideAlert();
    }
  };

  return (
    <Box sx={{}}>
      {alertErr && (
        <Alert
          sx={{
            zIndex: 1000,
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translate(-50%, 0)",
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
          }}
          severity="error"
        >
          {err}
        </Alert>
      )}
      {alertsuc && (
        <Alert
          sx={{
            zIndex: 1000,
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translate(-50%, 0)",
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
          }}
          severity="success"
        >
          {err}
        </Alert>
      )}

      {alertInfo && (
        <Alert
          sx={{
            zIndex: 1000,
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translate(-50%, 0)",
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
          }}
          severity="info"
        >
          {err}
        </Alert>
      )}
      <Box
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          marginLeft: "500px",
          top: "50%",
          maxHeight: "507px",
          width: "525px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "Poppins ",
          // mt: 10,
          p: 5,
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "5px 5px 20px rgba(1, 152, 121, 0.5)",
          borderColor: "rgba(1, 152, 121, 0.5)",
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      >
        <Typography
          style={{
            color: "#000000",
            fontWeight: "bold",
            fontSize: "30px",
            height: "28px",
            width: "223px",
            marginTop: "-10px",
            marginBottom: "35px",
          }}
        >
          Hajj Payement
        </Typography>
        <Typography
          style={{
            width: "415px",
            height: "28px",
            fontWeight: 300,
            fontSize: "16px",
            marginBottom: "20px",
            color: "rgba(0, 0, 0, 0.5)",
            lineHeight: "22px",
          }}
        >
          Enter User information to validate his hajj payement
        </Typography>
        <Box
          sx={{
            p: 2,
            width: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <form className="auth-form BNA-form" onSubmit={handleSubmit}>
            <div className="firstName-lastName">
              <div
                className={
                  !validFirstName && firstName && !firstNameFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <Person2OutlinedIcon fontSize="medium" className="icon" />
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                  required
                />
              </div>

              <div
                className={
                  !validLastName && lastName && !lastNameFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <Person2OutlinedIcon fontSize="medium" className="icon" />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                  required
                />
              </div>
            </div>

            {((!validLastName && lastName && !lastNameFocus) ||
              (!validFirstName && firstName && !firstNameFocus)) && (
              <div className="error-container">
                <span className="error-msg">Please enter a valid name</span>
              </div>
            )}

            <div
              className={
                !validNin && nin && !ninFocus ? "invalid-input" : "input"
              }
            >
              <FaIdCard fontSize="large" className="icon" />
              <input
                type="text"
                placeholder="NIN"
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                onFocus={() => setNinFocus(true)}
                onBlur={() => setNinFocus(false)}
                required
              />
            </div>
            {!validNin && nin && !ninFocus && (
              <div className="error-container">
                <span className="error-msg">Please enter a valid NIN</span>
              </div>
            )}

            <div
              className={
                !validEmail && email && !emailFocus ? "invalid-input" : "input"
              }
            >
              <EmailOutlinedIcon fontSize="medium" className="icon" />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
              />
            </div>
            {!validEmail && email && !emailFocus && (
              <div className="error-container">
                <span className="error-msg">Please enter a valid Email</span>
              </div>
            )}

            {/* --------------- State selection ------------- */}

            <div
              style={{ position: "relative", width: "350px" }}
              className={!validState && state ? "invalid-input" : "input"}
            >
              <LocationOnIcon className="icon" />
              <select
                required
                className="custom-select"
                onChange={handleWilaya}
              >
                <option value="">Select Wilaya</option>
                {stateOptions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            {!validState && submitted && (
              <div className="error-container">
                <span className="error-msg">Please enter your State</span>
              </div>
            )}

            <div className="sub-but">
              <button
                className="button"
                onClick={handleSubmit}
                style={{
                  width: "400px",
                  height: "52px",
                  top: "746px",
                  left: "346px",
                  padding: "14px 165px",
                  backgroundColor: "#019879",
                  borderRadius: "20px",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Validate
              </button>
            </div>
          </form>
        </Box>
        <Box
          sx={{
            width: "550px",
            height: "400px",
            marginLeft: "1248px",
            marginTop: "-400px",
            marginBottom: "auto",
          }}
        >
          <img src={BNAImage} />
        </Box>
      </Box>
    </Box>
  );
}

export default Bna;
