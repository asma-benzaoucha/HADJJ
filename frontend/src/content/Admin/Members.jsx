import { Box, Stack } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey, purple } from "@mui/material/colors";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useMemo, useState, useEffect } from "react";
import AvatarGroup from "@mui/material/AvatarGroup";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";
import axios from "../../Api/base";
import UserValidation from "./UserValidation";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, createTheme, ThemeProvider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Members = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const response = await axios.get("/accounts/users", {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
          },
        });
        console.log(response);
        setData(response.data);
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

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

  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectionChange = (newSelection) => {
    // Retrieve the selected user object from the users array
    const selectedUserData =
      newSelection.length > 0
        ? data?.find((user) => user.nin === newSelection[0])
        : null;
    setSelectedUser(selectedUserData);
    console.log(selectedUserData);
  };

  /*people from same phase */
  const renderAvatarGroup = () => {
    if (!selectedUser) return null;

    const usersInSamePhase = data?.filter(
      (user) => user.phase === selectedUser.phase
    );

    if (usersInSamePhase.length > 1) {
      return (
        <AvatarGroup total={usersInSamePhase.length}>
          {usersInSamePhase.map((user, index) => (
            <Avatar
              key={index}
              alt={user.fullName}
              src={`data:image/png;base64,${user?.profile_pic}`}
            />
          ))}
        </AvatarGroup>
      );
    } else {
      return <p>No other users from the same phase</p>;
    }
  };

  /*-----------------------------*/
  const getColor = (phase) => {
    switch (phase) {
      case "Inscription":
        return "#121843";
      case "Lottery":
        return "#7C0D06";
      case "Med visit":
        return "#E8CBAB";
      case "Payment":
        return "#817F7A";
      case "Reservation":
        return "purple";
      default:
        return "transparent";
    }
  };
  const getColorphase_status = (value) => {
    switch (value) {
      case "Pending":
        return "grey";
      case "Confirmed":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "black";
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "profile_pic",
        headerName: "Profile",
        width: 90,
        renderCell: (params) => (
          <Avatar
            alt={params.row.fullName}
            src={`data:image/png;base64,${params.row.profile_pic}`} // Assuming the image format is PNG
          />
        ),
        sortable: false,
        filterable: false,
      },
      { field: "nin", headerName: "NIN", width: 100 },
      { field: "first_name", headerName: "First name", width: 150 },
      { field: "last_name", headerName: "Last name", width: 150 },
      {
        field: "gender",
        headerName: "Gender",
        width: 80,
        type: "singleSelect",
        valueOptions: ["Male", "Female"],
        sortable: false,
      },
      { field: "birth_date", headerName: "Birth date", width: 150 },
      { field: "email", headerName: "Email", width: 200, sortable: false },
      { field: "municipal", headerName: "Municipal", width: 150 },
      {
        field: "phase",
        headerName: "Phase",
        width: 100,
        renderCell: (params) => (
          <Box
            sx={{
              backgroundColor: getColor(params.row.phase),
              color: "white",
              fontWeight: "medium",
              fontSize: "13px",
              px: "10px",
              py: "2px",
              width: "100%",
              height: "60%",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.row.phase}
          </Box>
        ),
        sortable: false,
      },
      {
        field: "phase_status",
        headerName: "Status",
        width: 100,
        type: "singleSelect",
        valueOptions: ["Pending", "Accepted", "Refused"],
        renderCell: (params) => (
          <Box
            sx={{
              color: getColorphase_status(params.row.phase_status),
              fontWeight: 600,
              width: "100%",
              height: "60%",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.row.phase_status}
          </Box>
        ),
        sortable: false,
      },
      { field: "contact", headerName: "Contact", width: 130 },
      {
        field: "participation_number",
        headerName: "Participation Number",
        width: 130,
        align: "center",
      },
    ],
    []
  );

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    //setSelectedUser(null);
    setIsModalOpen(false);

    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      try {
        const response = await axios.get("/accounts/users", {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`, // Set the access token in the Authorization header
          },
        });
        console.log(response);
        setData(response.data);
      } catch (error) {
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };

    fetchData();
  };
  const handleValidateUser = () => {
    setIsModalOpen(true);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box sx={{ height: "80%", width: "100%" }}>
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
            Wilaya of {localStorage.getItem("wilaya")}
          </Typography>
          <div style={{ flex: 1 }} />
          {selectedUser?.phase === "Inscription" &&
            selectedUser?.phase_status === "Pending" && (
              <button
                onClick={handleValidateUser}
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
                Validate user
              </button>
            )}

          <button
            onClick={handleLogOut}
            className="button"
            style={{
              marginRight: isSmallScreen ? "10px" : "30px",
              height: "46px",
              width: isSmallScreen ? "110px" : "140px",
              fontSize: isSmallScreen ? "10px" : "18px",
              borderRadius: 30,
            }}
          >
            Log Out
          </button>
          <NotificationsNoneIcon
            style={{ color: purple[200] }}
            sx={{
              fontSize: { xs: "28px", sm: "40px" },
              marginRight: "20px",
              cursor: "pointer",
            }}
          />
        </Box>
        <Stack
          sx={{
            height: { xs: "1200px", md: "100%" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: { xs: "100%", md: selectedUser ? "75%" : "95%" },
            }}
          >
            <ThemeProvider theme={myTheme}>
              <DataGrid
                loading={data.length === 0}
                columns={columns}
                onRowSelectionModelChange={handleSelectionChange}
                rows={data}
                getRowId={(row) => row.nin}
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
          {selectedUser && (
            <Box
              sx={{
                borderLeft: "2px solid #AB7595",
                width: { xs: "100%", md: "25%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <CloseIcon
                onClick={() => {
                  setSelectedUser(null);
                }}
                sx={{
                  position: "absolute",
                  right: "20px",
                  bottom: "90%",
                  "&:hover": { cursor: "pointer", color: "red" },
                }}
              />
              <Stack
                spacing={1}
                direction={"column"}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  mt: { xs: 0, md: 6 },
                }}
              >
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  NIN: {selectedUser?.nin}
                </span>
                <Avatar
                  alt={selectedUser?.fullName}
                  src={`data:image/png;base64,${selectedUser?.profile_pic}`}
                  sx={{
                    width: 196,
                    height: 196,
                    border: "3px solid #9B9B9C",
                  }}
                />
                <span style={{ fontWeight: 600, fontSize: "16px" }}>
                  {selectedUser?.first_name} {selectedUser?.last_name}
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#A7A7A7",
                    position: "relative",
                    bottom: "8px",
                  }}
                >
                  {selectedUser?.municipal}
                </span>
                <Stack direction={"row"} spacing={2}>
                  <MailIcon
                    fontSize="medium"
                    sx={{
                      color: "#A7A7A7",
                      "&:hover": {
                        cursor: "pointer",
                        color: "grey",
                      },
                    }}
                  />
                  <PhoneIcon
                    fontSize="medium"
                    sx={{
                      color: "#A7A7A7",
                      "&:hover": {
                        cursor: "pointer",
                        color: "grey",
                      },
                    }}
                  />
                </Stack>
                <Stack direction={"row"} spacing={6}>
                  <Stack direction={"column"} spacing={"2px"}>
                    <span style={{ fontWeight: 600, fontSize: "12px" }}>
                      Age
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#A7A7A7",
                      }}
                    >
                      {calculateAge(selectedUser?.birth_date)}
                    </span>
                  </Stack>
                  <Stack direction={"column"} spacing={"2px"}>
                    <span style={{ fontWeight: 600, fontSize: "12px" }}>
                      Gender
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#A7A7A7",
                      }}
                    >
                      {selectedUser?.gender}
                    </span>
                  </Stack>
                </Stack>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>
                  People from the same phase
                </span>
                {renderAvatarGroup()}
              </Stack>
            </Box>
          )}
        </Stack>
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
          <UserValidation onClose={handleCloseModal} user={selectedUser} />
        </Box>
      )}
    </>
  );
};

export default Members;
