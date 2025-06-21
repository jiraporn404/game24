import { Box, Button, Typography } from "@mui/material";

const numPad = [
  [1, 2, 3, "+"],
  [4, 5, 6, "-"],
  [7, 8, 9, "*"],
  [",", 0, "pow", "/"],
  ["(", ")", "sqrt", "DEL"],
];

export default function NumPad({
  onButtonClick,
}: {
  onButtonClick: (button: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {numPad.map((row, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2 }}>
          {row.map((item, index) => (
            <Button
              key={index}
              variant="outlined"
              color={
                item === "DEL"
                  ? "error"
                  : item === "Clear"
                  ? "warning"
                  : "secondary"
              }
              size="large"
              sx={{
                width: "100%",
                height: "100%",
              }}
              disabled={item === ""}
              onClick={() => onButtonClick(item.toString())}
            >
              <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                {item}
              </Typography>
            </Button>
          ))}
        </Box>
      ))}
    </Box>
  );
}
