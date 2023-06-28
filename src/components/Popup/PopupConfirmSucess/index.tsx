import React, {memo } from 'react';
import {Modal, ModalProps, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classes from "./styles.module.scss";
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck} from '@fortawesome/free-solid-svg-icons';


interface Props extends ModalProps{ 
    isOpen?: boolean;
    onClose?: () => void;
    toggle?: () => void;
    iconTitle?: React.ReactNode;
    title?: string;
    description?: string;
}

// eslint-disable-next-line react/display-name
const PopupAddComment = memo((props: Props) => {
  const {isOpen, toggle, title, iconTitle, description, rest} = props;
  return (
    <>  
        <Modal isOpen={isOpen} toggle={toggle} {...rest} className={classes.root}>
            <ModalHeader toggle={toggle} className={classes.title}>
                <FontAwesomeIcon icon={faCircleCheck}/>
                {title}
            </ModalHeader>
            <ModalBody>
               {description &&  <p>{description}</p>}
            </ModalBody>
        </Modal>
    </>
  );
});

export default PopupAddComment;
