import { memo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Input, InputProps, FormGroup, InputGroup } from "reactstrap";
import { FieldError, FieldErrors, Merge, UseFormRegisterReturn } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface Props {
    className?: string;
    numberOfStars: number;
}

// eslint-disable-next-line react/display-name
const Stars = memo(({ className, numberOfStars}: Props) => {

    return (
        <div className={clsx(classes.root, className)}>
            {numberOfStars ? [...Array(numberOfStars)]?.map((star, index) => {
                return (
                    <FontAwesomeIcon icon={faStar} key={index}></FontAwesomeIcon>
                )
            }) : ""}
        </div>
    );
  }
);

export default Stars;
