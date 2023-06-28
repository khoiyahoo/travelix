import React, { useMemo, memo } from "react";
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
import InputTextArea from "components/common/inputs/InputTextArea";
import InputSelect from "components/common/inputs/InputSelects";
import InputCounter from "components/common/inputs/InputCounter";
import Star from "components/Stars";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HistoryBookRoom } from "models/room";
import { Stars } from "@mui/icons-material";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CommentForm {
  comment: string;
  selectInvoice: HistoryBookRoom[];
  numberOfStars: number;
}

interface Props extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggle: () => void;
}

// eslint-disable-next-line react/display-name
const PopupAddComment = memo((props: Props) => {
  const { isOpen, toggle, rest } = props;

  const schema = useMemo(() => {
    return yup.object().shape({
      comment: yup.string().required("Content is required"),
      numberOfStars: yup.number().required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CommentForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      numberOfStars: 3,
    },
  });

  const clearForm = () => {
    reset({
      comment: "",
    });
  };

  const _onSubmit = (data: CommentForm) => {
    console.log(data);
    clearForm();
  };
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} {...rest} className={classes.root}>
        <Form method="post" role="form" onSubmit={handleSubmit(_onSubmit)}>
          <ModalHeader toggle={toggle} className={classes.title}>
            What do you want to ask us?
          </ModalHeader>
          <ModalBody>
            <label>Choose your invoices: </label>
            <InputSelect
              className={classes.inputSelect}
              placeholder="Invoices"
              name="Invoices"
            />
            <Controller
              name="numberOfStars"
              control={control}
              render={({ field }) => (
                <div className={classes.starContainer}>
                  <div className={classes.inputCounter}>
                    <InputCounter
                      label="Star rating:"
                      max={5}
                      min={1}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </div>
                  <Star
                    className={classes.starWrapper}
                    numberOfStars={field.value}
                  />
                </div>
              )}
            />
            <InputTextArea
              className={classes.labelText}
              label="Enter your question here:"
              placeholder="Ex: How many rooms do you have?"
              autoComplete="family-name"
              inputRef={register("comment")}
              errorMessage={errors.comment?.message}
            />
          </ModalBody>
          <ModalFooter className={classes.footer}>
            <div className={classes.action}>
              <Button
                btnType={BtnType.Secondary}
                type="submit"
                className="mr-2"
              >
                Post
              </Button>{" "}
              <Button btnType={BtnType.Primary} onClick={toggle}>
                Cancel
              </Button>
            </div>
            <p>
              Your question will be posted on Travelix.com once it has been
              approved and answered
            </p>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
});

export default PopupAddComment;
