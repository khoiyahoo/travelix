import { memo } from "react";
import classes from "./styles.module.scss";

interface LoadingScreenProps {}

// eslint-disable-next-line no-empty-pattern, react/display-name
const LoadingScreen = memo(({}: LoadingScreenProps) => {
  return (
    <div className={classes.root}>
      <div className={classes.ldsGrid}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
});

export default LoadingScreen;
