import {
  Box,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  modalClasses,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "../Api/base";
import Arrow from "../assets/Arrow.png";
import EditSeats from "./EditSeats";

const Grouping = () => {
  const x = parseInt(localStorage.getItem("seats"));
  console.log("seats", x);
  const navigate = useNavigate();
  const theme = useTheme();

  const [clicked, setClicked] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMunicipals, setSelectedMunicipals] = useState([]);
  const [municipals, setMunicipals] = useState([]);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [extra_seats, setExtraSeats] = useState(0);
  const [addedSeats, setAddedSeats] = useState(0);
  const accessToken = localStorage.getItem("accessToken");

  const handleSelectMunicipal = (municipal) => {
    const municipalObject = {
      id: municipal.id,
      name: municipal.name,
      population: municipal.population,
      seats: municipal.seats,
      lottery_done: municipal.lottery_done,
    };

    const isSelected = selectedMunicipals.some(
      (item) => item.id === municipal.id
    );

    if (isSelected) {
      const updatedSelection = selectedMunicipals.filter(
        (item) => item.id !== municipal.id
      );
      setTotalPopulation(totalPopulation - municipal.population);
      setTotalSeats(totalSeats - municipal.seats);
      setSelectedMunicipals(updatedSelection);
    } else {
      setSelectedMunicipals([...selectedMunicipals, municipalObject]);
      setTotalPopulation(totalPopulation + municipal.population);
      setTotalSeats(totalSeats + municipal.seats);
    }
  };
  //fetch municipals
  const state = localStorage.getItem("wilaya_id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/lottery/municipals", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("response", response.data);
        const mun = response.data.municipals;
        setExtraSeats(response.data.extra_seats);

        const fetchedMun = mun.map((item) => ({
          id: item.id,
          name: item.name,
          lottery_done: item.is_lottery_done,
          population: item.population,
          seats: item.seats,
        }));
        setMunicipals(fetchedMun);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [state]);

  console.log("selectedMunicipals", selectedMunicipals);

  console.log("municipals", municipals);

  const handleConfirm = () => {
    const mun_ids = {
      municipals: selectedMunicipals.map((municipal) => municipal.id),
    };
    const mun_names = {
      municipals: selectedMunicipals.map((municipal) => municipal.name),
    };
    localStorage.setItem("municipals_names", JSON.stringify(mun_names));
    localStorage.setItem("municipals_ids", JSON.stringify(mun_ids));

    //const output = JSON.parse(localStorage.getItem("municipals_ids"));
    navigate("/Admin/Lottery");
  };

  const handleCloseModal = () => {
    //setSelectedUser(null);
    setOpenModal(false);
  };

  const handleDataFromChild = (data) => {
    console.log("Data received from child:", data);
    setAddedSeats(data);
  };

  return (
    <>
      <Box sx={{ height: "100%", width: "100%" }}>
        <Box
          style={{
            height: "120px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              marginLeft: "20px",
              fontWeight: 600,
              fontSize: { xs: "14px", sm: "22px" },
            }}
          >
            {localStorage.getItem("wilaya")}&lsquo;s Municipal grouping
          </Typography>
          <div style={{ flex: 1 }} />

          {clicked && (
            <button
              onClick={handleConfirm}
              className="button"
              style={{
                marginRight: isSmallScreen ? "10px" : "30px",
                height: "46px",
                width: isSmallScreen ? "110px" : "140px",
                fontSize: isSmallScreen ? "10px" : "18px",
                borderRadius: 30,
              }}
            >
              Confirm
            </button>
          )}

          {selectedMunicipals.length >= 1 && !clicked && (
            <button
              onClick={() => {
                setClicked(true);
              }}
              className="button"
              style={{
                marginRight: isSmallScreen ? "10px" : "30px",
                height: "46px",
                width: isSmallScreen ? "110px" : "140px",
                fontSize: isSmallScreen ? "10px" : "18px",
                borderRadius: 30,
              }}
            >
              Group
            </button>
          )}

          {clicked && (
            <button
              onClick={() => {
                setClicked(false);
                setSelectedMunicipals([]);
              }}
              className="button"
              style={{
                backgroundColor: "rgba(231, 217, 202, 0.6)",
                marginRight: isSmallScreen ? "10px" : "30px",
                height: "46px",
                width: isSmallScreen ? "110px" : "140px",
                fontSize: isSmallScreen ? "10px" : "18px",
                borderRadius: 30,
                color: "black",
                fontWeight: "bold",
                border: "1px solid black",
              }}
            >
              Cancel
            </button>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "60px",
            justifyContent: clicked ? "center" : "",
            alignItems: clicked ? "center" : "",
          }}
        >
          {/*   ------------------------------List of municipals--------------------------------------*/}
          <List
            sx={{
              height: "550px",
              width: "550px",
              overflow: "auto",
              paddingRight: "2px",
            }}
          >
            <ListItem
              sx={{
                width: "500px",
                bgcolor: "white",
                borderBottom: "2px solid #DFDFDF",
                p: 0,
                height: "50px",
                "& .MuiTypography-root": {
                  fontWeight: 600,
                  color: "#343A40",
                  textAlign: "center",
                },
              }}
            >
              <ListItem sx={{ width: "180px" }}>
                <ListItemText primary="Municipal" />
              </ListItem>
              <ListItem sx={{ width: "100px" }}>
                <ListItemText primary="Population" />
              </ListItem>
              <ListItem sx={{ width: "120px" }}>
                <ListItemText primary="Status" />
              </ListItem>
              <ListItem sx={{ width: "100px" }}>
                <ListItemText primary="Seats" />
              </ListItem>
            </ListItem>
            {municipals.map((municipal) => (
              <ListItem
                key={municipal?.id}
                disabled={municipal?.lottery_done}
                sx={{
                  bgcolor: municipal?.selected
                    ? "#E7D9CA"
                    : selectedMunicipals.some(
                        (item) => item.id === municipal.id
                      )
                    ? "#E7D9CA"
                    : "white",
                  borderTop: "1px solid #F3F3F3",
                  fontWeight: 600,
                  height: "50px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "500px",
                  p: 0,
                  "& .MuiTypography-root": {
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#6C757D",
                  },
                }}
              >
                <ListItem
                  sx={{
                    width: "180px",
                    height: "50px",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                      color: municipal?.lottery_done ? "#000000" : "",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSelectMunicipal(municipal)}
                    disabled={municipal?.lottery_done}
                  >
                    <ListItemText primary={municipal?.name} />
                  </ListItemButton>
                </ListItem>
                <ListItem
                  sx={{
                    height: "50px",
                    width: "100px",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                    },
                  }}
                >
                  <ListItemText primary={municipal?.population} />
                </ListItem>
                <ListItem
                  sx={{
                    width: "120px",
                    color: "white",
                    "& .MuiTypography-root": {
                      color: "white",
                      textAlign: "center",
                      bgcolor: municipal?.lottery_done ? "#067C27" : "#121843",
                      borderRadius: "25px",
                      p: 1,
                      height: "25px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}
                >
                  <ListItemText
                    primary={municipal?.lottery_done ? "grouped" : "Not yet"}
                  />
                </ListItem>
                <ListItem
                  sx={{
                    height: "50px",
                    width: "100px",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                    },
                  }}
                >
                  <ListItemText primary={municipal?.seats} />
                </ListItem>
              </ListItem>
            ))}
          </List>

          {clicked && (
            <img src={Arrow} style={{ height: "150px", width: "100px" }} />
          )}

          {clicked && (
            <Box sx={{ position: "relative" }}>
              <button
                style={{
                  position: "absolute",
                  top: -50,
                  borderRadius: "15px",
                  fontSize: "16px",
                  fontWeight: "normal",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",
                  backgroundColor: "#121843",
                  color: "white",
                  cursor: "pointer",
                  border: "none",
                }}
                onClick={() => setOpenModal(true)}
              >
                Edit seats
              </button>
              <List
                sx={{
                  width: "400px",
                  overflow: "auto",
                  maxHeight: "80%",
                  paddingRight: "14px",
                  boxShadow: "5px 5px 5px #ab7595",
                  borderRadius: "15px",
                }}
              >
                <ListItem
                  sx={{
                    bgcolor: "white",
                    height: "50px",
                    width: "100%",

                    p: 0,
                    "& .MuiTypography-root": {
                      fontWeight: 600,
                      color: "#343A40",
                    },
                  }}
                >
                  <ListItem sx={{ width: "40%" }}>
                    <ListItemText primary="Municipal" />
                  </ListItem>
                  <ListItem sx={{ width: "30%" }}>
                    <ListItemText primary="Population" />
                  </ListItem>
                  <ListItem sx={{ width: "30%" }}>
                    <ListItemText primary="Seats" />
                  </ListItem>
                </ListItem>
                {selectedMunicipals.map((municipal) => (
                  <ListItem
                    key={municipal?.id}
                    sx={{
                      bgcolor: municipal?.selected
                        ? "#E7D9CA"
                        : selectedMunicipals.includes(municipal.id)
                        ? "#E7D9CA"
                        : "white",
                      borderTop: "1px solid #F3F3F3",
                      fontWeight: 600,
                      height: "50px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      p: 0,

                      "& .MuiTypography-root": {
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "#6C757D",
                      },
                    }}
                  >
                    <ListItem
                      sx={{
                        width: "40%",
                        height: "50px",
                      }}
                    >
                      <ListItemText primary={municipal?.name} />
                    </ListItem>
                    <ListItem
                      sx={{
                        height: "50px",
                        width: "30%",
                      }}
                    >
                      <ListItemText primary={municipal?.population} />
                    </ListItem>
                    <ListItem
                      sx={{
                        height: "50px",
                        width: "30%",
                      }}
                    >
                      <ListItemText primary={municipal?.seats} />
                    </ListItem>
                  </ListItem>
                ))}
                <ListItem
                  sx={{
                    bgcolor: "white",
                    height: "50px",
                    width: "100%",

                    p: 0,
                    "& .MuiTypography-root": {
                      fontWeight: 600,
                      color: "#343A40",
                    },
                  }}
                >
                  <ListItem sx={{ width: "40%" }}>
                    <ListItemText primary="Total" />
                  </ListItem>
                  <ListItem sx={{ width: "30%" }}>
                    <ListItemText primary={totalPopulation} />
                  </ListItem>
                  <ListItem sx={{ width: "30%" }}>
                    <ListItemText
                      primary={`${totalSeats} ${
                        addedSeats ? `+ ${addedSeats}` : ""
                      }`}
                    />
                  </ListItem>
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Box>

      {openModal && (
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
          <EditSeats
            onClose={handleCloseModal}
            seats={extra_seats}
            total={totalSeats}
            onData={handleDataFromChild}
          />
        </Box>
      )}
    </>
  );
};

export default Grouping;
