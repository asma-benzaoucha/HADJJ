import { Box, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { useState, useEffect, useMemo } from "react";
import axios from "../Api/base";
const screenHeight = window.innerHeight;

const WinnersTable = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [winners, setWinners] = useState([]);
  const [reserve, setReserve] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/lottery/winners", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("response of winners", response.data);
        setWinners(response?.data?.winners);
        setReserve(response?.data?.reserve);
        setFetched(true);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
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
      {
        field: "first_name",
        headerName: "First name",
        width: 160,
        renderCell: (params) => `${params.row.first_name}`,
      },
      {
        field: "last_name",
        headerName: "Last name",
        width: 160,
        renderCell: (params) => `${params.row.last_name}`,
      },
      { field: "nin", headerName: "NIN", width: 180 },
    ],
    []
  );

  return (
    <div className="lottery-body">
      <Stack
        direction={{ sm: "column", md: "row" }}
        spacing={2}
        sx={{
          width: "100%",
          height: { xs: "1100px", md: `${screenHeight}px` },
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
          <span style={{ color: "#AB7595", fontSize: "22px", fontWeight: 600 }}>
            Winners
          </span>

          <ThemeProvider theme={myTheme}>
            <DataGrid
              columns={columns}
              rows={winners}
              loading={!winners || !fetched}
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
          <span style={{ color: "#AB7595", fontSize: "22px", fontWeight: 600 }}>
            Reserve
          </span>

          <ThemeProvider theme={myTheme}>
            <DataGrid
              columns={columns}
              rows={reserve}
              loading={!reserve || !fetched}
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
    </div>
  );
};

export default WinnersTable;
