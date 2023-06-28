import React, { useMemo, memo, useEffect } from "react";
import { Form, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextArea from "components/common/inputs/InputTextArea";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { CommentService } from "services/normal/comment";

export interface ReplyForm {
  replyComment: string;
}

interface Props {
  isOpen: boolean;
  commentId: number;
  commentEdit?: any;
  onClose: () => void;
  toggle: () => void;
  onGetTourComments?: () => void;
}

// eslint-disable-next-line react/display-name
const PopupAddComment = memo((props: Props) => {
  const { isOpen, commentId, commentEdit, toggle, onGetTourComments } = props;
  const dispatch = useDispatch();

  const schema = useMemo(() => {
    return yup.object().shape({
      replyComment: yup.string().required("Reply comment is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ReplyForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      replyComment: "",
    });
  };

  const _onSubmit = (data: ReplyForm) => {
    // dispatch(setLoading(true));
    //   CommentService.replyTourComment(commentId, {
    //       replyComment: data.replyComment,
    //     })
    //     .then(res => {
    //       dispatch(setSuccessMess("Reply comment successfully"))
    //       onGetTourComments();
    //     })
    //     .catch(e => {
    //       dispatch(setErrorMess(e));
    //     })
    //     .finally(() => {
    //       dispatch(setLoading(false));
    //       toggle();
    //       clearForm();
    //     })
  };

  useEffect(() => {
    if (commentEdit) {
      reset({
        replyComment: commentEdit.replyComment,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentEdit]);

  useEffect(() => {
    if (isOpen && !commentEdit) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, commentEdit]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <Form method="post" role="form" onSubmit={handleSubmit(_onSubmit)}>
          <ModalHeader toggle={toggle} className={classes.title}>
            Reply comment
          </ModalHeader>
          <ModalBody>
            <InputTextArea
              className={classes.labelText}
              label="Enter your reply here:"
              placeholder="Ex: Thank you"
              autoComplete="family-name"
              inputRef={register("replyComment")}
              errorMessage={errors.replyComment?.message}
            />
          </ModalBody>
          <ModalFooter className={classes.footer}>
            <div className={classes.action}>
              <Button
                btnType={BtnType.Secondary}
                type="submit"
                className="mr-2"
              >
                Reply
              </Button>{" "}
              <Button btnType={BtnType.Primary} onClick={toggle}>
                Cancel
              </Button>
            </div>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
});

export default PopupAddComment;
