import { Box, Stack } from "@mui/system";
import { Avatar } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Api/base";
import { createTheme, ThemeProvider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import NewDoctor from "./NewDoctor";
import Alert from "@mui/material/Alert";

const Doctors = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [fetched, setFetched] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [daysOff, setDaysOff] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertsuc, setAlertSuc] = useState(false);
  const [alertErr, setAlertErr] = useState(false);
  const [err, setErr] = useState("");

  const hideAlert = () => {
    setTimeout(() => {
      setAlertSuc(false);
      setAlertErr(false);
    }, 3000);
  };

  const renderSchedule = () => {
    if (!selectedUser) return null;

    if (selectedUser.availableTime) {
      return (
        <span
          style={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#A7A7A7",
          }}
        >
          {" "}
          {selectedUser.availableTime}
        </span>
      );
    } else {
      return <p>Data for available time not found</p>;
    }
  };

  //-----------Fetching doctors
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/accounts/get-medical-admins", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("fetch doctor response", response);

        const formattedData = response.data.map((admin) => ({
          profile_pic: admin.profile_pic,
          id: admin.user.id,
          name: `${admin.user.first_name} ${admin.user.last_name}`,
          gender: admin.user.gender,
          wilaya: admin?.wilaya?.name,
          number: admin?.wilaya?.id, // You need to specify how to get the number for each admin
          email: admin.user.email,
          days_off: admin.work_schedule,
          availableTime: admin.work_schedule[0]?.times,
        }));

        setDoctors(formattedData);
        console.log("the admin new data", doctors);
        setFetched(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAdmins();

    console.log("deleted in the fetch doctor", deleted);
  }, [isModalOpen, deleted]);

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

  const handleSelectionChange = (newSelection) => {
    // Retrieve the selected user object from the users array
    const selectedUserData =
      newSelection.length > 0
        ? doctors?.find((user) => user.id === newSelection[0])
        : null;
    setSelectedUser(selectedUserData);
    console.log(selectedUserData);
  };

  /*-----------------------------*/

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
      {
        field: "name",
        headerName: "Name",
        width: 150,
      },
      {
        field: "gender",
        headerName: "Gender",
        width: 80,
      },
      {
        field: "email",
        headerName: "Email",
        width: 220,
        sortable: false,
      },

      {
        field: "days_off",
        headerName: "Days off",
        width: 130,
        renderCell: (params) => {
          const allDays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const workDays = params.row.days_off.map((day) => day.day);
          const daysOff = allDays.filter((day) => !workDays.includes(day));
          setDaysOff(daysOff.join(", "));
          return daysOff.join(", ");
        },
      },
    ],
    []
  );

  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [ConfirmDeletion, setConfirmDeletion] = useState(false);

  const confirmDelete = () => {
    setConfirmDeletion(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log("doctor to delete is ", selectedUser.id);

    try {
      const response = await axios.delete(
        `/accounts/delete-medical-admin/${selectedUser.id}/`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200 && response.data.success) {
        setAlertSuc(true);
        setErr("Doctor deleted successfully");
        hideAlert();
        setDeleted(!deleted);
      }
    } catch (error) {
      setAlertErr(true);
      setErr("Error deleting Doctor");
      hideAlert();
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

      <Box sx={{ height: "80%", width: "100%" }}>
        <Box
          sx={{
            height: "150px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            px: 2,
          }}
        >
          <Stack direction={"row"} spacing={2}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: "#121843",
                height: "36px",
                width: isSmallScreen ? "100px" : "130px",
                fontSize: isSmallScreen ? "10px" : "16px",
                borderRadius: 20,
                fontWeight: "normal",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0px 15px",
              }}
              className="button"
            >
              Add new
              <AddIcon />
            </button>
            {selectedUser && (
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: "#121843",
                  height: "36px",
                  width: isSmallScreen ? "90px" : "110px",
                  fontSize: isSmallScreen ? "10px" : "16px",
                  borderRadius: 20,
                  fontWeight: "normal",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0px 15px",
                }}
                className="button"
              >
                Delete
                <RemoveIcon />
              </button>
            )}
          </Stack>
          <div style={{ flex: 1 }} />

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
        </Box>
        <Stack
          sx={{
            height: { xs: "800px", md: "100%" },
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
                loading={!fetched}
                columns={columns}
                onRowSelectionModelChange={handleSelectionChange}
                rows={doctors}
                getRowId={(row) => row.id}
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
                <Avatar
                  alt={selectedUser?.name}
                  src={`data:image/png;base64,${selectedUser?.profile_pic}`}
                  sx={{
                    width: { xs: 150, md: 120, lg: 196 },
                    height: { xs: 150, md: 120, lg: 196 },
                    border: "3px solid #9B9B9C",
                  }}
                />
                <span style={{ fontWeight: 600, fontSize: "16px" }}>
                  {selectedUser?.name}
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
                  {localStorage.getItem("wilaya")}
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
                      Days off
                    </span>
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "#A7A7A7",
                      }}
                    >
                      {daysOff}
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
                  Aailable times
                </span>
                {renderSchedule()}
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
          <NewDoctor onClose={handleCloseModal} />
        </Box>
      )}
      {ConfirmDeletion && (
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
          <Box
            sx={{
              position: "absolute",
              transform: "translate(-50%,-50%)",
              left: "50%",
              top: "50%",
              width: {
                xs: "95%",
                sm: "500px",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "auto",
              p: { xs: 1, sm: 2 },
              borderRadius: 10,
              backgroundColor: "rgba(255, 255, 255, 1)",
              maxHeight: "95%",
              gap: "20px",
            }}
          >
            <h2> Delete Doctor</h2>
            <CloseIcon
              onClick={() => {
                setConfirmDeletion(false);
              }}
              sx={{
                position: "absolute",
                top: "24px",
                right: "24px",
                cursor: "pointer",
                ":hover": { color: "red" },
              }}
            />
            <span>
              Are you sure that you want to delete {selectedUser.name} ?
            </span>
            <form
              className="auth-form Login-form"
              style={{
                width: isSmallScreen ? "90%" : "400px",
                borderRadius: "10px",
                padding: "20px",
              }}
              onSubmit={(e) => {
                e.preventDefault;
              }}
            >
              <div className="sub-but">
                <button
                  className="button"
                  onClick={(e) => {
                    setConfirmDeletion(false);
                    handleDelete(e);
                  }}
                  style={{ width: "200px" }}
                >
                  Confirm
                </button>
              </div>
            </form>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Doctors;
