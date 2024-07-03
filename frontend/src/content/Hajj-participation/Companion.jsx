import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import axios from "../../Api/base";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaIdCard } from "react-icons/fa";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PersonIcon from "@mui/icons-material/Person";
import useAuth from "../../Context/useAuth";
import Alert from "@mui/material/Alert";

import dayjs from "dayjs";

const today = dayjs();
const NIN = /^\d{18}$/;
const birthCert = /^\d{5}$/;
const passport = /^\d{9}$/;
const nameRegExp = /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/;

const Companion = () => {
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
  const { auth } = useAuth();
  const data = auth?.data;

  const navigate = useNavigate();
  //adress
  const [adress, setAdress] = useState("");
  const [validAdress, setValidAdress] = useState(false);
  const [adressFocus, setAdressFocus] = useState(false);

  //birth certificate number
  const [birthCertificateNumber, setBirthCertificateNumber] = useState("");
  const [validBirthCertificateNumber, setValidBirthCertificateNumber] =
    useState(false);
  const [birthCertificateNumberFocus, setBirthCertificateNumberFocus] =
    useState(false);
  //Date of passport's expiration
  const [passportExpiration, setPassportExpiration] = useState(null);
  const [validPassportExpiration, setValidPassportExpiration] = useState(false);
  const [passportExpirationFocus, setPassportExpirationFocus] = useState(false);
  let passportExp = dayjs(passportExpiration?.$d).format("YYYY-MM-DD");

  //Passport Number
  const [passportNumber, setPassportNumber] = useState("");
  const [validPassportNumber, setValidPassportNumber] = useState(false);
  const [passportNumberFocus, setPassportNumberFocus] = useState(false);

  //NIN
  const [nin, setNin] = useState("");
  const [validNin, setValidNin] = useState(false);
  const [ninFocus, setNinFocus] = useState(false);

  //Birthday
  const [birthday, setBirthday] = useState(null);
  const [validBirthday, setValidBirthday] = useState(false);
  const [birthdayFocus, setBirthdayFocus] = useState(false);
  let userBirthDate = dayjs(birthday?.$d).format("YYYY-MM-DD");

  //first name
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  //last name
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  useEffect(() => {
    setValidFirstName(nameRegExp.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(nameRegExp.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidAdress(adress);
  }, [adress]);

  useEffect(() => {
    setValidBirthCertificateNumber(birthCert.test(birthCertificateNumber));
  }, [birthCertificateNumber]);

  useEffect(() => {
    setValidNin(NIN.test(nin));
  }, [nin]);
  useEffect(() => {
    setValidPassportNumber(passport.test(passportNumber));
  }, [passportNumber]);

  // Age and birthday check
  const calculateAge = (birthdate) => {
    const birthDate = dayjs(birthdate);
    const age = today.diff(birthDate, "year");
    return age;
  };

  useEffect(() => {
    if (calculateAge(userBirthDate) >= 18) {
      setValidBirthday(true);
    } else {
      setValidBirthday(false);
    }
  }, [userBirthDate]);
  //----------------------------------------------------

  useEffect(() => {
    if (passportExpiration) {
      const differenceInMonths = passportExpiration.diff(today, "months");
      setValidPassportExpiration(differenceInMonths >= 6);
    }
  }, [passportExpiration, passportExp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const access = localStorage.getItem("accessToken");
    console.log("companion data", {
      profile_pic: data.profile_pic,
      nin: data.nin,
      phone_number: data.phone_number,
      birth_date: data.birth_date,
      passport_number: data.passport_number,
      passport_expiration_date: data.passport_expiration_date,
      birth_certificate_number: data.birth_certificate_number,
      files: data.files,
      address: data.address,
      municipal: data.municipal,
      wilaya: data.wilaya,
      companion: {
        first_name: firstName,
        last_name: lastName,
        birth_date: userBirthDate,
        nin: nin,
        passport_number: passportNumber,
        passport_expiration_date: passportExp,
        birth_certificate_number: birthCertificateNumber,
        address: adress,
      },
    });

    if (
      validBirthday &&
      validNin &&
      validBirthCertificateNumber &&
      validPassportExpiration &&
      validPassportNumber &&
      validFirstName &&
      validLastName &&
      validAdress
    ) {
      const modify = localStorage.getItem("modify");
      try {
        const response = modify
          ? await axios.put(
              "/profile/",
              {
                picture: data.profile_pic,
                nin: data.nin,
                phone_number: data.phone_number,
                birth_date: data.birth_date,
                passport_number: data.passport_number,
                passport_expiration_date: data.passport_expiration_date,
                birth_certificate_number: data.birth_certificate_number,
                files: data.files,
                address: data.address,
                municipal: data.municipal,
                wilaya: data.wilaya,
                companion: {
                  first_name: firstName,
                  last_name: lastName,
                  birth_date: userBirthDate,
                  nin: nin,
                  passport_number: passportNumber,
                  passport_expiration_date: passportExp,
                  birth_certificate_number: birthCertificateNumber,
                  address: adress,
                },
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${access}`,
                },
              }
            )
          : await axios.post(
              "/profile/",
              {
                picture: data.profile_pic,
                nin: data.nin,
                phone_number: data.phone_number,
                birth_date: data.birth_date,
                passport_number: data.passport_number,
                passport_expiration_date: data.passport_expiration_date,
                birth_certificate_number: data.birth_certificate_number,
                files: data.files,
                address: data.address,
                municipal: data.municipal,
                wilaya: data.wilaya,
                companion: {
                  first_name: firstName,
                  last_name: lastName,
                  birth_date: userBirthDate,
                  nin: nin,
                  passport_number: passportNumber,
                  passport_expiration_date: passportExp,
                  birth_certificate_number: birthCertificateNumber,
                  address: adress,
                },
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${access}`,
                },
              }
            );

        console.log(response.data);

        if (response.status === 201 || response.status === 200) {
          setAlertSuc(true);
          setErr("Your request has been sent successfully");
          hideAlert();
          localStorage.setItem("Status", "P");
          navigate("/home/message");
        }
      } catch (error) {
        const errorData = error.response.data;
        let errorMessage = "";

        Object.keys(errorData).some((key) => {
          if (Object.prototype.hasOwnProperty.call(errorData, key)) {
            errorMessage = errorData[key][0];
            return true;
          }
          return false;
        });
        setAlertErr(true);
        setErr("An error occurred, " + errorMessage);
        hideAlert();
        console.error("Error:", error);
      }
    } else {
      setAlertInfo(true);
      setErr("Please fill all the fields with valid entry");
      hideAlert();
    }
  };

  return (
    <div className="auth-body">
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
      <Link to="/Participate">
        <ArrowBackIcon fontSize="large" sx={{ mt: 4, ml: 4 }} />
      </Link>
      <Box
        sx={{
          border: "1px solid black",
          position: "absolute",
          transform: "translate(-50%,-50%)",
          left: "50%",
          top: "50%",
          maxHeight: "100%",
          width: 1000, //changes also in col direction
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
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
          Companion information
        </h5>
        <p style={{ color: "rgba(0, 0, 0, 0.5)" }}>
          Complete our registration form to start your Hajj experience
        </p>

        <Box
          sx={{
            gap: 2,
            p: 2,
            width: 800, //400 in the column direction
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center ",
          }}
        >
          <form className="auth-form Login-form" onSubmit={handleSubmit}>
            <Stack direction={"row"} spacing={2} sx={{ mb: 3 }}>
              {/* ----------------- first name ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validFirstName && firstName && !firstNameFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <PersonIcon fontSize="large" className="icon" />
                <input
                  type="text"
                  placeholder="First name"
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                  required
                />
                {!validFirstName && firstName && !firstName && (
                  <span style={{ top: "45px" }} className="error-msg">
                    Please fill this input with a valid name
                  </span>
                )}
              </div>
              {/* ----------------- last name ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validLastName && lastName && !lastNameFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <PersonIcon className="icon" />
                <input
                  type="text"
                  placeholder="Last name"
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                  required
                />
                {!validLastName && lastName && !lastNameFocus && (
                  <span style={{ top: "45px" }} className="error-msg">
                    Please fill this input with a valid name
                  </span>
                )}
              </div>
            </Stack>
            <Stack direction={"row"} spacing={2} sx={{ mb: 3 }}>
              {/* ----------------- Passport Number ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validPassportNumber && passportNumber && !passportNumberFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <FaIdCard fontSize="large" className="icon" />
                <input
                  type="text"
                  placeholder="Passport Number"
                  onChange={(e) => setPassportNumber(e.target.value)}
                  onFocus={() => setPassportNumberFocus(true)}
                  onBlur={() => setPassportNumberFocus(false)}
                  required
                />
                {!validPassportNumber &&
                  passportNumber &&
                  !passportNumberFocus && (
                    <span style={{ top: "45px" }} className="error-msg">
                      Please enter a valid Passport Number -9 Numbers-
                    </span>
                  )}
              </div>
              {/* ----------------- Birthday input ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validBirthday && birthday && !birthdayFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onFocus={() => setBirthdayFocus(true)}
                    onBlur={() => setBirthdayFocus(false)}
                    value={birthday}
                    onChange={(newValue) => setBirthday(newValue)}
                    format={"DD/MM/YYYY"}
                    sx={{
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        { border: "none" },
                      "& input": {
                        fontWeight: 400,
                        fontSize: "16px",
                        color: "black",
                      },
                    }}
                    slotProps={{
                      textField: { placeholder: "Birth date" },

                      inputAdornment: {
                        position: "start",
                      },
                    }}
                  />
                </LocalizationProvider>

                {!validBirthday && birthday && !birthdayFocus && (
                  <span style={{ top: "45px" }} className="error-msg">
                    you must be at least 18 years old
                  </span>
                )}
              </div>
            </Stack>
            <Stack direction={"row"} spacing={2} sx={{ mb: 3 }}>
              {/* ----------------- Date of passport's expiration ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validPassportExpiration &&
                  passportExpiration &&
                  !passportExpirationFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onFocus={() => setPassportExpirationFocus(true)}
                    onBlur={() => setPassportExpirationFocus(false)}
                    value={passportExpiration}
                    onChange={(newValue) => setPassportExpiration(newValue)}
                    format={"DD/MM/YYYY"}
                    minDate={dayjs()}
                    sx={{
                      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        { border: "none" },
                      "& input": {
                        fontWeight: 400,
                        fontSize: "16px",
                        color: "black",
                      },
                    }}
                    slotProps={{
                      textField: {
                        placeholder: "Date of passport’s expiration ",
                      },

                      inputAdornment: {
                        position: "start",
                      },
                    }}
                  />
                </LocalizationProvider>

                {!validPassportExpiration &&
                  passportExpiration &&
                  !passportExpirationFocus && (
                    <span style={{ top: "45px" }} className="error-msg">
                      Passport expires in less than 6 months
                    </span>
                  )}
              </div>
              {/* ----------------- Birth Certificate number ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validBirthCertificateNumber &&
                  birthCertificateNumber &&
                  !birthCertificateNumberFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <BadgeIcon className="icon" />
                <input
                  type="text"
                  placeholder="Birth Certificate Number"
                  onChange={(e) => setBirthCertificateNumber(e.target.value)}
                  onFocus={() => setBirthCertificateNumberFocus(true)}
                  onBlur={() => setBirthCertificateNumberFocus(false)}
                  required
                />
                {!validBirthCertificateNumber &&
                  birthCertificateNumber &&
                  !birthCertificateNumberFocus && (
                    <span style={{ top: "45px" }} className="error-msg">
                      invalid birth certificate number -5 Numbers-
                    </span>
                  )}
              </div>
            </Stack>
            <Stack direction={"row"} spacing={2} sx={{ mb: 3 }}>
              {/* ----------------- NIN ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validNin && nin && !ninFocus ? "invalid-input" : "input"
                }
              >
                <FaIdCard fontSize="large" className="icon" />
                <input
                  type="text"
                  placeholder="NIN"
                  onChange={(e) => setNin(e.target.value)}
                  onFocus={() => setNinFocus(true)}
                  onBlur={() => setNinFocus(false)}
                  required
                />
                {!validNin && nin && !ninFocus && (
                  <span style={{ top: "45px" }} className="error-msg">
                    Please enter a valid NIN -18 Numbers-
                  </span>
                )}
              </div>
              {/* ----------------- Adress input ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validAdress && adress && !adressFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <LocationOnIcon className="icon" />
                <input
                  type="text"
                  placeholder="Adress"
                  onChange={(e) => setAdress(e.target.value)}
                  onFocus={() => setAdressFocus(true)}
                  onBlur={() => setAdressFocus(false)}
                  required
                />
                {!validAdress && adress && !adressFocus && (
                  <span style={{ top: "45px" }} className="error-msg">
                    Adress must be mentioned
                  </span>
                )}
              </div>
            </Stack>

            {/*------------------- Button---------------*/}

            <div className="sub-but">
              <button
                className="button"
                onClick={handleSubmit}
                style={{ width: "350px" }}
              >
                Confirm
              </button>
            </div>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default Companion;
