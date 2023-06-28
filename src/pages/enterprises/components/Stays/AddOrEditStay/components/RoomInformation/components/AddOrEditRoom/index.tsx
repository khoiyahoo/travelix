import React, { useMemo, memo, useState, useEffect } from "react";
import { Row, Col, Input } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { OptionItem } from "models/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ErrorMessage from "components/common/texts/ErrorMessage";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useTranslation } from "react-i18next";
import { Stay, StayType } from "models/enterprise/stay";
import moment from "moment";
import InputCreatableSelect from "components/common/inputs/InputCreatableSelect";
import { ReducerType } from "redux/reducers";
import { RoomService } from "services/enterprise/room";
import { Room } from "models/enterprise/room";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const ReactQuill = dynamic(async () => await import("react-quill"), {
  ssr: false,
});
const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
    [{ color: [] }, { background: [] }],
  ],
};

export interface RoomForm {
  title: string;
  description: string;
  utility: OptionItem<string>[];
  numberOfAdult: number;
  numberOfChildren: number;
  numberOfBed: number;
  numberOfRoom: number;
  discount: number;
  mondayPrice: number;
  tuesdayPrice: number;
  wednesdayPrice: number;
  thursdayPrice: number;
  fridayPrice: number;
  saturdayPrice: number;
  sundayPrice: number;
  images?: File[];
}

interface Props {
  stay?: Stay;
  lang?: string;
  room?: Room;
  onChangeTab?: (isFetchData: boolean) => void;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const AddOrEditRoom = memo((props: Props) => {
  const { stay, lang, room, onChangeTab, handleNextStep } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const { stayInformation } = useSelector(
    (state: ReducerType) => state.enterprise
  );

  const [imagesPreview, setImagesPreview] = useState<any>([]);
  const [oldImages, setOldImages] = useState<any>([]);
  const [imagesDeleted, setImagesDeleted] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_name_validate"
          )
        ),
      description: yup
        .string()
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_des_validate"
          )
        ),
      utility: yup
        .array(
          yup.object({
            name: yup
              .string()
              .required(
                t(
                  "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_utility_validate"
                )
              ),
          })
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_name_validate"
          )
        )
        .min(
          1,
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_name_validate"
          )
        ),
      numberOfAdult: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_adult_validate"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_adult_validate_error"
          )
        ),
      numberOfChildren: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_child_validate"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_child_validate_error"
          )
        ),
      numberOfBed: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_bed_validate"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_bed_validate_error"
          )
        ),
      numberOfRoom: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_room_validate"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_room_validate_error"
          )
        ),
      discount: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_discount_validate"
          )
        )
        .notRequired(),
      mondayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
      tuesdayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
      wednesdayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
      thursdayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
      fridayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
      saturdayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
      sundayPrice: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_validate"
          )
        ),
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
  } = useForm<RoomForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      title: "",
      description: "",
      utility: null,
      numberOfAdult: null,
      numberOfChildren: null,
      numberOfBed: null,
      numberOfRoom: null,
      discount: null,
      mondayPrice: null,
      tuesdayPrice: null,
      wednesdayPrice: null,
      thursdayPrice: null,
      fridayPrice: null,
      saturdayPrice: null,
      sundayPrice: null,
      images: [],
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

  const _onSubmit = (data: RoomForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    data.utility.forEach((item) => {
      formData.append("utility[]", item?.name);
    });
    formData.append("description", data.description);
    formData.append("numberOfAdult", `${data.numberOfAdult}`);
    formData.append("numberOfChildren", `${data.numberOfChildren}`);
    formData.append("numberOfBed", `${data.numberOfBed}`);
    formData.append("numberOfRoom", `${data.numberOfRoom}`);
    formData.append("discount", `${data.discount}`);
    formData.append("mondayPrice", `${data.mondayPrice}`);
    formData.append("tuesdayPrice", `${data.tuesdayPrice}`);
    formData.append("wednesdayPrice", `${data.wednesdayPrice}`);
    formData.append("thursdayPrice", `${data.thursdayPrice}`);
    formData.append("fridayPrice", `${data.fridayPrice}`);
    formData.append("saturdayPrice", `${data.saturdayPrice}`);
    formData.append("sundayPrice", `${data.sundayPrice}`);
    formData.append("fridayPrice", `${data.fridayPrice}`);
    formData.append("stayId", `${stayInformation?.id || stay?.id}`);
    imagesUpload.forEach((item, index) => {
      formData.append(`imageFiles${index}`, item);
    });
    dispatch(setLoading(true));
    if (room) {
      const formDataEdit = new FormData();
      formDataEdit.append("title", data.title);
      data.utility.forEach((item) => {
        formDataEdit.append("utility[]", item?.name);
      });
      formDataEdit.append("description", data.description);
      formDataEdit.append("numberOfAdult", `${data.numberOfAdult}`);
      formDataEdit.append("numberOfChildren", `${data.numberOfChildren}`);
      formDataEdit.append("numberOfBed", `${data.numberOfBed}`);
      formDataEdit.append("numberOfRoom", `${data.numberOfRoom}`);
      formDataEdit.append("discount", `${data.discount}`);
      formDataEdit.append("mondayPrice", `${data.mondayPrice}`);
      formDataEdit.append("tuesdayPrice", `${data.tuesdayPrice}`);
      formDataEdit.append("wednesdayPrice", `${data.wednesdayPrice}`);
      formDataEdit.append("thursdayPrice", `${data.thursdayPrice}`);
      formDataEdit.append("fridayPrice", `${data.fridayPrice}`);
      formDataEdit.append("saturdayPrice", `${data.saturdayPrice}`);
      formDataEdit.append("sundayPrice", `${data.sundayPrice}`);
      formDataEdit.append("fridayPrice", `${data.fridayPrice}`);
      if (lang) {
        formDataEdit.append("language", lang);
      }
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
      RoomService.update(room?.id, formDataEdit)
        .then((res) => {
          dispatch(setSuccessMess(t("common_update_success")));
          onChangeTab(res.success);
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    } else {
      RoomService.create(formData)
        .then((res) => {
          dispatch(setSuccessMess(t("common_create_success")));
          onChangeTab(res.success);
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
  };

  useEffect(() => {
    if (room) {
      RoomService?.getRoom(room?.id, { stayId: stay?.id, language: lang })
        .then((res) => {
          reset({
            title: res?.data?.title,
            description: res?.data?.description,
            utility: res?.data?.utility?.map((item) => ({ name: item })),
            numberOfAdult: res?.data?.numberOfAdult,
            numberOfChildren: res?.data?.numberOfChildren,
            numberOfBed: res?.data?.numberOfBed,
            numberOfRoom: res?.data?.numberOfRoom,
            discount: res?.data?.discount,
            mondayPrice: res?.data?.mondayPrice,
            tuesdayPrice: res?.data?.tuesdayPrice,
            wednesdayPrice: res?.data?.wednesdayPrice,
            thursdayPrice: res?.data?.thursdayPrice,
            fridayPrice: res?.data?.fridayPrice,
            saturdayPrice: res?.data?.saturdayPrice,
            sundayPrice: res?.data?.sundayPrice,
          });
          setOldImages(res?.data?.images);
          setImagesPreview(res?.data?.images);
          setImagesUpload(res?.data?.images);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, reset]);

  useEffect(() => {
    if (!room) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <div>
      <Grid
        component="form"
        onSubmit={handleSubmit(_onSubmit)}
        className={classes.form}
      >
        <h3 className={classes.title}>
          {t(
            "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_title_set_up_room"
          )}
        </h3>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_room_title"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_room_title"
              )}
              inputRef={register("title")}
              autoComplete="off"
              name="title"
              errorMessage={errors.title?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputCreatableSelect
              fullWidth
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_room_utility"
              )}
              name="utility"
              control={control}
              selectProps={{
                options: [],
                isClearable: true,
                isMulti: true,
                placeholder: t(
                  "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_room_utility"
                ),
              }}
              errorMessage={(errors.utility as any)?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_adult"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_adult"
              )}
              autoComplete="off"
              name="numberOfAdult"
              type="number"
              inputRef={register("numberOfAdult")}
              errorMessage={errors.numberOfAdult?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_child"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_child"
              )}
              autoComplete="off"
              name="numberOfChildren"
              type="number"
              inputRef={register("numberOfChildren")}
              errorMessage={errors.numberOfChildren?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_bed"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_bed"
              )}
              autoComplete="off"
              name="numberOfBed"
              type="number"
              inputRef={register("numberOfBed")}
              errorMessage={errors.numberOfBed?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_room"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_number_room"
              )}
              autoComplete="off"
              name="numberOfRoom"
              type="number"
              inputRef={register("numberOfRoom")}
              errorMessage={errors.numberOfRoom?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_discount"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_discount"
              )}
              autoComplete="off"
              name="discount"
              type="number"
              inputRef={register("discount")}
              errorMessage={errors.discount?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_monday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_monday"
              )}
              autoComplete="off"
              name="mondayPrice"
              type="number"
              inputRef={register("mondayPrice")}
              errorMessage={errors.mondayPrice?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Tuesday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Tuesday"
              )}
              autoComplete="off"
              name="tuesdayPrice"
              type="number"
              inputRef={register("tuesdayPrice")}
              errorMessage={errors.tuesdayPrice?.message}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Wednesday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Wednesday"
              )}
              autoComplete="off"
              name="wednesdayPrice"
              type="number"
              inputRef={register("wednesdayPrice")}
              errorMessage={errors.wednesdayPrice?.message}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Thursday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Thursday"
              )}
              autoComplete="off"
              name="thursdayPrice"
              type="number"
              inputRef={register("thursdayPrice")}
              errorMessage={errors.thursdayPrice?.message}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Friday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Friday"
              )}
              autoComplete="off"
              name="fridayPrice"
              type="number"
              inputRef={register("fridayPrice")}
              errorMessage={errors.fridayPrice?.message}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Saturday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Saturday"
              )}
              autoComplete="off"
              name="saturdayPrice"
              type="number"
              inputRef={register("saturdayPrice")}
              errorMessage={errors.saturdayPrice?.message}
            />
          </Grid>{" "}
          <Grid item xs={6}>
            <InputTextfield
              title={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Sunday"
              )}
              placeholder={t(
                "enterprise_management_section_add_or_edit_stay_tab_add_or_edit_price_Sunday"
              )}
              autoComplete="off"
              name="sundayPrice"
              type="number"
              inputRef={register("sundayPrice")}
              errorMessage={errors.sundayPrice?.message}
            />
          </Grid>
          <Grid xs={12} item>
            <p className={classes.titleInput}>
              {t("enterprise_management_section_tour_tab_information_des")}
            </p>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  modules={modules}
                  className={clsx(classes.editor, {
                    [classes.editorError]: !!errors.description?.message,
                  })}
                  placeholder={t(
                    "enterprise_management_section_tour_tab_information_des"
                  )}
                  value={field.value || ""}
                  onBlur={() => field.onBlur()}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            {errors.description?.message && (
              <ErrorMessage>{errors.description?.message}</ErrorMessage>
            )}
          </Grid>
          <Grid item xs={12}>
            <p className={classes.titleInput}>
              {t(
                "enterprise_management_section_tour_tab_information_upload_img"
              )}
            </p>
            <div className={classes.containerUploadImg}>
              <label htmlFor="file" className={classes.boxUpload}>
                <div>
                  <AddPhotoAlternateOutlinedIcon
                    className={classes.imgAddPhoto}
                  />

                  <p className={classes.selectImgTitle}>
                    {" "}
                    {t(
                      "enterprise_management_section_tour_tab_information_upload_img"
                    )}
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
          <Grid item xs={12}>
            <p className={classes.titleInput}>
              {t(
                "enterprise_management_section_tour_tab_information_img_preview"
              )}
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
                    {t(
                      "enterprise_management_section_tour_tab_information_no_img"
                    )}
                  </h4>
                </Col>
              )}
            </Grid>
            <Row className={classes.footer}>
              <Button
                btnType={BtnType.Primary}
                type="submit"
                className={classes.btnSave}
              >
                {t("common_save")}
              </Button>
            </Row>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});

export default AddOrEditRoom;
