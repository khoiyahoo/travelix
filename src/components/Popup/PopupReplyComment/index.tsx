import React, { useMemo, memo, useEffect, useState } from "react";
import {
  Form,
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import InputTextfield from "components/common/inputs/InputTextfield";

import { useTranslation } from "react-i18next";

export interface CommentForm {
  content: string;
}

interface Props {
  isOpen: boolean;
  replyEdit?: any;
  onClose?: () => void;
  toggle?: () => void;
  onSubmit?: (data) => void;
}

// eslint-disable-next-line react/display-name
const PopupAddComment = memo((props: Props) => {
  const { isOpen, replyEdit, toggle, onSubmit } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");
  const schema = useMemo(() => {
    return yup.object().shape({
      content: yup
        .string()
        .required(t("popup_add_comment_tour_title_content_validate")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      content: "",
    });
  };

  const _onSubmit = (data: CommentForm) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (replyEdit) {
      reset({
        content: replyEdit?.content,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyEdit, reset]);

  useEffect(() => {
    if (isOpen && !replyEdit) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, replyEdit]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <Form method="post" role="form" onSubmit={handleSubmit(_onSubmit)}>
          <ModalHeader toggle={toggle} className={classes.title}>
            {t("popup_add_comment_reply_title")}
          </ModalHeader>
          <ModalBody>
            <InputTextfield
              title={t("common_reply")}
              multiline
              rows={3}
              inputRef={register("content")}
              errorMessage={errors?.content?.message}
            />
          </ModalBody>
          <ModalFooter className={classes.footer}>
            <div className={classes.action}>
              <Button
                btnType={BtnType.Secondary}
                onClick={toggle}
                className="mr-2"
              >
                {t("common_cancel")}
              </Button>
              <Button btnType={BtnType.Primary} type="submit">
                {t("common_post")}
              </Button>{" "}
            </div>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
});

export default PopupAddComment;
