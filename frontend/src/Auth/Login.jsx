import { useState, useEffect, useContext } from "react";
import { Box, Checkbox, Stack } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AuthContext from "../Context/AuthProvider";
import { Link } from "react-router-dom";
import axios from "../Api/base";
import { useNavigate } from "react-router-dom";

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,26}$/;
const passwordPattern = /^(?=.*\d).{8,26}$/;

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  useEffect(() => {
    setValidEmail(emailPattern.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(passwordPattern.test(password) && password.length >= 8);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validEmail && validPassword) {
      const data = { email: email, password: password };
      console.log(data);
      try {
        const response = await axios.post("/auth/log-in", data);
        if (response.status === 200) {
          console.log(response);

          const responseData = response.data;
          const accessToken = responseData?.access;
          const refreshToken = responseData?.refresh;
          const role = responseData?.role;
          const name = responseData?.first_name + " " + responseData?.last_name;
          const gender = responseData?.gender;
          localStorage.setItem("accessToken", responseData?.access);
          localStorage.setItem("refreshToken", responseData?.refresh);
          localStorage.setItem("role", responseData?.role);
          localStorage.setItem("name", name);
          localStorage.setItem("gender", gender);
          localStorage.setItem(
            "Status",
            response?.data?.user_status?.status?.status
          );
          localStorage.setItem(
            "process",
            response?.data?.user_status?.status?.process
          );
          localStorage.setItem(
            "lotteryDate",
            response?.data?.user_status?.phase?.start_date
          );
          localStorage.setItem("email", email);
          setAuth({ name, role, accessToken, refreshToken });
          if (role === "Admin" || role === "GeneralAdmin") {
            navigate("/Admin");
            localStorage.setItem("wilaya", response?.data?.wilaya?.name);
            localStorage.setItem("wilaya_id", response?.data?.wilaya?.id);
          }

          console.log("response", responseData?.user_status?.status?.process);
          if (role === "Candidate") {
            if (responseData?.user_status?.status?.status == null) {
              console.log("in login navigated to /");
              navigate("/");
            } else if (
              responseData?.user_status?.status?.status &&
              responseData?.user_status?.status?.process
            ) {
              navigate("/Home");
            }
          }
          if (role === "MedicalAdmin") {
            navigate("/Doctor");
            localStorage.setItem("wilaya", response?.data?.wilaya?.name);
            localStorage.setItem("wilaya_id", response?.data?.wilaya?.id);
          }
        } else {
          alert(response.error);
        }
      } catch (error) {
        console.error("Error:", error);

        alert("Request failed : Invalid cardenalities");
      }
    } else {
      alert("Invalid email or password");
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
          width: 500,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 5,
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <h5
          style={{
            color: "#000000",
            fontWeight: 500,
            fontSize: "30px",
            height: 51,
          }}
        >
          Log in
        </h5>
        <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>
          Log in to your account to continue
        </p>

        <Box
          sx={{
            p: 2,
            maxHeight: "calc(80vh - 100px)",
            width: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <form className="auth-form Login-form" onSubmit={handleSubmit}>
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
            <Stack
              direction={"row"}
              sx={{
                position: "relative",
                height: "30px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                sx={{
                  height: "30px",
                  width: "50%",
                  color: "rgba(0, 0, 0, 0.5)",
                }}
                control={<Checkbox />}
                label="Remember me"
              />

              <Link
                to="/Forget-Password"
                className="Forgot-pass"
                style={{
                  height: "30px",
                  display: "inline-block",
                  position: "relative",
                  top: 0,
                  width: "50%",
                }}
              >
                Forgot password?
              </Link>
            </Stack>

            <div className="sub-but">
              <button className="button" onClick={handleSubmit}>
                Log in
              </button>
            </div>
          </form>
          <div className="Login-to-Signup">
            <p>Do not have an account? </p>
            <Link to="/Register">Sign up</Link>
          </div>
        </Box>
      </Box>
    </div>
  );
};
export default Login;
