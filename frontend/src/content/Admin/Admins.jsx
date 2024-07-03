import { Box, Stack } from "@mui/system";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Api/base";
import { Typography, createTheme, ThemeProvider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Gendericon from "../../assets/GenderIcon.png";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import Wilayaicon from "../../assets/WilayaIcon.png";
import Alert from "@mui/material/Alert";

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,26}$/;

const Admins = () => {
  const accessToken = localStorage.getItem("accessToken");

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

  const [refresh, setRefresh] = useState(false);
  const [addAdmin, setAddAdmin] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  //First name states
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  //Last name states
  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  //gender
  const [gender, setGender] = useState("");
  const [validGender, setValidGender] = useState(false);
  //State
  const [state, setState] = useState("");
  const [validState, setValidState] = useState(false);
  //State  options
  const [stateOptions, setStateOptions] = useState([]);
  const [data, setData] = useState([]);
  //Email states
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  //Password states
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  useEffect(() => {
    setValidGender(gender.length >= 1);
  }, [gender]);

  useEffect(() => {
    setValidFirstName(nameRegex.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(nameRegex.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidState(state);
  }, [state]);
  useEffect(() => {
    setValidEmail(emailPattern.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(passwordPattern.test(password));
  }, [password]);

  //-----------Fetching admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/accounts/admins/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data);

        const formattedData = response.data.map((admin) => ({
          id: admin.id,
          name: `${admin.first_name} ${admin.last_name}`,
          gender: admin.gender,
          wilaya: admin?.wilaya?.name,
          number: admin?.wilaya?.id, // You need to specify how to get the number for each admin
          email: admin.email,
        }));

        setData(formattedData);
        console.log("the admin new data", data);
      } catch (error) {
        setAlertErr(true);
        setErr("An error occurred, please try again later");
        hideAlert();
        console.error("Error:", error);
      }
    };
    fetchAdmins();
  }, [refresh]);

  const [ConfirmDeletion, setConfirmDeletion] = useState(false);

  const confirmDelete = () => {
    setConfirmDeletion(true);
  };

  //wilayas fetching------------------
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
        setAlertErr(true);
        setErr("An error occurred, please try again later");
        hideAlert();
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleWilaya = (e) => {
    setState(e.target.value);

    console.log(e.target.value);
  };
  //-------------

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGender(selectedGender === "male" ? "M" : "F");
  };

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
        ? data?.find((user) => user.email === newSelection[0])
        : null;
    setSelectedUser(selectedUserData);
    console.log(selectedUserData);
  };

  /*-----------------------------*/

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 160 },
      { field: "gender", headerName: "Gender", width: 80 },
      { field: "wilaya", headerName: "Wilaya", width: 150 },
      { field: "number", headerName: "N°", width: 70 },
      { field: "email", headerName: "Email", width: 220, sortable: false },
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
        setAlertErr(true);
        setErr("An error occurred, please try again later");
        hideAlert();
        // Handle network errors or Axios request errors
        console.error("Error:", error);
      }
    };

    fetchData();
  };
  const handleEditUser = () => {
    setIsModalOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log(state);
    try {
      const response = await axios.patch(
        `/accounts/admins/${selectedUser.id}/`,
        { wilaya: parseInt(state) },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        setAlertSuc(true);
        setErr("Admin wilaya updated successfully");
        hideAlert();
        setRefresh(!refresh);
        handleCloseModal();
      }
    } catch (error) {
      setAlertErr(true);
      setErr("An error occurred while updating the admin's wilaya");
      hideAlert();
      // Handle errors here
      console.error("Error:", error);
    }
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    setSubmitted(true);
    e.preventDefault();
    if (
      validFirstName &&
      validLastName &&
      validEmail &&
      validPassword &&
      validGender &&
      validState
    ) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        gender: gender,
        wilaya: parseInt(state),
      };
      console.log(data);

      try {
        const response = await axios.post(
          "/accounts/admins/new/",
          JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            gender,
            wilaya: parseInt(state),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data);
        console.log("here");

        if (response.status === 201 || response.status === 200) {
          // Success, navigate to the login page
          setAlertSuc(true);
          setErr("Admin added successfully");
          hideAlert();
          setAddAdmin(false);
          setRefresh(!refresh);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setGender("");
          setState("");
        }
      } catch (error) {
        setAlertErr(true);
        setErr("An error occurred while adding the admin");
        hideAlert();
        console.error("Error:", error);
      }
    } else {
      setAlertInfo(true);
      setErr("Please fill all the required fields");
      hideAlert();
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    console.log(selectedUser);

    try {
      const response = await axios.delete(
        `/accounts/admins/${selectedUser.id}/`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        setAlertSuc(true);
        setErr("Admin deleted successfully");
        hideAlert();
        setRefresh(!refresh);
      }
    } catch (error) {
      setAlertErr(true);
      setErr("An error occurred while deleting the admin");
      hideAlert();
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Box sx={{ height: "80%", width: "100%" }}>
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
          sx={{
            height: "150px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            px: 2,
          }}
        >
          <Stack direction={"column"} spacing={2}>
            <Typography
              sx={{
                marginLeft: "20px",
                fontWeight: 600,
                fontSize: { xs: "16px", sm: "28px" },
              }}
            >
              Admins Management
            </Typography>
            <Stack direction={"row"} spacing={2}>
              <button
                onClick={() => setAddAdmin(true)}
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
          </Stack>
          <div style={{ flex: 1 }} />
          {selectedUser && (
            <button
              onClick={handleEditUser}
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
              Edit
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
        </Box>
        <Stack
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            px: { xs: 2, md: 10 },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              height: "600px",
              width: { xs: "100%", md: "55%" },
            }}
          >
            <ThemeProvider theme={myTheme}>
              <DataGrid
                columns={columns}
                onRowSelectionModelChange={handleSelectionChange}
                rows={data}
                getRowId={(row) => row.email}
                hideFooterSelectedRowCount
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
                  "& .MuiDataGrid-footerContainer": {
                    display: "none",
                  },
                }}
              />
            </ThemeProvider>
          </Box>

          {addAdmin && (
            <Box
              sx={{
                height: "540px",
                borderRadius: "20px",
                width: { xs: "100%", md: "480px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: "20px", md: "38px" },
                bgcolor: "rgba(231, 217, 202, 0.5)",
                boxShadow: "4px 0 0 #AB7595, 0 4px 0 #AB7595",
              }}
            >
              <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
                Add New Admin
              </Typography>
              {/*---------------------------------------------form---------------------------*/}
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
                <div className="firstName-lastName">
                  <div
                    style={{ marginRight: "4px" }}
                    className={
                      !validFirstName && firstName && !firstNameFocus
                        ? "invalid-input"
                        : "input"
                    }
                  >
                    <Person2OutlinedIcon fontSize="medium" className="icon" />
                    <input
                      type="text"
                      placeholder="First name"
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setFirstNameFocus(true)}
                      onBlur={() => setFirstNameFocus(false)}
                      required
                    />
                  </div>

                  <div
                    className={
                      !validLastName && lastName && !lastNameFocus
                        ? "invalid-input"
                        : "input"
                    }
                  >
                    <Person2OutlinedIcon fontSize="medium" className="icon" />
                    <input
                      type="text"
                      placeholder="Last name"
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setLastNameFocus(true)}
                      onBlur={() => setLastNameFocus(false)}
                      required
                    />
                  </div>
                </div>

                {((!validLastName && lastName && !lastNameFocus) ||
                  (!validFirstName && firstName && !firstNameFocus)) && (
                  <div className="error-container">
                    <span className="error-msg">Please enter a valid name</span>
                  </div>
                )}

                <div
                  className={
                    !validGender && submitted ? "invalid-input" : "input"
                  }
                >
                  <img src={Gendericon} fontSize="medium" className="icon" />
                  <select
                    required
                    onChange={handleGenderChange}
                    style={{ width: "85%" }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div
                  className={
                    !validEmail && email && !emailFocus
                      ? "invalid-input"
                      : "input"
                  }
                >
                  <EmailOutlinedIcon fontSize="medium" className="icon" />
                  <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    required
                  />
                </div>
                {!validEmail && email && !emailFocus && (
                  <div className="error-container">
                    <span className="error-msg">
                      Please enter a valid Email
                    </span>
                  </div>
                )}

                <div
                  className={
                    !validPassword && password && !passwordFocus
                      ? "invalid-input"
                      : "input"
                  }
                >
                  <LockOutlinedIcon className="icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    required
                  />
                </div>
                {!validPassword && password && !passwordFocus && (
                  <div className="error-container">
                    <span className="error-msg">invalid password </span>
                  </div>
                )}

                {/* --------------- State selection ------------- */}

                <div
                  className={!validState && state ? "invalid-input" : "input"}
                >
                  <img src={Wilayaicon} fontSize="medium" className="icon" />
                  <select
                    required
                    className="custom-select"
                    onChange={handleWilaya}
                  >
                    <option value="">Select Wilaya</option>
                    {stateOptions.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
                {/*------------------------------------------------------*/}

                <div className="sub-but">
                  <button
                    className="button"
                    onClick={handleSubmit}
                    style={{ width: "200px" }}
                  >
                    Confirm
                  </button>
                </div>
              </form>
              {/*---------------------------------------------form---------------------------*/}
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
            <h2> Edit Admin</h2>
            <CloseIcon
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: "24px",
                right: "24px",
                cursor: "pointer",
                ":hover": { color: "red" },
              }}
            />
            <span>Edit Admin&lsquo;s wilaya</span>
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
              <div className={!validState && state ? "invalid-input" : "input"}>
                <img src={Wilayaicon} fontSize="medium" className="icon" />
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
              <div className="sub-but">
                <button
                  className="button"
                  onClick={handleEdit}
                  style={{ width: "200px" }}
                >
                  Confirm
                </button>
              </div>
            </form>
          </Box>
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
            <h2> Delete Admin</h2>
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

export default Admins;
