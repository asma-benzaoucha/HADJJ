import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import Person from "../../assets/Person-res.svg";
import Planes from "../../assets/Reservation.png";

const Flights = [
  {
    id: 1,
    flightName: "Flight 101",
    date: "2024-06-15",
    time: "10:00",
    availablePlaces: 0,
  },
  {
    id: 2,
    flightName: "Flight 202",
    date: "2024-06-16",
    time: "2:00 ",
    availablePlaces: 85,
  },
  {
    id: 3,
    flightName: "Flight 303",
    date: "2024-06-17",
    time: "6:00 ",
    availablePlaces: 150,
  },
];

const Reservation = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    setFlights(Flights);
  }, [flights]);

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    console.log("Selected flight: ", flight);
  };

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleReservation = () => {
    navigate("/Home/Reservation/Hotel");
  };

  return (
    <Box
      sx={{
        height: { xs: "1120px", md: "100%" },
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        style={{
          height: "120px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginLeft: "20px" }}>'something' airport</h1>
        <div style={{ flex: 1 }} />
        {selectedFlight && (
          <button
            onClick={handleReservation}
            className="button"
            style={{
              marginRight: "40px",
              height: "46px",
              width: "140px",
              borderRadius: 30,
            }}
          >
            Reservation
          </button>
        )}
        <button
          onClick={handleLogOut}
          className="button"
          style={{
            marginRight: "40px",
            height: "46px",
            width: "140px",
            borderRadius: 30,
          }}
        >
          Log Out
        </button>
      </Box>
      <Box
        sx={{
          px: { xs: 2, sm: 0, md: 14 },
          display: "flex",
          gap: "60px",
          justifyContent: "space-between",
          alignItems: "center",
          height: { xs: "1000px", md: "calc(100% - 120px)" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/*   ------------------------------List of Flights--------------------------------------*/}
        <List
          sx={{
            maxHeight: "300px",
            width: { xs: "80%", sm: "60%", md: "50%", lg: "45%" },
            overflow: "auto",
            boxShadow: "5px 5px 5px #ab7595",
            borderRadius: "20px",
          }}
        >
          <ListItem
            sx={{
              width: "440px",
              bgcolor: "white",
              borderBottom: "2px solid #DFDFDF",
              p: 0,
              height: "50px",
              "& .MuiTypography-root": {
                fontWeight: 500,
                color: "#343A40",
                textAlign: "center",
                fontSize: "14px",
              },
            }}
          >
            <ListItem sx={{ width: "100px" }}>
              <ListItemText primary="Flight" />
            </ListItem>
            <ListItem sx={{ width: "110px" }}>
              <ListItemText primary="Date" />
            </ListItem>
            <ListItem sx={{ width: "80px" }}>
              <ListItemText primary="Time" />
            </ListItem>
            <ListItem sx={{ width: "130px" }}>
              <ListItemText primary="Available seats" />
            </ListItem>
          </ListItem>

          {flights.map((flight) => (
            <ListItemButton
              key={flight?.id}
              onClick={() => handleSelectFlight(flight)}
              disabled={flight?.availablePlaces === 0}
              sx={{ p: 0 }}
            >
              <ListItem
                key={flight?.id}
                sx={{
                  bgcolor:
                    flight?.availablePlaces === 0
                      ? "#C1C1C1"
                      : selectedFlight && selectedFlight.id === flight.id
                      ? "#E7D9CA"
                      : "white",
                  borderTop: "1px solid #F3F3F3",
                  fontWeight: 600,
                  height: "50px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "450px",
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
                    width: "100px",
                    height: "50px",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                      color: flight?.availablePlaces === 0 ? "#000000" : "",
                    },
                  }}
                >
                  <ListItemText primary={flight?.flightName} />
                </ListItem>
                <ListItem
                  sx={{
                    height: "50px",
                    width: "110px",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                    },
                  }}
                >
                  <ListItemText primary={flight?.date} />
                </ListItem>
                <ListItem
                  sx={{
                    width: "80px",
                    color: "white",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                      borderRadius: "25px",
                      p: 1,
                      height: "25px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}
                >
                  <ListItemText primary={flight?.time} />
                </ListItem>
                <ListItem
                  sx={{
                    height: "50px",
                    width: "130px",
                    "& .MuiTypography-root": {
                      textAlign: "center",
                    },
                  }}
                >
                  <ListItemText primary={flight?.availablePlaces} />
                </ListItem>
              </ListItem>
            </ListItemButton>
          ))}
        </List>

        <Stack
          sx={{
            width: { xs: "80%", md: "30%" },
            height: "65%",
          }}
        >
          <img src={Person} alt="Person" />
          <img
            src={Planes}
            alt="Planes"
            style={{
              width: "200px",
              height: "100%",
              position: "absolute",
              right: "0",
              top: "0",
              zIndex: -1,
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default Reservation;
