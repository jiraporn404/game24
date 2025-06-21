import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { evaluate } from "mathjs";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { generateNumbers } from "../utils/random";
import { isSolvable, isValidate24 } from "../utils/validate";
import NumPad from "./numPad";

const ButtonComponent = ({
  icon,
  text,
  onClick,
  color,
  variant,
  isFullWidth = false,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  variant: "outlined" | "contained";
  isFullWidth?: boolean;
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      size="large"
      fullWidth={isFullWidth}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {icon} <Typography variant="h6">{text}</Typography>
    </Button>
  );
};

export default function Game24() {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [numbers, setNumbers] = useState<number[]>(generateNumbers());
  const [expression, setExpression] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleNewGame = () => {
    setNumbers(generateNumbers());
    setExpression("");
    setCursorPosition(0);
    closeSnackbar();
  };

  const handleCheck = () => {
    enqueueSnackbar(
      <span style={{ fontSize: "1.25rem", position: "relative", top: "-8px" }}>
        {isValidate24(expression) ? "Correct!" : "Incorrect!"}
      </span>,
      { variant: isValidate24(expression) ? "success" : "error" }
    );
  };

  const handleClear = () => {
    setExpression("");
    setCursorPosition(0);
    closeSnackbar();
  };

  const handleEvaluate = () => {
    closeSnackbar();
    try {
      const evalResult = evaluate(expression);
      enqueueSnackbar(
        <span
          style={{ fontSize: "1.25rem", position: "relative", top: "-8px" }}
        >
          Result: <b>{evalResult.toString()}</b>
        </span>,
        { variant: "info" }
      );
    } catch (error) {
      enqueueSnackbar(
        <span
          style={{ fontSize: "1.25rem", position: "relative", top: "-8px" }}
        >
          Invalid expression
        </span>,
        { variant: "error" }
      );
    }
  };

  const handleSolve = () => {
    const result = isSolvable(numbers);
    enqueueSnackbar(
      <span style={{ fontSize: "1.25rem", position: "relative", top: "-8px" }}>
        {result ? "Solvable!" : "Unsolvable!"}
      </span>,
      { variant: result ? "success" : "error" }
    );
  };
  const handleButtonClick = (button: string) => {
    closeSnackbar();
    if (button === "DEL") {
      const beforeCursor = expression.slice(0, cursorPosition);
      const afterCursor = expression.slice(cursorPosition);

      if (beforeCursor.endsWith("sqrt(") && afterCursor.startsWith(")")) {
        setExpression(beforeCursor.slice(0, -5) + afterCursor.slice(1));
        setCursorPosition(cursorPosition - 5);
      } else if (beforeCursor.endsWith("pow(") && afterCursor.startsWith(")")) {
        setExpression(beforeCursor.slice(0, -4) + afterCursor.slice(1));
        setCursorPosition(cursorPosition - 4);
      } else if (beforeCursor.endsWith("(") && afterCursor.startsWith(")")) {
        setExpression(beforeCursor.slice(0, -1) + afterCursor.slice(1));
        setCursorPosition(cursorPosition - 1);
      } else if (beforeCursor.endsWith("sqrt") && afterCursor.startsWith("(")) {
        setExpression(beforeCursor.slice(0, -4) + afterCursor);
        setCursorPosition(cursorPosition - 4);
      } else if (beforeCursor.endsWith("pow") && afterCursor.startsWith("(")) {
        setExpression(beforeCursor.slice(0, -3) + afterCursor);
        setCursorPosition(cursorPosition - 3);
      } else {
        if (cursorPosition > 0) {
          setExpression(beforeCursor.slice(0, -1) + afterCursor);
          setCursorPosition(cursorPosition - 1);
        }
      }
    } else if (button === "=") {
      handleEvaluate();
    } else {
      const beforeCursor = expression.slice(0, cursorPosition);
      const afterCursor = expression.slice(cursorPosition);

      let insertText = button;
      let newCursorPosition = cursorPosition + button.length;

      if (button === "sqrt") {
        insertText = "sqrt(";
        newCursorPosition = cursorPosition + 5;
      } else if (button === "pow") {
        insertText = "pow(";
        newCursorPosition = cursorPosition + 4;
      }

      setExpression(beforeCursor + insertText + afterCursor);
      setCursorPosition(newCursorPosition);
    }
  };

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleTextFieldClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCursorPosition(target.selectionStart || 0);
  };

  const handleTextFieldKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCursorPosition(target.selectionStart || 0);
  };

  useEffect(() => {
    if (textFieldRef.current) {
      const input = textFieldRef.current.querySelector(
        "input"
      ) as HTMLInputElement;
      if (input) {
        input.setSelectionRange(cursorPosition, cursorPosition);
        input.focus();
      }
    }
  }, [expression, cursorPosition]);

  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{ width: "100%", height: "100%" }}
    >
      <Box sx={{ display: "flex", alignItems: "end", gap: 2 }}>
        <Box
          sx={{
            p: 2,
            border: `1px dashed ${theme.palette.primary.light}`,
            borderRadius: 2,
            width: "fit-content",
            boxShadow: theme.shadows[5],
          }}
        >
          <Typography variant="h3"> {numbers.join("  ")}</Typography>
        </Box>
        <Typography
          variant="h6"
          onClick={handleSolve}
          color={theme.palette.warning.main}
        >
          ?
        </Typography>
      </Box>
      <TextField
        value={expression}
        onChange={handleExpressionChange}
        onMouseUp={handleTextFieldClick}
        onKeyUp={handleTextFieldKeyUp}
        onFocus={(e) => {
          const target = e.target as HTMLInputElement;
          setCursorPosition(target.selectionStart || 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCheck();
          }
        }}
        fullWidth
        inputRef={textFieldRef}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "1.25rem",
            position: "relative",
            top: "-5px",
            // textAlign: "center",
          },
        }}
        size="medium"
        InputProps={{
          endAdornment: (
            <>
              <ClearIcon
                onClick={handleClear}
                sx={{
                  color: "warning.main",
                }}
              />
            </>
          ),
        }}
      />
      <NumPad onButtonClick={handleButtonClick} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          width: "100%",
        }}
      >
        <ButtonComponent
          icon={<RefreshOutlinedIcon />}
          text="New Game"
          onClick={handleNewGame}
          color="secondary"
          variant="contained"
        />
        <ButtonComponent
          icon={<CheckCircleOutlinedIcon />}
          text="Check"
          onClick={handleCheck}
          color="primary"
          variant="contained"
          isFullWidth
        />
        <Box gridColumn="span 2"></Box>
        {/* <ButtonComponent
          icon={<CalculateOutlinedIcon />}
          text="Evaluate"
          onClick={handleEvaluate}
          color="warning"
          variant="outlined"
        /> */}
      </Box>
    </Stack>
  );
}
