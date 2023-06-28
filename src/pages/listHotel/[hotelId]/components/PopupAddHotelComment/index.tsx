import React, { useMemo, memo, useEffect, useState } from "react";
import {
  Form,
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Input,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextArea from "components/common/inputs/InputTextArea";
import InputCounter from "components/common/inputs/InputCounter";
import Star from "components/Stars";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { CommentService } from "services/normal/comment";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import { Comment } from "models/comment";
import { getAllTours } from "redux/reducers/Normal/actionTypes";
import InputTextfield from "components/common/inputs/InputTextfield";
import { Grid, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { EServiceType } from "models/general";
import { TourBill } from "models/tourBill";
import { useTranslation } from "react-i18next";
import { RoomBill } from "models/roomBill";

export interface CommentForm {
  content: string;
  numberOfStars: number;
  images?: File[];
}

interface Props {
  isOpen: boolean;
  commentEdit?: Comment;
  roomBill?: RoomBill;
  onClose?: () => void;
  toggle?: () => void;
  fetchComment?: () => void;
  onSubmit?: (data) => void;
}

// eslint-disable-next-line react/display-name
const PopupAddComment = memo((props: Props) => {
  const { isOpen, commentEdit, toggle, roomBill, fetchComment, onSubmit } =
    props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const [oldImages, setOldImages] = useState<any>([]);
  const [imagesDeleted, setImagesDeleted] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [imagesPreview, setImagesPreview] = useState<any>([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      content: yup
        .string()
        .required(t("popup_add_comment_tour_title_content_validate")),
      numberOfStars: yup.number().required(),
      images: yup.array(yup.mixed()),
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
      content: "",
      numberOfStars: 3,
    });
  };

  const handleFile = async (e) => {
    e.stopPropagation();
    let files = e.target.files;
    for (let file of files) {
      setImagesUpload((prevState: any) => [...prevState, file]);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagesPreview((prevState: any) => [...prevState, reader.result]);
      };
    }
  };

  const handleDeleteImage = (image, index) => {
    if (oldImages.includes(image)) {
      setImagesDeleted((prevState: any) => [...prevState, image]);
    }
    setOldImages((prevState: any) =>
      prevState?.filter((item) => item !== image)
    );
    setImagesPreview((prevState: any) =>
      prevState?.filter((item) => item !== image)
    );
    setImagesUpload((prevState: any) =>
      prevState?.filter((_, i) => i !== index)
    );
  };

  const _onSubmit = (data: CommentForm) => {
    dispatch(setLoading(true));

    const dataForm = new FormData();
    dataForm.append("content", data?.content);
    dataForm.append("rate", `${data?.numberOfStars}`);
    dataForm.append("serviceId", `${roomBill?.stayData?.id}`);
    dataForm.append("serviceType", `${EServiceType?.HOTEL}`);
    dataForm.append("billId", `${roomBill?.id}`);
    imagesUpload.forEach((item, index) => {
      dataForm.append(`imageFiles${index}`, item);
    });
    if (commentEdit) {
      const formDataEdit = new FormData();
      formDataEdit.append("content", data?.content);
      formDataEdit.append("rate", `${data?.numberOfStars}`);
      formDataEdit.append("serviceId", `${commentEdit?.serviceId}`);
      formDataEdit.append("serviceType", `${commentEdit?.serviceType}`);
      formDataEdit.append("billId", `${commentEdit?.billId}`);
      imagesUpload.forEach((item, index) => {
        if (typeof item === "object") {
          formDataEdit.append(`imageFiles${index}`, item);
        }
      });
      oldImages?.forEach((item, index) => {
        if (typeof item === "string") {
          formDataEdit.append(`images[]`, item);
        }
      });
      imagesDeleted?.forEach((item, index) => {
        if (typeof item === "string") {
          formDataEdit.append(`imagesDeleted[]`, item);
        }
      });
      CommentService?.updateComment(commentEdit?.id, formDataEdit)
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          toggle();
          fetchComment();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      CommentService?.createComment(dataForm)
        .then(() => {
          dispatch(setSuccessMess(t("common_send_success")));
          toggle();
          fetchComment();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  console.log(commentEdit);

  useEffect(() => {
    if (commentEdit) {
      reset({
        content: commentEdit?.content,
        numberOfStars: commentEdit?.rate,
      });
      setOldImages(commentEdit?.images);
      setImagesPreview(commentEdit?.images);
      setImagesUpload(commentEdit?.images);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentEdit, reset]);

  useEffect(() => {
    if (isOpen && !commentEdit) {
      clearForm();
      setOldImages([]);
      setImagesPreview([]);
      setImagesUpload([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, commentEdit]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <Form method="post" role="form" onSubmit={handleSubmit(_onSubmit)}>
          <ModalHeader toggle={toggle} className={classes.title}>
            {t("popup_add_comment_tour_title")}
          </ModalHeader>
          <ModalBody>
            <p className={classes.titleInput}>
              {t("popup_add_comment_tour_title_star_rating")}
            </p>
            <Controller
              name="numberOfStars"
              control={control}
              render={({ field }) => (
                <div className={classes.starContainer}>
                  <div className={classes.inputCounter}>
                    <InputCounter
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
            <InputTextfield
              title={t("popup_add_comment_tour_title_content")}
              multiline
              rows={3}
              inputRef={register("content")}
              errorMessage={errors?.content?.message}
            />
            <Grid item xs={12} sx={{ marginTop: "16px" }}>
              <p className={classes.titleInput}>
                {t("popup_add_comment_tour_title_upload_images")}
              </p>
              <div className={classes.containerUploadImg}>
                <label htmlFor="file" className={classes.boxUpload}>
                  <div>
                    <AddPhotoAlternateOutlinedIcon
                      className={classes.imgAddPhoto}
                    />
                    <p className={classes.selectImgTitle}>
                      {t("popup_add_comment_tour_title_upload_images")}
                    </p>
                  </div>
                </label>
                <Input
                  inputRef={register("images")}
                  onChange={handleFile}
                  hidden
                  type="file"
                  id="file"
                  multiple
                />
              </div>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: "16px" }}>
              <p className={classes.titleInput}>
                {t("popup_add_comment_tour_title_image_preview")}
              </p>
              <Grid container spacing={2}>
                {imagesPreview?.map((item, index) => {
                  return (
                    <Grid key={item} xs={4} className={classes.imgPreview} item>
                      <img src={item} alt="preview" />
                      <div
                        onClick={() => handleDeleteImage(item, index)}
                        title="Delete"
                        className={classes.iconDelete}
                      >
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                      </div>
                    </Grid>
                  );
                })}
                {!imagesPreview?.length && (
                  <Col className={classes.noImg}>
                    <h4>
                      {t("popup_add_comment_tour_title_no_image_preview")}
                    </h4>
                  </Col>
                )}
              </Grid>
            </Grid>
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
            <p>{t("popup_add_comment_tour_title_footer")}</p>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
});

export default PopupAddComment;
