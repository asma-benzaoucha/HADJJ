import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import GroupsIcon from "@mui/icons-material/Groups";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import axios from "../../Api/base";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";

const price = /^[0-9]+$/;

const NewSeason = ({ onClose }) => {
  NewSeason.propTypes = {
    onClose: PropTypes.func.isRequired,
  };
  //const { auth } = useAuth();

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

  //Year
  const [year, setYear] = useState("");
  const [validYear, setValidYear] = useState(false);
  const [yearFocus, setYearFocus] = useState(false);
  //Total pilgrims
  const [totalP, setTotalP] = useState("");
  const [validTotalP, setValidTotalP] = useState(false);
  const [totalPFocus, setTotalPFocus] = useState(false);

  //Inscription deadline
  const [inscDeadline, setInscDeadline] = useState(null);
  const [validInscDeadline, setValidInscDeadline] = useState(false);
  const [inscFocus, setInscFocus] = useState(false);
  let inscriptionEnd = dayjs(inscDeadline?.$d).format("YYYY-MM-DD");

  //Procedure deadline
  const [procDeadline, setProcDeadline] = useState(null);
  const [validProcDeadline, setValidProcDeadline] = useState(false);
  const [procFocus, setProcFocus] = useState(false);
  let procedureEnd = dayjs(procDeadline?.$d).format("YYYY-MM-DD");
  //Number of phases
  const [phaseNum, setPhaseNum] = useState("");
  const [validPhaseNum, setValidPhaseNum] = useState(false);
  const [pahseFocus, setPhaseFocus] = useState(false);
  //Season feed
  const [seasonFees, setSeasonFees] = useState(null);
  const [validSeasonFees, setValidSeasonFees] = useState(false);
  const [seasonFeesFocus, setSeasonFeesFocus] = useState(false);

  //-----------------------Effects------------------//

  useEffect(() => {
    setValidSeasonFees(price.test(seasonFees));
    /*setValidSeasonFees(true);
    let passportExp = dayjs(seasonFees?.$d).format("YYYY-MM-DD");
    console.log("seasonFees", seasonFees);
    console.log("passportExp", passportExp);*/
  }, [seasonFees]);

  useEffect(() => {
    // Year validation
    if (year.length >= 4 && parseInt(year) >= 2000) {
      setValidYear(true);
    } else {
      setValidYear(false);
    }
  }, [year]);

  useEffect(() => {
    // Inscription deadline validation

    if (inscDeadline && procDeadline) {
      setValidInscDeadline(inscriptionEnd < procedureEnd);
    }

    /*const procDateValid = procDeadline
      ? new Date(inscDeadline) < new Date(procDeadline)
      : true;

    setValidInscDeadline(validDate.test(inscDeadline) && procDateValid);*/
  }, [inscDeadline, procDeadline]);

  useEffect(() => {
    if (inscDeadline && procDeadline) {
      setValidProcDeadline(inscriptionEnd < procedureEnd);
    }
    // Procedure deadline validation
    /*const inscDateValid = inscDeadline
      ? new Date(inscDeadline) < new Date(procDeadline)
      : true;

    setValidProcDeadline(validDate.test(procDeadline) && inscDateValid);*/
  }, [procDeadline, inscDeadline]);

  useEffect(() => {
    // Number of phases validation
    const numRegex = /^[0-9]+$/;
    const isValidPhaseNum =
      numRegex.test(phaseNum) &&
      (!inscriptionEnd ||
        !procedureEnd || // No dates typed yet
        (new Date(procedureEnd) - new Date(inscriptionEnd)) /
          (1000 * 60 * 60 * 24) /
          phaseNum >
          15);
    setValidPhaseNum(isValidPhaseNum);
  }, [phaseNum, inscDeadline, procDeadline]);

  useEffect(() => {
    // Total pilgrims validation
    const numRegex = /^[0-9]+$/;
    const validTotalP = numRegex.test(totalP);
    setValidTotalP(validTotalP);
  }, [totalP]);

  //File data
  const [data, setData] = useState([]);

  //handle CSV file
  const handleCSVChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target.result;
      const data = parseCSV(result);
      setData(data);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const parseCSV = (csv) => {
    const rows = csv
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row !== ""); // Trim whitespace and remove empty rows
    const headers = rows[0].split(","); // Extract headers (assuming they are separated by commas)
    const data = rows.slice(1).map((row) => {
      const values = row.split(","); // Split row into values (assuming they are separated by commas)
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] ? values[index].trim() : ""; // Trim whitespace and handle empty values
      });
      return rowData;
    });
    return data;
  };

  const [NewData, setNewData] = useState([]);

  useEffect(() => {
    const newData = data.map((item) => ({
      wilaya: parseInt(item.wilaya),
      available_seats: parseInt(item.available_seats),
      extra_seats: parseInt(item.extra_seats),
    }));

    setNewData(NewData);
    if (newData.length > 0) {
      console.log("All Data:");
      console.log(newData);
    } else {
      console.log("No data");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    console.log("entered");
    e.preventDefault();

    if (
      validYear &&
      validTotalP &&
      validInscDeadline &&
      validProcDeadline &&
      validPhaseNum &&
      validSeasonFees
    ) {
      //***********************************Algorithme */

      const inscriptionDeadline = new Date(inscriptionEnd);
      const procedureDeadline = new Date(procedureEnd);

      // Calculate the total number of days in the period
      const totalDays =
        (procedureDeadline - inscriptionDeadline) / (1000 * 60 * 60 * 24);

      const phasesNumber = phaseNum;

      // Divide the total period into equal parts
      const partDays = Math.floor(totalDays / phasesNumber);

      // Calculate the start and end dates for each part

      const phase = [];
      for (let i = 0; i < phasesNumber; i++) {
        const partStartDate = new Date(
          inscriptionDeadline.getTime() + i * partDays * 24 * 60 * 60 * 1000
        );

        let partEndDate;
        if (i === phasesNumber - 1) {
          partEndDate = procedureDeadline;
        } else {
          partEndDate = new Date(
            inscriptionDeadline.getTime() +
              (i + 1) * partDays * 24 * 60 * 60 * 1000 -
              1
          );
        }

        // Format the dates to YYYY-MM-DD
        const formattedStartDate = partStartDate.toISOString().split("T")[0];
        const formattedEndDate = partEndDate.toISOString().split("T")[0];

        console.log(
          `Phase ${
            i + 1
          }: Starts on ${formattedStartDate}, Ends on ${formattedEndDate}`
        );

        phase.push({
          phase_number: i + 1,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        });
      }

      //******************************END */

      const yearInteger = parseInt(year, 10);
      const totalPInteger = parseInt(totalP, 10);
      const payload = {
        year: yearInteger,
        total_pilgrims: totalPInteger,
        inscription_deadline: inscriptionEnd,
        procedure_deadline: procedureEnd,
        wilayas_seats: NewData,
        phases: phase,
        price: parseInt(seasonFees),
      };
      console.log(payload);
      const access = localStorage.getItem("accessToken");
      console.log(access);
      try {
        const response = await axios.post("/pilgrimage/", payload, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        if (response.status === 201) {
          setAlertSuc(true);
          setErr("Season created successfully");
          hideAlert();
          onClose();
        } else {
          setAlertErr(true);
          setErr(
            "Error while trying creating new season, please try again later"
          );
          hideAlert();
        }
      } catch (error) {
        setAlertErr(true);
        setErr("Server error, please try again later");
        hideAlert();
        console.error("Error:", error);
      }
    } else {
      console.log("rani hna");
      setAlertInfo(true);
      setErr("Please fill all the fields correctly");
      hideAlert();
    }
  };

  //---------------------------------------------

  return (
    <>
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
          left: "50%",
          top: "50%",
          maxHeight: "100vh",
          width: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto",
          p: 5,
          borderRadius: 10,
          backgroundColor: "rgba(255, 255, 255, 1)",
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
          New season
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

        <p style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.5)" }}>
          Customize details to ensure a harmonious pilgrimage
        </p>

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
            <div
              className={
                !validYear && year && !yearFocus ? "invalid-input" : "input"
              }
            >
              <EventAvailableIcon fontSize="medium" className="icon" />
              <input
                type="text"
                placeholder="Year"
                onChange={(e) => setYear(e.target.value)}
                onFocus={() => setYearFocus(true)}
                onBlur={() => setYearFocus(false)}
                required
              />
            </div>

            {!validYear && year && !yearFocus && (
              <div className="error-container">
                <span className="error-msg">Please enter a valid year</span>
              </div>
            )}

            <div
              className={
                !validTotalP && totalP && !totalPFocus
                  ? "invalid-input"
                  : "input"
              }
            >
              <GroupsIcon fontSize="medium" className="icon" />
              <input
                type="text"
                placeholder="Total Pilgrims"
                onChange={(e) => setTotalP(e.target.value)}
                onFocus={() => setTotalPFocus(true)}
                onBlur={() => setTotalPFocus(false)}
                required
              />
            </div>
            {!validTotalP && totalP && !totalPFocus && (
              <div className="error-container">
                <span className="error-msg">Please enter a valid Number</span>
              </div>
            )}

            <div
              className={
                !validSeasonFees && seasonFees && !seasonFeesFocus
                  ? "invalid-input"
                  : "input"
              }
            >
              <CreditCardOutlinedIcon fontSize="medium" className="icon" />
              <input
                type="text"
                placeholder="Hajj fees"
                onChange={(e) => setSeasonFees(e.target.value)}
                onFocus={() => setSeasonFeesFocus(true)}
                onBlur={() => setSeasonFeesFocus(false)}
                required
              />
            </div>
            {!validSeasonFees && seasonFees && !seasonFeesFocus && (
              <div className="error-container">
                <span className="error-msg">Please enter a valid Price</span>
              </div>
            )}

            {/* ----------------- Date of inscription deadline ----------------- */}
            <div
              style={{ position: "relative" }}
              className={
                !validInscDeadline && inscDeadline && !inscFocus && procDeadline
                  ? "invalid-input"
                  : "input"
              }
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onFocus={() => setInscFocus(true)}
                  onBlur={() => setInscFocus(false)}
                  value={inscDeadline}
                  onChange={(newValue) => setInscDeadline(newValue)}
                  format={"DD/MM/YYYY"}
                  //minDate={}
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
                      placeholder: "Inscription deadline ",
                    },

                    inputAdornment: {
                      position: "start",
                    },
                  }}
                />
              </LocalizationProvider>

              {!validInscDeadline &&
                inscDeadline &&
                !inscFocus &&
                procDeadline && (
                  <span
                    style={{ top: "45px", fontSize: "11px" }}
                    className="error-msg"
                  >
                    Inscription deadline can not be after procedure deadline
                  </span>
                )}
            </div>
            {/* ----------------- Date of procedure deadline ----------------- */}
            <div
              style={{ position: "relative" }}
              className={
                !validProcDeadline && procDeadline && !procFocus && inscDeadline
                  ? "invalid-input"
                  : "input"
              }
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onFocus={() => setProcFocus(true)}
                  onBlur={() => setProcFocus(false)}
                  value={procDeadline}
                  onChange={(newValue) => setProcDeadline(newValue)}
                  format={"DD/MM/YYYY"}
                  // minDate={dayjs()}
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
                      placeholder: "Procedure deadline ",
                    },

                    inputAdornment: {
                      position: "start",
                    },
                  }}
                />
              </LocalizationProvider>

              {!validProcDeadline &&
                procDeadline &&
                !procFocus &&
                inscDeadline && (
                  <span
                    style={{ top: "45px", fontSize: "11px" }}
                    className="error-msg"
                  >
                    Procedure deadline can not be before inscription deadline
                  </span>
                )}
            </div>

            <div
              className={
                !validPhaseNum && phaseNum && !pahseFocus
                  ? "invalid-input"
                  : "input"
              }
            >
              <ReplayIcon className="icon" />
              <input
                type="text"
                placeholder="Phase's number"
                onChange={(e) => setPhaseNum(e.target.value)}
                onFocus={() => setPhaseFocus(true)}
                onBlur={() => setPhaseFocus(false)}
                required
              />
            </div>
            {!validPhaseNum && phaseNum && !pahseFocus && (
              <div className="error-container">
                <span className="error-msg">
                  So many phases comparing to deadlines
                </span>
              </div>
            )}
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVChange}
              id="uploadButton"
            />
            <label
              htmlFor="uploadButton"
              style={{ color: "rgb(0, 0, 0, 0.6)" }}
            >
              <UploadFileIcon
                sx={{
                  mr: 2,
                  color: data.length >= 1 ? "green" : "rgb(0, 0, 0, 0.7)",
                }}
              />
              {data.length >= 1 ? "File uploaded" : "Upload the csv file"}
            </label>

            <div className="sub-but">
              <button className="button" onClick={handleSubmit}>
                Confirm
              </button>
            </div>
          </form>
        </Box>
      </Box>
    </>
  );
};
export default NewSeason;
