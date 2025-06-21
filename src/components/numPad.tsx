import { Box, Button, Typography } from "@mui/material";

const numPad = [
  [1, 2, 3, "+"],
  [4, 5, 6, "-"],
  [7, 8, 9, "*"],
  [",", "(", ")", "/"],
  ["pow", "sqrt", "=", "DEL"],
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
        <Box key={index} sx={{ display: "flex", gap: 1 }}>
          {row.map((item, index) => (
            <Button
              key={index}
              variant={item === "DEL" ? "contained" : "outlined"}
              color={
                item === "DEL"
                  ? "error"
                  : item === "="
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
              <Typography variant="h6">{item}</Typography>
            </Button>
          ))}
        </Box>
      ))}
    </Box>
  );
}
