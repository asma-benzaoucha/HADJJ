import { Box, Stack } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { purple } from "@mui/material/colors";
import { useRef, useState, useEffect } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "../../Api/base";
import { CiTimer } from "react-icons/ci";
import { TiCalendar } from "react-icons/ti";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { TbCalendarFilled } from "react-icons/tb";
import NewSeason from "./NewSeason";
import Alert from "@mui/material/Alert";

const dataRes = [
  {
    id: 1,
    name: "No data yet",
    pahses: ["No data yet "],
  },
];

const Season = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertsuc, setAlertSuc] = useState(false);
  const [alertErr, setAlertErr] = useState(false);
  const [alertInfo, setAlertInfo] = useState(false);
  const [err, setErr] = useState("");
  const hideAlert = () => {
    setTimeout(() => {
      setAlertSuc(false);
      setAlertErr(false);
      setAlertInfo(false);
    }, 2000);
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const response = await axios.get("/pilgrimage/all", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
          },
        });

        setData(response.data);
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Errorrr:", error);
        setAlertErr(true);
        setErr("Cannot get seasons, please try again later");
        hideAlert();
      }
    };

    fetchData(); // Call the async function to execute it
  }, [isModalOpen]);

  useEffect(() => {
    if (data) {
      setSelectedItem(data[0]);
    }
  }, [data]);

  const handleSeasonFinished = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "/pilgrimage/finished",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        if (response?.data?.message) {
          setErr(response.data.message);
          setAlertInfo(true);
          hideAlert();
        } else {
          setAlertSuc(true);
          setErr("Season finished successfully");
          hideAlert();
        }
      }
    } catch (error) {
      setAlertErr(true);
      setErr("error");
      hideAlert();
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const elementRef1 = useRef(null); // Ref for the first container
  const elementRef2 = useRef(null);

  const [arrowDisable, setArrowDisable] = useState(true);
  const [selectedItem, setSelectedItem] = useState(data ? data[0] : dataRes[0]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleHorizontalScroll = (element, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
      if (element.scrollLeft <= 0) {
        setArrowDisable(true);
      } else {
        setArrowDisable(false);
      }
    }, speed);
  };

  return (
    <>
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
          style={{
            height: "120px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button className="Finished-button" onClick={handleSeasonFinished}>
            Finish season
          </button>

          <button
            className="button"
            style={{
              marginRight: "40px",
              height: "46px",
              width: "140px",
              borderRadius: 30,
            }}
            onClick={handleOpenModal}
          >
            New season
          </button>
          <NotificationsNoneIcon
            style={{ color: purple[200] }}
            sx={{ fontSize: 40, marginRight: "20px", cursor: "pointer" }}
          />
        </Box>

        <Box
          sx={{
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Center the content horizontally
            alignItems: "center",
            gap: { xs: "80px", md: "40px" },
          }}
        >
          <Box
            sx={{
              width: { xs: "95%", md: "85%", lg: "75%" },
              height: "200px",
              margin: "auto",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <button
              className="season-scroll-button"
              onClick={() => {
                handleHorizontalScroll(elementRef1.current, 25, 100, -225);
              }}
              //disabled={arrowDisable}
            >
              <ArrowBackIosNewIcon style={{ color: "white" }} />
            </button>

            <div className="season-container" ref={elementRef1}>
              {data.map((item) => (
                <div
                  key={item.year}
                  className="season-box1"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="Season-year">
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        margin: "auto",
                        alignItems: "center",
                        mb: 1,
                        position: "relative",
                        top: "8px",
                      }}
                    >
                      <TiCalendar color="#AB7595" size={24} />
                      <p
                        style={{
                          fontWeight: 500,
                          marginLeft: "16px",
                        }}
                      >
                        {item.year}
                      </p>
                    </Stack>
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "80%",
                      mt: 3,
                      ml: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "rgba(0, 0, 0, 0.43)",
                        fontWeight: 400,
                        fontSize: "14px",
                        height: "30%",
                      }}
                    >
                      <p>{item.total_pilgrims} piligrims</p>
                      {item.is_active ? <p>active</p> : <p>inactive</p>}
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "rgba(0, 0, 0, 0.43)",
                        fontWeight: 400,
                        fontSize: "14px",
                        height: "30%",
                      }}
                    >
                      <p
                        style={{
                          color: "black",
                          fontWeight: 500,
                        }}
                      >
                        Inscription deadline
                      </p>
                      <p>{item.inscription_deadline}</p>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "rgba(0, 0, 0, 0.43)",
                        fontWeight: 400,
                        fontSize: "14px",
                        height: "30%",
                      }}
                    >
                      <p
                        style={{
                          color: "black",
                          fontWeight: 500,
                        }}
                      >
                        Procedure deadline
                      </p>
                      <p>{item.procedure_deadline}</p>
                    </Stack>
                  </Box>

                  <div className="Season-phases">
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "16px",
                        position: "relative",
                        bottom: "8px",
                      }}
                    >
                      <CiTimer style={{ color: "#AB7595" }} />
                      <p
                        style={{
                          fontWeight: 400,
                          color: "rgba(0, 0, 0, 0.43)",
                          fontSize: "14px",
                        }}
                      >
                        {item.phases.length} phases
                      </p>
                    </Stack>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="season-scroll-button"
              onClick={() => {
                handleHorizontalScroll(elementRef1.current, 25, 100, 225);
              }}
            >
              <ArrowForwardIosIcon style={{ color: "white" }} />
            </button>
          </Box>
          <Box
            sx={{
              width: { xs: "85%", md: "70%", lg: "50%" },
              height: "25%",
              margin: "auto",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <button
              style={{ width: "45px" }}
              className="season-scroll-button"
              onClick={() => {
                handleHorizontalScroll(elementRef2.current, 25, 100, -225);
              }}
              //disabled={arrowDisable}
            >
              <ArrowBackIosNewIcon style={{ color: "white" }} />
            </button>

            <div className="season-container" ref={elementRef2}>
              {selectedItem?.phases?.map((phaseItem) => (
                <div key={phaseItem.phase_number} className="season-box2">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "90%",
                      width: "90%",
                      margin: "auto",
                    }}
                  >
                    <span
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      Phase n° {phaseItem.phase_number}
                    </span>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "space-between",
                          color: "rgba(0, 0, 0, 0.43)",
                          fontWeight: 400,
                          fontSize: "12px",
                          height: "30%",
                        }}
                      >
                        <TbCalendarFilled size={18} color="#AB7595" />

                        <p
                          style={{
                            color: "black",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          Start date:
                        </p>
                        <p>{phaseItem.start_date}</p>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={0}
                        sx={{
                          mb: 1,
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "space-between",
                          color: "rgba(0, 0, 0, 0.43)",
                          fontWeight: 400,
                          fontSize: "12px",
                          height: "30%",
                        }}
                      >
                        <IoCalendarNumberOutline size={16} color="#AB7595" />
                        <p
                          style={{
                            color: "black",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          End date:
                        </p>
                        <p>{phaseItem.end_date}</p>
                      </Stack>
                    </Box>
                  </Box>
                </div>
              ))}
            </div>

            <button
              className="season-scroll-button"
              style={{ width: "8%" }}
              onClick={() => {
                handleHorizontalScroll(elementRef2.current, 25, 100, 225);
              }}
            >
              <ArrowForwardIosIcon style={{ color: "white" }} />
            </button>
          </Box>
        </Box>
      </Box>

      {isModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "999",
            backgroundColor: "rgba(61, 61, 61, 0.22)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NewSeason onClose={handleCloseModal} />
        </Box>
      )}
    </>
  );
};
export default Season;
