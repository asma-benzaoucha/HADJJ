import axios from "../../Api/base";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Stack, Alert } from "@mui/material";
import { useEffect, useState } from "react";

const Method = () => {
  const [refresh, setRefresh] = useState(false);
  const [algoExists, setAlgoExists] = useState(null);
  const [statsParticipation, setStatsParticipation] = useState([]);
  const [statsAge, setStatsAge] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [alertsuc, setAlertSuc] = useState(false);
  const [alertErr, setAlertErr] = useState(false);
  const [alertInfo, setAlertInfo] = useState(false);
  const [err, setErr] = useState("");
  //categories inputs
  const [elderlyMinAge, setElderlyMinAge] = useState("");
  const [elderlyPercentage, setElderlyPercentage] = useState("");
  const [category1MinAge, setCategory1MinAge] = useState("");
  const [category1Percentage, setCategory1Percentage] = useState("");
  const [category2MinAge, setCategory2MinAge] = useState("");
  const [category2Percentage, setCategory2Percentage] = useState("");
  const [category3MinAge, setCategory3MinAge] = useState("");
  const [category3Percentage, setCategory3Percentage] = useState("");

  const isConfirmEnabled = () => {
    switch (selectedMethod) {
      case "Age Priority & Registration Priority":
        return elderlyMinAge !== "" && elderlyPercentage !== "";
      case "Age Priority":
        return (
          category1MinAge !== "" &&
          category1Percentage !== "" &&
          category2MinAge !== "" &&
          category2Percentage !== "" &&
          category3MinAge !== "" &&
          category3Percentage !== ""
        );
      case "Registration Priority":
        return true;
      default:
        return false;
    }
  };

  const hideAlert = () => {
    setTimeout(() => {
      setAlertSuc(false);
      setAlertErr(false);
      setAlertInfo(false);
    }, 2000); // 2000 milliseconds = 2 seconds
  };

  const handleCheckboxChange = (method) => {
    setSelectedMethod(method);
  };
  console.log(selectedMethod);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("/lottery/statistics", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
          },
        });
        if (response.status === 200) {
          console.log(response);
          const totalParticipants = response.data.total_participants;
          const numberOfParticipationData = Object.entries(
            response?.data.participation_counts_pourcentages
          ).map(([label, percentage], index) => ({
            id: index,
            value: Math.round((percentage / 100) * totalParticipants),
            label: label === "more_than_four" ? ">4" : label.replace(/_/g, " "),
          }));
          const ageStats = Object.entries(
            response.data.age_groups_pourcentages
          ).map(([label, percentage], index) => {
            let formattedLabel;

            if (label === "under_30") {
              formattedLabel = "<30";
            } else if (label === "between_31_40") {
              formattedLabel = "31-40";
            } else if (label === "between_41_50") {
              formattedLabel = "41-50";
            } else if (label === "between_51_60") {
              formattedLabel = "51-60";
            } else if (label === "between_61_70") {
              formattedLabel = "61-70";
            } else if (label === "above_71") {
              formattedLabel = ">71";
            } else {
              formattedLabel = label.replace(/_/g, " ");
            }

            return {
              id: index,
              value: Math.round((percentage / 100) * totalParticipants),
              label: formattedLabel,
            };
          });
          setStatsParticipation(numberOfParticipationData);
          setStatsAge(ageStats);
          console.log(statsParticipation);
        }
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };

    fetchData(); // Call the async function to execute it
  }, []);
  console.log(statsParticipation);

  const accessToken = localStorage.getItem("accessToken");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMethod) {
      return;
    }

    // Get the access token from localStorage

    // Prepare the request body
    let requestBody = {};
    switch (selectedMethod) {
      case "Age Priority & Registration Priority":
        requestBody = {
          algorithm: "AR",
          values: {
            threshold: parseInt(elderlyMinAge), // Assuming category1MinAge is available in your state
            percentage: parseFloat(elderlyPercentage), // Assuming category1Percentage is available in your state
          },
        };
        break;
      case "Age Priority":
        requestBody = {
          algorithm: "A",
          values: {
            categories: [
              {
                min: parseInt(category1MinAge),
                max: parseInt(category2MinAge) - 1, // Assuming category1MinAge is available in your state
                percentage: parseFloat(category1Percentage), // Assuming category1Percentage is available in your state
              },
              {
                min: parseInt(category2MinAge), // Incrementing by 1 from the previous max value
                max: parseInt(category3MinAge) - 1, // Assuming category2MinAge is available in your state
                percentage: parseFloat(category2Percentage), // Assuming category2Percentage is available in your state
              },
              {
                min: parseInt(category3MinAge), // Incrementing by 1 from the previous max value
                max: 1000, // Assuming category2MinAge is available in your state
                percentage: parseFloat(category3Percentage), // Assuming category2Percentage is available in your state
              },
            ],
          },
        };
        break;
      case "Registration Priority":
        requestBody = {
          algorithm: "R",
        };
        break;
      default:
        return;
    }
    console.log(requestBody);

    try {
      const response = await axios.post("/lottery/algorithm", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setAlertSuc(true);
        setErr("Algorithme is now registred");
        hideAlert();
        setSelectedMethod(null);
        setRefresh(!refresh);
      } else {
        setAlertErr(true);
        setErr("There is no active season at the moment");
        hideAlert();
      }
      // Handle success response
    } catch (error) {
      setAlertInfo(true);
      setErr("erAlgoritme is already chosen");
      hideAlert();
    }
  };

  //-----Get if there is an algorithm

  useEffect(() => {
    const fetchAlgo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("/lottery/algorithm", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
          },
        });
        if (response.status === 200) {
          console.log(response);
          if (response.data.algorithm) {
            console.log("response data ", response.data);
            setAlgoExists(response.data);
            console.log("algo ", algoExists);
          }
        }
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };

    fetchAlgo(); // Call the async function to execute it
  }, [refresh]);
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",

        display: "flex",
        flexDirection: {
          xs: "column", // For extra small screens and below, use column direction
          sm: "column", // For small screens, use column direction
          md: "row", // For medium screens, use row direction
          lg: "row", // For large screens, use row direction
          xl: "row", // For extra large screens, use row direction
        },
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        margin: "auto",
      }}
    >
      {alertErr && (
        <Alert
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
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
            top: 0,
            left: 0,
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
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 1,
            transition: "opacity 0.5s ease-in-out",
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
          }}
          severity="info"
        >
          {err}
        </Alert>
      )}
      <Stack
        direction="column"
        spacing={2}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          width: "40%",
        }}
      >
        <span style={{ fontWeight: 500, fontSize: "30px" }}>statistics</span>
        <Box
          sx={{
            height: { xs: 200, md: 250, lg: 300 },
            backgroundColor: "#EDE8E8",
            borderRadius: 12,
            width: { xs: 200, md: 300, lg: 400 },
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          <PieChart
            series={[
              {
                data: statsParticipation,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -5, color: "gray" },
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: 0,
                cx: "50%",
                cy: "50%",
              },
            ]}
            width={400}
            height={300}
          />
          <span
            style={{ fontWeight: 500, fontSize: "14px", textAlign: "center" }}
          >
            Registration Time Percentage Circle
          </span>
        </Box>

        <Box
          sx={{
            height: { xs: 200, md: 250, lg: 300 },
            backgroundColor: "#EDE8E8",
            borderRadius: 12,
            width: { xs: 200, md: 300, lg: 400 },
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          <PieChart
            series={[
              {
                data: statsAge,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -5, color: "gray" },
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,

                startAngle: 0,
                cx: "50%",
                cy: "50%",
              },
            ]}
            width={400}
            height={300}
          />
          <span
            style={{ fontWeight: 500, fontSize: "14px", textAlign: "center" }}
          >
            Age Percentage Distribution
          </span>
        </Box>
      </Stack>

      <Stack
        direction="column"
        spacing={2}
        sx={{
          position: "relative",
          height: "100%",

          justifyContent: "center",
          width: "60%",
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
            padding: "10px",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: "36px" }}>Algorithm</span>
          {selectedMethod && (
            <button
              className="button"
              style={{ width: "25%", height: "50px", borderRadius: "15px" }}
              onClick={handleSubmit}
              disabled={!isConfirmEnabled()}
            >
              Confirm
            </button>
          )}
        </Stack>
        <div className="Lottery-methods">
          <div className="Methods-box">
            <input
              type="checkbox"
              checked={
                selectedMethod === "Age Priority & Registration Priority" ||
                algoExists?.algorithm === "AR"
              }
              onChange={() =>
                handleCheckboxChange("Age Priority & Registration Priority")
              }
              disabled={algoExists ? true : false}
            />
            <label>Age & Registration priority</label>
          </div>
          <div className="options">
            <label>Min age for elderly [2nd draw]</label>
            <input
              disabled={algoExists ? true : false}
              defaultValue={algoExists ? algoExists?.values?.threshold : ""}
              onChange={(e) => setElderlyMinAge(e.target.value)}
              type="text"
            />
            <label>Percentage</label>
            <input
              defaultValue={algoExists ? algoExists?.values?.percentage : ""}
              disabled={algoExists ? true : false}
              onChange={(e) => setElderlyPercentage(e.target.value)}
              type="text"
            />
          </div>
          <div className="Methods-box">
            <input
              type="checkbox"
              checked={
                selectedMethod === "Age Priority" ||
                algoExists?.algorithm === "A"
              }
              onChange={() => handleCheckboxChange("Age Priority")}
              disabled={algoExists ? true : false}
            />
            <label>Age Category</label>
          </div>
          <div>
            <div className="options">
              <label>Min age for 1st category</label>
              <input
                defaultValue={algoExists?.values?.categories?.[0]?.min ?? ""}
                onChange={(e) => setCategory1MinAge(e.target.value)}
                type="text"
                disabled={algoExists ? true : false}
              />
              <label>Percentage</label>
              <input
                defaultValue={
                  algoExists?.values?.categories?.[0]?.percentage ?? ""
                }
                onChange={(e) => setCategory1Percentage(e.target.value)}
                type="text"
                disabled={algoExists ? true : false}
              />
            </div>
            <div className="options">
              <label> Min age for 2nd category</label>
              <input
                defaultValue={algoExists?.values?.categories?.[1]?.min ?? ""}
                onChange={(e) => setCategory2MinAge(e.target.value)}
                type="text"
                disabled={algoExists ? true : false}
              />
              <label>Percentage</label>
              <input
                defaultValue={
                  algoExists?.values?.categories?.[1]?.percentage ?? ""
                }
                onChange={(e) => setCategory2Percentage(e.target.value)}
                type="text"
                disabled={algoExists ? true : false}
              />
            </div>
            <div className="options">
              <label>Min age for 3rd category</label>
              <input
                defaultValue={algoExists?.values?.categories?.[2]?.min ?? ""}
                onChange={(e) => setCategory3MinAge(e.target.value)}
                type="text"
                disabled={algoExists ? true : false}
              />
              <label>Percentage</label>
              <input
                onChange={(e) => setCategory3Percentage(e.target.value)}
                type="text"
                defaultValue={
                  algoExists?.values?.categories?.[2]?.percentage ?? ""
                }
                disabled={algoExists ? true : false}
              />
            </div>
          </div>
          <div className="Methods-box">
            <input
              type="checkbox"
              checked={
                selectedMethod === "Registration Priority" ||
                algoExists?.algorithm === "R"
              }
              onChange={() => handleCheckboxChange("Registration Priority")}
              disabled={algoExists ? true : false}
            />
            <label>Registration Priority</label>
          </div>
        </div>
      </Stack>
    </Box>
  );
};

export default Method;
