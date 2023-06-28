import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { memo } from "react";

interface ToggleProps extends SwitchProps {}

const CustomSwitch = styled(Switch)((props) => ({
  "& .MuiSwitch-switchBase .MuiSwitch-thumb": {
    color: "#ffffff",
  },
  "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
    color: "var(--primary-color)",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "var(--primary-color",
  },
}));

const Toggle = memo(({ ...props }: ToggleProps) => {
  return <CustomSwitch inputProps={{ "aria-label": "Toggle" }} {...props} />;
});

export default Toggle;
