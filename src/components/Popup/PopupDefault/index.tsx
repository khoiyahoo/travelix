import React, {memo } from 'react';
import {Modal, ModalProps, ModalHeader, ModalBody, } from 'reactstrap';
// import classes from "./styles.module.scss";
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import classes from "./styles.module.scss";
import { clsx } from 'clsx';

interface Props extends ModalProps{ 
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
    toggle?: () => void;
    iconTitle?: React.ReactNode;
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
const PopupDefault = memo((props: Props) => {
  const {className, isOpen, toggle, title, iconTitle, description, children, rest} = props;
  return (
    <>  
        <Modal isOpen={isOpen} toggle={toggle} {...rest} className={clsx(className, classes.root)}>
            <ModalHeader toggle={toggle} >
                {iconTitle}
                {title && <h3 className={classes.title}>{title}</h3>}
            </ModalHeader>
            <ModalBody>
               {description &&  <p>{description}</p>}
               {children}
            </ModalBody>
        </Modal>
    </>
  );
});

export default PopupDefault;
