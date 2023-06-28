import React, { useState, memo } from 'react';
import {Modal, ModalProps } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import classes from "./styles.module.scss";
import 'aos/dist/aos.css';
import Button, {BtnType} from "components/common/buttons/Button";

interface Props extends ModalProps{ 
    isOpen: boolean;
    onClose: () => void;
    toggle: () => void;
}

// eslint-disable-next-line react/display-name
const Comments = memo((props: Props) => {
    const {isOpen, toggle, children, rest} = props; 
  return (
    <>  
        <Modal isOpen={isOpen} toggle={toggle} {...rest}>
            {children}
        </Modal>
    </>
  );
});

export default Comments;
