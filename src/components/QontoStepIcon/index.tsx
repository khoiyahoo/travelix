import { Check } from "@mui/icons-material";
import { StepIconProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    ...(ownerState.active && {}),
    "& .QontoStepIcon": {
      background: "var(--success-color)",
      height: 32,
      width: 32,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .QontoStepIcon-completedIcon": {
      color: "var(--white-color)",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-activeIcon": {
      background: "var(--success-color)",
      height: 32,
      width: 32,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .QontoStepIcon-circle": {
      background: "#C4C4C4",
      height: 32,
      width: 32,
      borderRadius: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .QontoStepIcon-textAtive": {
      fontWeight: 500,
      fontSize: 12,
      color: "var(--white-color)",
    },
    "& .QontoStepIcon-text": {
      fontWeight: 500,
      fontSize: 12,
      color: "var(--white-color)",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, icon, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div className="QontoStepIcon">
          <Check className="QontoStepIcon-completedIcon" />
        </div>
      ) : active ? (
        <div className="QontoStepIcon-activeIcon">
          <span className="QontoStepIcon-textAtive">{icon}</span>
        </div>
      ) : (
        <div className="QontoStepIcon-circle">
          <span className="QontoStepIcon-text">{icon}</span>
        </div>
      )}
    </QontoStepIconRoot>
  );
}

export default QontoStepIcon;
