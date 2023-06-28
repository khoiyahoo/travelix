import React, {memo} from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import {Row} from "reactstrap";

// eslint-disable-next-line react/display-name
const EmailTemplate = memo(()=> {
   return (
    <>
       <div className={classes.root}>
            <Row className={clsx(classes.rowHeaderBox, classes.title)}>
                 <h3>Email template</h3>
            </Row>
       </div>
    </>
  );
})

export default EmailTemplate;
