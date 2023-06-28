import { memo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

interface Props {
  className?: string;
}

// eslint-disable-next-line react/display-name
const Stars = memo(({ className }: Props) => {
  return (
    <div className={clsx(classes.root, className)}>
      <FontAwesomeIcon icon={faLocationDot} />
    </div>
  );
});

export default Stars;
