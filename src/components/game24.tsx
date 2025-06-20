import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { generateNumbers } from "../utils/random";
import { useState, useRef, useEffect } from "react";
import { isSolvable, isValidate24 } from "../utils/validate";
import NumPad from "./numPad";
import { evaluate } from "mathjs";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";

const ButtonComponent = ({
  icon,
  text,
  onClick,
  color,
  variant,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  color: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  variant: "outlined" | "contained";
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      size="large"
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
  const [numbers, setNumbers] = useState<number[]>(generateNumbers());
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [evaluateResult, setEvaluateResult] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [solvableResult, setSolvableResult] = useState<string>("");

  const handleNewGame = () => {
    setNumbers(generateNumbers());
    setExpression("");
    setCursorPosition(0);
    setResult("");
    setEvaluateResult("");
    setSolvableResult("");
  };

  const handleCheck = () => {
    if (isValidate24(expression)) {
      setResult("Correct!");
    } else {
      setResult("Incorrect!");
    }
  };

  const handleButtonClick = (button: string) => {
    setResult("");
    setEvaluateResult("");
    if (button === "DEL") {
      const beforeCursor = expression.slice(0, cursorPosition);
      const afterCursor = expression.slice(cursorPosition);

      if (beforeCursor.endsWith("sqrt(") && afterCursor.startsWith(")")) {
        console.log("beforeCursor", beforeCursor);
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
    } else if (button === "Clear") {
      setExpression("");
      setCursorPosition(0);
    } else {
      // Handle insertion at cursor position
      const beforeCursor = expression.slice(0, cursorPosition);
      const afterCursor = expression.slice(cursorPosition);

      let insertText = button;
      let newCursorPosition = cursorPosition + button.length;

      // Handle special functions that need parentheses
      if (button === "sqrt") {
        insertText = "sqrt(";
        newCursorPosition = cursorPosition + 5; // Position cursor after "sqrt("
      } else if (button === "pow") {
        insertText = "pow(";
        newCursorPosition = cursorPosition + 4; // Position cursor after "pow("
      }

      setExpression(beforeCursor + insertText + afterCursor);
      setCursorPosition(newCursorPosition);
    }
  };

  const handleEvaluate = () => {
    try {
      const evalResult = evaluate(expression);
      setEvaluateResult(evalResult.toString());
    } catch (error) {
      setEvaluateResult("Invalid expression");
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

  const handleSolve = () => {
    setSolvableResult(isSolvable(numbers) ? "Solvable!" : "Not solvable!");
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
    setResult("");
    setEvaluateResult("");
    setSolvableResult("");
  }, [expression, cursorPosition]);

  return (
    <Stack spacing={2} alignItems="center">
      <Box>
        {" "}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            width: "fit-content",
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography variant="h3"> {numbers.join(" ")}</Typography>
        </Box>
        <Typography
          variant="h5"
          color={solvableResult === "Solvable!" ? "green" : "red"}
        >
          {solvableResult}
        </Typography>
      </Box>

      <TextField
        // label="Enter your expression"
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
            fontSize: "1.5rem",
            position: "relative",
            top: "-10px",
            textAlign: "center",
          },
        }}
        size="small"
      />
      <NumPad onButtonClick={handleButtonClick} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}
      >
        <Box gridColumn="span 2">
          <Typography
            variant="h5"
            color={result === "Correct!" ? "green" : "red"}
          >
            {result}
          </Typography>
        </Box>
        <Box gridColumn="span 2">
          {evaluateResult && (
            <Typography variant="h6">
              Evaluate Result: {evaluateResult}
            </Typography>
          )}
        </Box>
        <ButtonComponent
          icon={<CheckCircleOutlinedIcon />}
          text="Check"
          onClick={handleCheck}
          color="primary"
          variant="contained"
        />
        <ButtonComponent
          icon={<RefreshOutlinedIcon />}
          text="New Game"
          onClick={handleNewGame}
          color="secondary"
          variant="contained"
        />
        <ButtonComponent
          icon={<CalculateOutlinedIcon />}
          text="Evaluate"
          onClick={handleEvaluate}
          color="warning"
          variant="outlined"
        />
        <ButtonComponent
          icon={<QuestionMarkOutlinedIcon />}
          text="Solve"
          onClick={handleSolve}
          color="error"
          variant="outlined"
        />
      </Box>
    </Stack>
  );
}
