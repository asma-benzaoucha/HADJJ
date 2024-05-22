import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Gendericon from "../assets/GenderIcon.png";
import axios from "../Api/base";
import { Link, useNavigate } from "react-router-dom";

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,26}$/;

function Signup() {
  const [submitted, setSubmitted] = useState(false);
  //First name states
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  //Last name states
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  //Email states
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  //Password states
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  //Match password states
  const [matchPassword, setMatchPassword] = useState("");
  const [validMatchPassword, setValidMatchPassword] = useState(false);
  const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

  //Gender
  const [gender, setGender] = useState("");
  const [validGender, setValidGender] = useState(false);

  useEffect(() => {
    setValidGender(gender.length >= 1);
  }, [gender]);

  useEffect(() => {
    setValidFirstName(nameRegex.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(nameRegex.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidEmail(emailPattern.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(passwordPattern.test(password));
  }, [password]);

  useEffect(() => {
    setValidMatchPassword(password === matchPassword);
  }, [password, matchPassword]);

  const navigate = useNavigate();

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender === "male" ? "M" : "F");
  };

  const handleSubmit = async (e) => {
    setSubmitted(true);
    console.log("entered");
    e.preventDefault();
    if (
      validFirstName &&
      validLastName &&
      validEmail &&
      validPassword &&
      validMatchPassword &&
      gender
    ) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        gender: gender,
      };
      console.log(data);

      try {
        const response = await axios.post(
          "/auth/sign-up",
          JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            gender,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        console.log("here");

        if (response.status === 201 && response.data.success) {
          // Success, navigate to the login page
          navigate("/login");
        }
      } catch (error) {
        // Handle errors here
        console.error("Error:", error);
      }
    } else {
      alert("Please fill all the fields with valid entry");
    }
  };

  return (
    <div className="auth-body">
      <Box
        sx={{
          position: "absolute",
          transform: "translate(-50%,-50%)",
          left: "50%",
          top: "50%",
          maxHeight: "100vh",
          width: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          //mt: 10,
          p: 5,
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
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
          Sign up
        </h5>
        <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>Create new account</p>

        <Box
          sx={{
            p: 2,
            width: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <form className="auth-form Login-form" onSubmit={handleSubmit}>
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
                !validEmail && email && !emailFocus ? "invalid-input" : "input"
              }
            >
              <EmailOutlinedIcon fontSize="medium" className="icon" />
              <input
                type="text"
                placeholder="Email"
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
            <div
              className={
                !validPassword && password && !passwordFocus
                  ? "invalid-input"
                  : "input"
              }
            >
              <LockOutlinedIcon className="icon" />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                required
              />
            </div>
            {!validPassword && password && !passwordFocus && (
              <div className="error-container">
                <span className="error-msg">invalid password </span>
              </div>
            )}

            <div
              className={
                !validMatchPassword && matchPassword && !matchPasswordFocus
                  ? "invalid-input"
                  : "input"
              }
            >
              <LockOutlinedIcon className="icon" />
              <input
                type="Password"
                placeholder="Repeat Password"
                onChange={(e) => setMatchPassword(e.target.value)}
                onFocus={() => setMatchPasswordFocus(true)}
                onBlur={() => setMatchPasswordFocus(false)}
                required
              />
            </div>
            {!validMatchPassword && matchPassword && !matchPasswordFocus && (
              <div className="error-container">
                <span className="error-msg">password do not match</span>
              </div>
            )}

            <div
              className={!validGender && submitted ? "invalid-input" : "input"}
            >
              <img src={Gendericon} fontSize="medium" className="icon" />
              <select
                required
                onChange={handleGenderChange}
                style={{ width: "85%" }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="sub-but">
              <button className="button" onClick={handleSubmit}>
                Register
              </button>
            </div>
          </form>
          <div className="Login-to-Signup">
            <p>Already have an account? </p>
            <Link to="/Login">Login</Link>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Signup;
