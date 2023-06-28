import { memo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import classes from "./styles.module.scss";
import { clsx } from "clsx";

interface Props  {
    className?: string;
    content?: string;
}

// eslint-disable-next-line react/display-name
const NoteWarning = memo((props:Props) => {
  const { className, content, ...rest } = props;
  return (
    <div
    className={clsx("mt-2",className)}
    {...rest}
    >
        <div className={classes.boxContent}>
            <FontAwesomeIcon icon={faTriangleExclamation}/>
            {content}
        </div>
    </div>
  );
});
export default NoteWarning;