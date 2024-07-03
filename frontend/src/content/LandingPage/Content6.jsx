import { Stack } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

const Content6 = () => {
  const [arrow, setArrow] = useState(0);
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        mb: 4,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "32px", marginBottom: "80px" }}>
        Frequently <span style={{ color: "#AB7595" }}>Asked</span> Questions
      </span>
      {/* --------------------- First ligne ------------------------------*/}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          width: "100%",
          pl: "10%",
        }}
      >
        {arrow !== 1 ? (
          <ArrowRightIcon
            onClick={() => setArrow(1)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          How does the draw process work for the selection of pilgrims ?
        </span>
      </Stack>
      {arrow === 1 && (
        <span
          style={{
            fontWeight: 400,
            fontSize: "14px",
            marginLeft: "10%",
            borderLeft: "2px solid #AB7595",
            paddingLeft: "20px",
          }}
        >
          The draw process ensures fairness among all participants by employing
          a carefully crafted algorithm. For each group of municipalities, a
          predetermined number of candidates are selected, gradually
          accumulating the total pilgrims for the year. This process accounts
          for various factors such as age and the number of previous
          participations by the candidates, ensuring an equitable selection
          process
        </span>
      )}

      {/* --------------------- Second ligne ------------------------------*/}

      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          pl: "10%",
          width: "100%",
        }}
      >
        {arrow !== 2 ? (
          <ArrowRightIcon
            onClick={() => setArrow(2)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          Is the draw process transparent?
        </span>
      </Stack>

      {/* --------------------- Third ligne ------------------------------*/}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          pl: "10%",
          width: "100%",
        }}
      >
        {arrow !== 3 ? (
          <ArrowRightIcon
            onClick={() => setArrow(3)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          What criteria are taken into account in the draw for the Hajj ?
        </span>
      </Stack>

      {/* --------------------- Fourth ligne ------------------------------*/}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          pl: "10%",
          width: "100%",
        }}
      >
        {arrow !== 4 ? (
          <ArrowRightIcon
            onClick={() => setArrow(4)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          What should I do in the event of a non-selection?
        </span>
      </Stack>

      {/* --------------------- Fifth ligne ------------------------------*/}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          pl: "10%",
          width: "100%",
        }}
      >
        {arrow !== 5 ? (
          <ArrowRightIcon
            onClick={() => setArrow(5)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          Are there any guidelines for participants to follow during the draw
          registration?
        </span>
      </Stack>

      {/* --------------------- Sixth ligne ------------------------------*/}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          pl: "10%",
          width: "100%",
        }}
      >
        {arrow !== 6 ? (
          <ArrowRightIcon
            onClick={() => setArrow(6)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          Is there a limit on the number of participants selected from each
          region in the draw?
        </span>
      </Stack>

      {/* --------------------- Seventh ligne ------------------------------*/}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          pl: "10%",
          width: "100%",
        }}
      >
        {arrow !== 7 ? (
          <ArrowRightIcon
            onClick={() => setArrow(7)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        ) : (
          <ArrowDropDownIcon
            onClick={() => setArrow(0)}
            sx={{
              color: "#AB7595",
              fontSize: 50,
              cursor: "pointer",
              ":hover": { color: "#ac5f82" },
            }}
          />
        )}
        <span style={{ fontWeight: 600, fontSize: "16px" }}>
          Are there any special considerations for families participating in the
          draw together?
        </span>
      </Stack>
    </Stack>
  );
};

export default Content6;
