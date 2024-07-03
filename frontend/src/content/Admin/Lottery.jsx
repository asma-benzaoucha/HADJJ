import { Box, Stack, List, ListItem, ListItemText } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useState, useEffect, useMemo } from "react";
import axios from "../../Api/base";
import { FaArrowCircleRight } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import WinnersTable from "../../Components/WinnersTable";

const screenHeight = window.innerHeight;

const Lottery = () => {
  const [participants, setParticipants] = useState([]);
  const [municipals, setMunicipals] = useState([]);
  const [numberOfWinners, setNumberOfWinners] = useState(0);
  const [currentWinner, setCurrentWinner] = useState("");
  const [winners, setWinners] = useState([]);
  const [totalWinners, setTotalWinners] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (numberOfWinners === totalWinners && initialWinners?.length > 0) {
      console.log("All winners are selected");
      setFinished(true);
    }
  }, [numberOfWinners]);
  const navigate = useNavigate();
  const [initialWinners, setInitialWinners] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  let newSeats = 0;
  if (localStorage.getItem("seats")) {
    newSeats = parseInt(localStorage.getItem("seats"));
    console.log("new seats", newSeats);
  }

  const [isDone, setIsDone] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [final, setFinal] = useState(false);
  useEffect(() => {
    const check = async () => {
      try {
        const response = await axios.get("/lottery/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const done = response.data.done;
        const all = response.data.all;
        setIsAll(all);
        setIsDone(done);
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };
    check();
  }, [finished]);
  console.log("isDone", isDone);
  console.log("isAll", isAll);

  useEffect(() => {
    if (isDone && isAll) {
      setFinal(true);
    }
  }, [isAll, isDone]);

  console.log("final", final);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedMunicipalIds = localStorage.getItem("municipals_ids");
    const municipal_ids = storedMunicipalIds
      ? JSON.parse(storedMunicipalIds)
      : [];
    console.log("municipal_ids", municipal_ids);

    const check = async () => {
      if (Array.isArray(municipal_ids)) {
        const ids = municipal_ids.map((item) => item.id);

        console.log("tranformed data", ids);
        console.log("hereeeeeeeee");
        try {
          console.log("rani meme hna");
          const response = await axios.post(
            "/lottery/participants",
            { municipals: ids },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("Response:", response.data);
          setParticipants(response.data.participants);
        } catch (error) {
          // Handle network errors or Axios request errors
          console.error("Error:", error);
        }
      } else {
        try {
          console.log("rani hna");
          const response = await axios.post(
            "/lottery/participants",
            municipal_ids,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("Response:", response.data);
          setParticipants(response.data.participants);
        } catch (error) {
          // Handle network errors or Axios request errors
          console.error("Error:", error);
        }
      }
    };
    check();
  }, []);
  //Check the draw type is selected

  //table-------------------------------

  const myTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          row: {
            "&.Mui-selected": {
              backgroundColor: "#E7D9CA",
              "&:hover": {
                backgroundColor: "#E7D9CA",
              },
            },
          },
        },
      },
    },
  });

  const columns = useMemo(
    () => [
      { field: "nin", headerName: "NIN", width: 180 },
      {
        field: "name",
        headerName: "Name",
        width: 220,
        renderCell: (params) =>
          `${params.row.first_name} ${params.row.last_name}`, // Concatenate first and last name
      },
      {
        field: "inscription_count",
        headerName: "Inscription count",
        width: 120,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalActivityOutlinedIcon style={{ color: "#AB7595" }} />
            <span style={{ marginLeft: 5 }}>{params.value}</span>
          </div>
        ),
      },
    ],
    []
  );

  //---------------------------------------

  useEffect(() => {
    const mun_name = JSON.parse(localStorage.getItem("municipals_names"));
    setMunicipals(mun_name?.municipals);
  }, []);

  const handledraw = async () => {
    setIsStarted(true);
    const accessToken = localStorage.getItem("accessToken");
    const storedMunicipalIds = localStorage.getItem("municipals_ids");
    const municipal_ids = storedMunicipalIds
      ? JSON.parse(storedMunicipalIds)
      : [];
    console.log("municipal_ids", municipal_ids);

    const check = async () => {
      if (Array.isArray(municipal_ids)) {
        const ids = municipal_ids.map((item) => item.id);

        console.log("tranformed data", ids);
        console.log("hereeeeeeeee");
        try {
          console.log("HERE GETTING WINNERS");
          const response = await axios.post(
            "/lottery/result",
            { municipals: ids, used_seats: 0 },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("ResponsewINNERS:", response.data);
          setTotalWinners(response.data.total_winners);
          setInitialWinners(response.data.winners);
          console.log("initial winners are this ", initialWinners);
        } catch (error) {
          // Handle network errors or Axios request errors
          console.error("Error:", error);
        }
      } else {
        console.log("not array in winners response");
        try {
          const response = await axios.post(
            "/lottery/result",
            {
              municipals: municipal_ids.municipals,
              used_seats: newSeats,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("Response:", response.data);
          setTotalWinners(response.data.total_winners);
          setInitialWinners(response.data.winners);
          console.log("initial winners are this ", initialWinners);
        } catch (error) {
          // Handle network errors or Axios request errors
          console.error("Error:", error);
        }
      }
    };
    check();
  };

  //---------

  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [winnerPosition, setWinnerPosition] = useState(0);
  useEffect(() => {
    const animateList = () => {
      if (isPaused) return;
      const winnerIndex = participants.findIndex((user) =>
        initialWinners.some((winner) => winner.nin === user.nin)
      );

      if (
        winnerIndex !== 0 ||
        participants[0]?.nin !== initialWinners[winnerPosition]?.nin
      ) {
        const updatedUsers = [...participants.slice(1), participants[0]];
        setParticipants(updatedUsers);
      } else {
        setWinnerPosition(winnerPosition + 1);
        const currentWinner = participants[0];
        setCurrentWinner(currentWinner);
        console.log("Current winner is", currentWinner);
        setWinners([...winners, currentWinner]);
        console.log("Winners are", winners);
        setNumberOfWinners(
          currentWinner.gender === "F"
            ? numberOfWinners + 2
            : numberOfWinners + 1
        );
        console.log("Number of winners is now", numberOfWinners);
        console.log("Winners are", winners);
        setParticipants(
          participants.filter((user) => user.nin !== currentWinner.nin)
        );
      }
    };

    if (numberOfWinners < totalWinners) {
      const animationInterval = setInterval(animateList, 200); // Adjust the delay as needed
      return () => clearInterval(animationInterval); // Clean up the interval
    }
  }, [
    participants,
    initialWinners,
    winners,
    numberOfWinners,
    totalWinners,
    isPaused,
    winnerPosition,
  ]);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (finished) {
      const check = async () => {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const response = await axios.get("/lottery/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const done = response.data.done;
          const all = response.data.all;

          if (done === true && all === false) {
            setStatus("remain");
          } else if (done === true && all === true) {
            setStatus("done");
          }
        } catch (error) {
          // Handle network errors or Axios request errors
          console.error("Error:", error);
        }
      };
      check();
    }
  }, [finished]);
  /*
  console.log(
    "started",
    isStarted,
    "finished",
    finished,
    "paused",
    isPaused,
    "status",
    status
  );*/

  return (
    <div className="lottery-body">
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: "400px", md: "200px" },
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            px: "20px",
          }}
        >
          {/*   ------------------------------List of municipals--------------------------------------*/}

          <List
            sx={{
              width: "200px",
              maxHeight: "200px",
              overflow: "auto",
              paddingRight: "14px",
              boxShadow: "5px 5px 5px #ab7595",
              borderRadius: "15px",
            }}
          >
            <ListItem
              sx={{
                bgcolor: "white",
                height: "50px",
                "& .MuiTypography-root": {
                  fontWeight: 600,
                  color: "#343A40",
                },
              }}
            >
              <ListItem sx={{ width: "70%" }}>
                <ListItemText primary="Municipal" />
              </ListItem>
            </ListItem>
            {municipals?.map((municipal) => (
              <ListItem
                key={municipal}
                sx={{
                  bgcolor: "white",
                  borderTop: "1px solid #F3F3F3",
                  fontWeight: 600,
                  height: "50px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  "& .MuiTypography-root": {
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#6C757D",
                  },
                }}
              >
                <ListItem
                  sx={{
                    width: "70%",
                    height: "50px",
                  }}
                >
                  <ListItemText primary={municipal} />
                </ListItem>
              </ListItem>
            ))}
          </List>

          {currentWinner && (
            <Stack
              direction={"row"}
              spacing={2}
              sx={{
                alignItems: "center",
                position: "relative",
                top: { xs: "0px", md: "40px" },
              }}
            >
              <Stack
                direction={"column"}
                sx={{
                  alignItems: "center",
                  position: "relative",
                  top: { xs: "0px", md: "10px" },
                }}
              >
                <span
                  style={{
                    color: "#AB7595",
                    fontSize: "22px",
                    fontWeight: 600,
                  }}
                >
                  Current Winner
                </span>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div className="winner-icon" />
                  <span style={{ fontSize: "22px", fontWeight: 600 }}>
                    {currentWinner.first_name} {currentWinner.last_name}
                  </span>
                  <div className="winner-icon" />
                </Box>
              </Stack>
              {currentWinner.gender === "F" && (
                <Stack
                  direction={"column"}
                  sx={{
                    alignItems: "center",
                    position: "relative",
                    top: { xs: "0px", md: "10px" },
                  }}
                >
                  <span
                    style={{
                      color: "#AB7595",
                      fontSize: "22px",
                      fontWeight: 600,
                    }}
                  >
                    Her companion
                  </span>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div className="winner-icon" />
                    <span style={{ fontSize: "22px", fontWeight: 600 }}>
                      {currentWinner.c_first_name} {currentWinner.c_last_name}
                    </span>
                    <div className="winner-icon" />
                  </Box>
                </Stack>
              )}
            </Stack>
          )}
          {!isStarted && !finished && (
            <button
              className="button"
              onClick={handledraw}
              style={{
                height: "50px",
                width: "160px",
                fontSize: "18px",
                borderRadius: 30,
                position: "relative",
              }}
            >
              Start draw
            </button>
          )}
          {isStarted && !isPaused && !finished && (
            <button
              className="button"
              onClick={() => setIsPaused(true)}
              style={{
                height: "50px",
                width: "160px",
                fontSize: "18px",
                borderRadius: 30,
                position: "relative",
              }}
            >
              Pause Draw
            </button>
          )}
          {isStarted && isPaused && !finished && (
            <button
              className="button"
              onClick={() => setIsPaused(false)}
              style={{
                height: "50px",
                width: "160px",
                fontSize: "18px",
                borderRadius: 30,
                position: "relative",
              }}
            >
              Resume Draw
            </button>
          )}

          {finished && status === "done" && (
            <button
              className="button"
              onClick={() => {
                setIsPaused(false);
                navigate("/admin/Winners");
              }}
              style={{
                height: "50px",
                width: "160px",
                fontSize: "18px",
                borderRadius: 30,
                position: "relative",
              }}
            >
              Preview Winners
            </button>
          )}
          {finished && status === "remain" && (
            <button
              className="button"
              onClick={() => {
                setIsPaused(false);

                navigate("/admin/grouping");
              }}
              style={{
                height: "50px",
                width: "160px",
                fontSize: "18px",
                borderRadius: 30,
                position: "relative",
              }}
            >
              Back to grouping
            </button>
          )}
        </Box>

        {/*   ------------------------------Table of users and winners--------------------------------------*/}

        <Stack
          direction={{ sm: "column", md: "row" }}
          spacing={2}
          sx={{
            width: "100%",
            height: { xs: "1100px", md: `${screenHeight - 220}px` },
            px: { xs: "10px", md: "60px" },
            justifyContent: "space-between",
            alignItems: "center",
            py: "20px",
          }}
        >
          <Box
            sx={{
              width: "540px",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              position: "relative",
            }}
          >
            <span
              style={{ color: "#AB7595", fontSize: "22px", fontWeight: 600 }}
            >
              All participants
            </span>

            <ThemeProvider theme={myTheme}>
              <DataGrid
                columns={columns}
                rows={participants}
                getRowId={(row) => row?.nin}
                hideFooterSelectedRowCount
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                getRowSpacing={(params) => ({
                  top: params.isFirstVisible ? 0 : 2,
                  bottom: params.isLastVisible ? 0 : 2,
                })}
                rowHeight={45}
                sx={{
                  [`& .${gridClasses.row}`]: {
                    bgcolor: grey[10],
                  },
                  ".MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                  "&.MuiDataGrid-root": {
                    border: "none",
                    backgroundColor: "white",
                    width: "100%",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    borderBottom: "4px solid #EAEAEA",
                    p: "auto",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-cell": {
                    p: "auto",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  },

                  "& .MuiButtonBase-root ": {
                    backgroundColor: "rgba(171, 117, 149, 0.9)",
                    borderRadius: "2px",
                    mr: 2,
                    p: "0px",
                    height: "30px",
                  },
                  "& .Mui-disabled ": {
                    backgroundColor: "rgba(171, 117, 149, 0.5)",
                    borderRadius: "2px",
                    mr: 2,
                    p: "0px",
                    height: "30px",
                  },
                }}
              />
              <FaArrowCircleRight
                style={{
                  position: "absolute",
                  left: -30,
                  top: 110,
                  height: "32px",
                  width: "32px",
                  color: "#98c900",
                }}
              />
            </ThemeProvider>
          </Box>

          {/*   ------------------------------Table of winners--------------------------------------*/}

          <Box
            sx={{
              width: "540px",
              height: "500px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{ color: "#AB7595", fontSize: "22px", fontWeight: 600 }}
            >
              Winners ({" "}
              <span style={{ color: "black" }}>{numberOfWinners}</span> /{" "}
              <span style={{ color: "black" }}>{totalWinners}</span>)
            </span>

            <ThemeProvider theme={myTheme}>
              <DataGrid
                columns={columns}
                rows={winners}
                getRowId={(row) => row?.nin}
                hideFooterSelectedRowCount
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                getRowSpacing={(params) => ({
                  top: params.isFirstVisible ? 0 : 2,
                  bottom: params.isLastVisible ? 0 : 2,
                })}
                rowHeight={45}
                sx={{
                  [`& .${gridClasses.row}`]: {
                    bgcolor: grey[10],
                  },
                  ".MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                  "&.MuiDataGrid-root": {
                    border: "none",
                    backgroundColor: "white",
                    width: "100%",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    borderBottom: "4px solid #EAEAEA",
                    p: "auto",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-cell": {
                    p: "auto",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  },

                  "& .MuiButtonBase-root ": {
                    backgroundColor: "rgba(171, 117, 149, 0.9)",
                    borderRadius: "2px",
                    mr: 2,
                    p: "0px",
                    height: "30px",
                  },
                  "& .Mui-disabled ": {
                    backgroundColor: "rgba(171, 117, 149, 0.5)",
                    borderRadius: "2px",
                    mr: 2,
                    p: "0px",
                    height: "30px",
                  },
                }}
              />
            </ThemeProvider>
          </Box>
        </Stack>
      </Box>
    </div>
  );
};

export default Lottery;
