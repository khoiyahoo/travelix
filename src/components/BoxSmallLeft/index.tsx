import React, {memo} from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";

interface Props { 
    className?: string;
    title: string;
    children: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const BoxSmallLeft = memo(({className, title, children} : Props) => {
    
  return (
    <>
        <div className={clsx(classes.root, className)}>
            <div className={classes.header}>
                <span>{title}</span>
            </div>
            <div className={classes.body}>
                {children}
            </div>
        </div>
    </>
  );
});

export default BoxSmallLeft;
