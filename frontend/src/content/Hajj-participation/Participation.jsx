import { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/AuthProvider";
import { Box, Stack } from "@mui/material";
import axios from "../../Api/base";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaIdCard } from "react-icons/fa";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Link, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import dayjs from "dayjs";
import municipalIcon from "../../assets/WilayaIcon.png";
import wilayaImg from "../../assets/StateIcon.png";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Alert from "@mui/material/Alert";

const today = dayjs();
const NIN = /^\d{18}$/;
const birthCert = /^\d{5}$/;
const passport = /^\d{9}$/;
//const date = /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
const Number = /^(0)(5|6|7)([0-9]{8})$/;
const Participation = () => {
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
  const { setAuth } = useContext(AuthContext);
  const gender = localStorage.getItem("gender");

  const navigate = useNavigate();
  //adress
  let adress = "City wiaam";
  //pdf file
  const [selectedFile, setSelectedFile] = useState(null);
  //user image
  const [selectedImage, setSelectedImage] = useState(null);
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

  //State  options
  const [stateOptions, setStateOptions] = useState([]);

  //municipal options
  const [municipalOptions, setMunicipalOptions] = useState([]);

  //NIN
  const [nin, setNin] = useState("");
  const [validNin, setValidNin] = useState(false);
  const [ninFocus, setNinFocus] = useState(false);

  //Birthday
  const [birthday, setBirthday] = useState(null);
  const [validBirthday, setValidBirthday] = useState(false);
  const [birthdayFocus, setBirthdayFocus] = useState(false);
  let userBirthDate = dayjs(birthday?.$d).format("YYYY-MM-DD");

  //Phone Number
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

  //State
  const [state, setState] = useState("");
  const [validState, setValidState] = useState(false);

  //Municipal
  const [municipal, setMunicipal] = useState("");
  const [validMunicipal, setValidMunicipal] = useState(false);

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

  useEffect(() => {
    setValidPhoneNumber(Number.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setValidState(state);
  }, [state]);

  useEffect(() => {
    setValidMunicipal(municipal);
  }, [municipal]);

  //State fetching

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/administrative/wilayas");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/administrative/wilaya/${state}/municipals`
        );
        console.log(response.data);

        const fetchedMun = response.data.map((item) => ({
          value: item.name,
          key: item.id,
        }));
        setMunicipalOptions(fetchedMun);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [state]);

  const handleWilaya = (e) => {
    setState(parseInt(e.target.value));
  };
  const handleMunicipal = (e) => {
    setMunicipal(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validBirthday &&
      validNin &&
      validPhoneNumber &&
      validState &&
      validMunicipal &&
      validBirthCertificateNumber &&
      validPassportExpiration &&
      validPassportNumber &&
      selectedFile &&
      selectedImage
    ) {
      const access = localStorage.getItem("accessToken");
      const modify = localStorage.getItem("modify");
      try {
        const response = modify
          ? await axios.put(
              "/profile/",
              {
                nin: nin,
                phone_number: phoneNumber,
                birth_date: userBirthDate,
                municipal: parseInt(municipal),
                wilaya: parseInt(state),
                passport_number: passportNumber,
                passport_expiration_date: passportExp,
                birth_certificate_number: birthCertificateNumber,
                files: selectedFile,
                address: adress,
                picture: selectedImage,
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
                nin: nin,
                phone_number: phoneNumber,
                birth_date: userBirthDate,
                municipal: parseInt(municipal),
                wilaya: parseInt(state),
                passport_number: passportNumber,
                passport_expiration_date: passportExp,
                birth_certificate_number: birthCertificateNumber,
                files: selectedFile,
                address: adress,
                picture: selectedImage,
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
          localStorage.setItem("Status", "P");
          setAlertSuc(true);
          setErr("Your request has been sent successfully");
          hideAlert();
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

  const handleContinue = () => {
    const data = {
      nin: nin,
      phone_number: phoneNumber,
      birth_date: userBirthDate,
      municipal: parseInt(municipal),
      wilaya: parseInt(state),
      passport_number: passportNumber,
      passport_expiration_date: passportExp,
      birth_certificate_number: birthCertificateNumber,
      files: selectedFile,
      address: adress,
      profile_pic: selectedImage,
    };
    setAuth({ data });
    console.log(data);
    localStorage.setItem("ParticipateData", data);
    navigate("/Participate/Companion");
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
      <Link to="/">
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
          Registration
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
              {/* ----------------- Phone Number input ----------------- */}
              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validPhoneNumber && phoneNumber && !phoneNumberFocus
                    ? "invalid-input"
                    : "input"
                }
              >
                <LocalPhoneIcon className="icon" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onFocus={() => setPhoneNumberFocus(true)}
                  onBlur={() => setPhoneNumberFocus(false)}
                  required
                />
                {!validPhoneNumber && phoneNumber && !phoneNumberFocus && (
                  <span style={{ top: "45px" }} className="error-msg">
                    Invalid phone number , example:0755555555
                  </span>
                )}
              </div>
            </Stack>
            <Stack direction={"row"} spacing={2} sx={{ mb: 3 }}>
              {/* --------------- State selection ------------- */}

              <div
                style={{ position: "relative", width: "350px" }}
                className={!validState && state ? "invalid-input" : "input"}
              >
                <img src={wilayaImg} fontSize="medium" className="icon" />
                <select
                  required
                  className="custom-select"
                  onChange={handleWilaya}
                  style={{ width: "85%" }}
                >
                  <option value="">Select Wilaya</option>
                  {stateOptions.map((option) => (
                    <option key={option.label} value={option.label}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
              {/* --------------- Municipal selection ------------- */}

              <div
                style={{ position: "relative", width: "350px" }}
                className={
                  !validMunicipal && municipal ? "invalid-input" : "input"
                }
              >
                <img src={municipalIcon} fontSize="medium" className="icon" />
                <select
                  required
                  className="custom-select"
                  onChange={handleMunicipal}
                  style={{ width: "85%" }}
                >
                  <option value="">Select Municipal</option>
                  {municipalOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
            </Stack>
            <Stack direction={"row"} spacing={2} sx={{ mb: 3 }}>
              {/* -----------------USER image ----------------- */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  id="uploadButton"
                />
                <label htmlFor="uploadButton">
                  {selectedImage ? (
                    <>
                      <CheckCircleOutlinedIcon
                        sx={{ mr: 2, color: "#4bb543" }}
                      />
                      User image uploaded
                    </>
                  ) : (
                    <>
                      <AccountBoxIcon
                        sx={{ mr: 2, color: "rgb(0, 0, 0, 0.7)" }}
                      />
                      User image
                    </>
                  )}
                </label>
              </div>

              {/* --------------- PDF proof images ------------- */}
              <div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                  id="PDFbutton"
                />
                <label htmlFor="PDFbutton">
                  <UploadFileIcon
                    sx={{
                      mr: 2,
                      color: selectedFile ? "#4bb543" : "rgb(0, 0, 0, 0.7)",
                    }}
                  />
                  {selectedFile ? "PDF proof uploaded" : "PDF proof images "}
                </label>
              </div>
            </Stack>

            {/*------------------- Button---------------*/}

            {gender === "M" && (
              <div className="sub-but">
                <button
                  className="button"
                  onClick={handleSubmit}
                  style={{ width: "350px" }}
                >
                  Confirm
                </button>
              </div>
            )}
            {gender === "F" && (
              <div className="sub-but">
                <button className="button" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            )}
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default Participation;
