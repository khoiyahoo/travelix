import {
  Box,
  Chip,
  Grid,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Tabs,
  Typography,
} from "@mui/material";
import styled, { css } from "styled-components";
export const CustomStepConnector = styled(StepConnector)`
  margin-left: 16px;
  .MuiStepConnector-line {
    border-color: var(--gray-40);
  }
`;

export const CustomStepLabel = styled(StepLabel)`
  cursor: pointer !important;
  .MuiStepLabel-iconContainer {
    padding: 0;
    margin-right: 16px;
  }
  .MuiStepLabel-label {
    &.Mui-active {
      .title {
        color: var(--success-color);
      }
    }
  }
`;

export const CustomStepContent = styled(StepContent)`
  margin-left: 16px;
  border-left: 1px solid var(--gray-40);
  padding-left: 32px;
`;

interface CustomStepIconBoxProps {
  $active?: boolean;
}

export const CustomStepIconBox = styled(Box)<CustomStepIconBoxProps>`
  background: ${(props) =>
    props.$active ? "var(--success-color)" : "var(--gray-20)"};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  > * {
    font-size: 18px;
    color: ${(props) =>
      props.$active ? "var(--success-color)" : "var(--gray-60)"};
  }
`;
