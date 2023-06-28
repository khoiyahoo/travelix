import React, { useMemo, memo, useState, useEffect } from "react";
import { Row, Col, Input } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { VALIDATION } from "configs/constants";
import { OptionItem } from "models/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ErrorMessage from "components/common/texts/ErrorMessage";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { setStayReducer } from "redux/reducers/Enterprise/actionTypes";
import { ProvinceService } from "services/address";
import InputSelect from "components/common/inputs/InputSelect";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useTranslation } from "react-i18next";
import { Stay, StayType } from "models/enterprise/stay";
import moment from "moment";
import InputCreatableSelect from "components/common/inputs/InputCreatableSelect";
import { StayService } from "services/enterprise/stay";
import InputTimePicker from "components/common/inputs/InputTimePicker";
import TimePicker from "components/common/inputs/TimePicker";

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

export interface StayForm {
  name: string;
  type: OptionItem;
  province: OptionItem;
  district: OptionItem;
  commune: OptionItem;
  moreLocation?: string;
  contact: string;
  checkInTime: Date;
  checkOutTime: Date;
  description: string;
  convenient: OptionItem<string>[];
  highlight: string;
  termsAndCondition: string;
  images?: File[];
}

interface Props {
  value?: number;
  index?: number;
  stay?: Stay;
  lang?: string;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const InformationComponent = memo((props: Props) => {
  const { value, index, stay, lang, handleNextStep } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const stayTypeOption = [
    {
      id: 1,
      name: t("enterprise_management_section_stay_status_option_hotel"),
      value: StayType.HOTEL,
    },
    {
      id: 2,
      name: t("enterprise_management_section_stay_status_option_home_stay"),
      value: StayType.HOMES_TAY,
    },
    {
      id: 3,
      name: t("enterprise_management_section_stay_status_option_resort"),
      value: StayType.RESORT,
    },
  ];

  const getStayType = (type: number) => {
    switch (type) {
      case StayType.HOTEL:
        return {
          id: 1,
          name: t("enterprise_management_section_stay_status_option_hotel"),
          value: StayType.HOTEL,
        };
      case StayType.HOMES_TAY:
        return {
          id: 2,
          name: t("enterprise_management_section_stay_status_option_home_stay"),
          value: StayType.HOTEL,
        };
      case StayType.RESORT:
        return {
          id: 3,
          name: t("enterprise_management_section_stay_status_option_resort"),
          value: StayType.RESORT,
        };
    }
  };

  const [imagesPreview, setImagesPreview] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [oldImages, setOldImages] = useState<any>([]);
  const [imagesDeleted, setImagesDeleted] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);

  const schema = useMemo(() => {
    const min = moment().startOf("day").toDate();
    return yup.object().shape({
      name: yup
        .string()
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_name_validate"
          )
        ),
      type: yup
        .object()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_type_validate"
          )
        )
        .shape({
          id: yup
            .number()
            .required(
              t(
                "enterprise_management_section_add_or_edit_stay_tab_information_type_validate"
              )
            ),
          name: yup.string().required(),
        })
        .required(),
      province: yup
        .object()
        .typeError(
          t(
            "enterprise_management_section_tour_tab_information_city_validation"
          )
        )
        .shape({
          id: yup.number().required(),
          name: yup.string().required(),
        })
        .required(),
      district: yup
        .object()
        .typeError(
          t(
            "enterprise_management_section_tour_tab_information_district_validation"
          )
        )
        .shape({
          id: yup
            .number()
            .required(
              t(
                "enterprise_management_section_tour_tab_information_district_validation"
              )
            ),
          name: yup.string().required(),
        })
        .required(),
      commune: yup
        .object()
        .typeError(
          t(
            "enterprise_management_section_tour_tab_information_commune_validation"
          )
        )
        .shape({
          id: yup
            .number()
            .required(
              t(
                "enterprise_management_section_tour_tab_information_commune_validation"
              )
            ),
          name: yup.string().required(),
        })
        .required(),
      moreLocation: yup
        .string()
        .required(
          t(
            "enterprise_management_section_tour_tab_information_detail_address_validation"
          )
        ),
      contact: yup
        .string()
        .required(
          t(
            "enterprise_management_section_tour_tab_information_contact_validation"
          )
        )
        .matches(VALIDATION.phone, {
          message: t(
            "enterprise_management_section_tour_tab_information_contact_validation_error"
          ),
          excludeEmptyString: true,
        }),
      checkInTime: yup
        .date()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_check_in_validate"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_check_in_validate"
          )
        ),
      checkOutTime: yup
        .date()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_check_out_validate"
          )
        )
        // .max(yup.ref("startTime"), `End time must be greater than ${startTime}`)
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_check_out_validate"
          )
        ),
      description: yup
        .string()
        .required(
          t("enterprise_management_section_tour_tab_information_des_validation")
        ),
      convenient: yup
        .array(
          yup.object({
            name: yup
              .string()
              .required(
                t(
                  "enterprise_management_section_add_or_edit_stay_tab_information_convenient_validate"
                )
              ),
          })
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_convenient_validate"
          )
        )
        .min(
          1,
          t(
            "enterprise_management_section_add_or_edit_stay_tab_information_convenient_validate"
          )
        ),
      highlight: yup
        .string()
        .required(
          t("enterprise_management_section_tour_tab_information_hig_validation")
        ),
      termsAndCondition: yup
        .string()
        .required(
          t(
            "enterprise_management_section_tour_tab_information_term_validation"
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
    watch,
  } = useForm<StayForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      name: "",
      type: null,
      province: null,
      district: null,
      commune: null,
      moreLocation: "",
      contact: "",
      checkInTime: null,
      checkOutTime: null,
      description: "",
      convenient: null,
      highlight: "",
      termsAndCondition: "",
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

  const fetchProvince = () => {
    const _provinces = provinces?.map((item) => {
      return {
        id: item.province_id,
        name: item.province_name,
      };
    });
    return _provinces;
  };

  const watchCity = watch("province");

  const fetchDistrict = () => {
    const _districts = districts?.map((item) => {
      return {
        id: item.district_id,
        name: item.district_name,
      };
    });
    return _districts;
  };

  const watchDistrict = watch("district");

  const fetchCommune = () => {
    const _communes = communes?.map((item) => {
      return {
        id: item.ward_id,
        name: item.ward_name,
      };
    });
    return _communes;
  };

  const _onSubmit = (data: StayForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", `${data?.type?.value}`);
    formData.append("city[id]", `${data?.province?.id}`);
    formData.append("city[name]", data?.province?.name);
    formData.append("district[id]", `${data?.district?.id}`);
    formData.append("district[name]", data?.district?.name);
    formData.append("commune[id]", `${data?.commune?.id}`);
    formData.append("commune[name]", data?.commune?.name);
    formData.append("moreLocation", data.moreLocation);
    formData.append("contact", data.contact);
    formData.append(
      "checkInTime",
      `${moment(data.checkInTime).diff(moment().startOf("day"), "seconds")}`
    );
    formData.append(
      "checkOutTime",
      `${moment(data.checkOutTime).diff(moment().startOf("day"), "seconds")}`
    );
    formData.append("description", data.description);
    data.convenient.forEach((item) => {
      formData.append("convenient[]", item?.name);
    });
    formData.append("highlight", data.highlight);
    formData.append("termsAndCondition", data.termsAndCondition);
    imagesUpload.forEach((item, index) => {
      formData.append(`imageFiles${index}`, item);
    });
    dispatch(setLoading(true));
    if (stay) {
      const formDataEdit = new FormData();
      formDataEdit.append("name", data.name);
      formDataEdit.append("type", `${data?.type?.value}`);
      formDataEdit.append("city[id]", `${data?.province?.id}`);
      formDataEdit.append("city[name]", data?.province?.name);
      formDataEdit.append("district[id]", `${data?.district?.id}`);
      formDataEdit.append("district[name]", data?.district?.name);
      formDataEdit.append("commune[id]", `${data?.commune?.id}`);
      formDataEdit.append("commune[name]", data?.commune?.name);
      formDataEdit.append("moreLocation", data.moreLocation);
      formDataEdit.append("contact", data.contact);
      formDataEdit.append(
        "checkInTime",
        `${moment(data.checkInTime).diff(moment().startOf("day"), "seconds")}`
      );
      formDataEdit.append(
        "checkOutTime",
        `${moment(data.checkOutTime).diff(moment().startOf("day"), "seconds")}`
      );
      formDataEdit.append("description", data.description);
      data.convenient.forEach((item) => {
        formDataEdit.append("convenient[]", item?.name);
      });
      formDataEdit.append("highlight", data.highlight);
      formDataEdit.append("termsAndCondition", data.termsAndCondition);
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
      StayService.updateStayInformation(stay?.id, formDataEdit)
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          handleNextStep();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    } else {
      StayService.createStayInformation(formData)
        .then((res) => {
          dispatch(
            setStayReducer({
              id: res?.data?.id,
              name: res?.data?.name,
              type: res?.data?.type,
              city: res?.data?.city,
              district: res?.data?.district,
              commune: res?.data?.commune,
              moreLocation: res?.data?.moreLocation,
              contact: res?.data?.contact,
              convenient: res?.data?.convenient,
              checkInTime: res?.data?.checkInTime,
              checkOutTime: res?.data?.checkOutTime,
              description: res?.data?.description,
              highlight: res?.data?.highlight,
              termsAndCondition: res?.data?.termsAndCondition,
              images: res?.data?.images,
            })
          );

          dispatch(setSuccessMess(t("common_create_success")));
          handleNextStep();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
  };

  useEffect(() => {
    if (stay) {
      reset({
        name: stay?.name,
        type: getStayType(stay?.type),
        province: stay?.city,
        district: stay?.district,
        commune: stay?.commune,
        moreLocation: stay?.moreLocation,
        contact: stay?.contact,
        convenient: stay?.convenient?.map((item) => ({ name: item })),
        checkInTime: moment()
          .startOf("day")
          .add(stay?.checkInTime, "seconds")
          .toDate(),
        checkOutTime: moment()
          .startOf("day")
          .add(stay?.checkOutTime, "seconds")
          .toDate(),
        description: stay?.description,
        highlight: stay?.highlight,
        termsAndCondition: stay?.termsAndCondition,
      });
      setOldImages(stay?.images);
      setImagesPreview(stay?.images);
      setImagesUpload(stay?.images);
    }
  }, [stay, reset]);

  useEffect(() => {
    if (!stay) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay]);

  useEffect(() => {
    ProvinceService.getProvince()
      .then((res) => {
        setProvinces(res?.data.results);
      })
      .catch((e) => {
        dispatch(setErrorMess("Get province fail"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ProvinceService.getDistrict(Number(watchCity?.id))
      .then((res) => {
        setDistricts(res?.data.results);
      })
      .catch((e) => {
        dispatch(setErrorMess("Get district fail"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCity?.id]);

  useEffect(() => {
    ProvinceService.getCommune(Number(watchDistrict?.id))
      .then((res) => {
        setCommunes(res?.data.results);
      })
      .catch((e) => {
        dispatch(setErrorMess("Get commune fail"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDistrict?.id]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Grid
          component="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <h3 className={classes.title}>
            {t(
              "enterprise_management_section_add_or_edit_stay_set_up_title_information"
            )}
          </h3>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_add_or_edit_stay_tab_information_name_title"
                )}
                placeholder={t(
                  "enterprise_management_section_add_or_edit_stay_tab_information_name_title"
                )}
                inputRef={register("name")}
                autoComplete="off"
                name="title"
                errorMessage={errors.name?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_contact"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_contact"
                )}
                autoComplete="off"
                name="contact"
                inputRef={register("contact")}
                errorMessage={errors.contact?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                name="type"
                title={t(
                  "enterprise_management_section_add_or_edit_stay_tab_information_type_title"
                )}
                control={control}
                selectProps={{
                  options: stayTypeOption,
                  placeholder: `-- ${t(
                    "enterprise_management_section_add_or_edit_stay_tab_information_type_title"
                  )} --`,
                }}
                errorMessage={errors.type?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputCreatableSelect
                fullWidth
                title={t(
                  "enterprise_management_section_add_or_edit_stay_tab_information_convenient_title"
                )}
                name="convenient"
                control={control}
                selectProps={{
                  options: [],
                  isClearable: true,
                  isMulti: true,
                  placeholder: t(
                    "enterprise_management_section_add_or_edit_stay_tab_information_convenient_title"
                  ),
                }}
                errorMessage={(errors.convenient as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_tab_information_city"
                )}
                className={classes.selectLocation}
                name="province"
                control={control}
                selectProps={{
                  options: fetchProvince(),
                  placeholder: t(
                    "enterprise_management_section_tour_tab_information_city_placeholder"
                  ),
                }}
                errorMessage={(errors.province as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_tab_information_district"
                )}
                name="district"
                control={control}
                selectProps={{
                  options: fetchDistrict(),
                  placeholder: t(
                    "enterprise_management_section_tour_tab_information_district_placeholder"
                  ),
                }}
                errorMessage={(errors.district as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_tab_information_commune"
                )}
                className={classes.selectLocation}
                name="commune"
                control={control}
                selectProps={{
                  options: fetchCommune(),
                  placeholder: t(
                    "enterprise_management_section_tour_tab_information_commune_placeholder"
                  ),
                }}
                errorMessage={(errors.commune as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_more_location"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_more_location"
                )}
                autoComplete="off"
                name="moreLocation"
                inputRef={register("moreLocation")}
                errorMessage={errors.moreLocation?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`checkInTime`}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label={t(
                      "enterprise_management_section_add_or_edit_stay_tab_information_check_in_title"
                    )}
                    value={field.value as any}
                    onChange={field.onChange}
                    inputRef={register(`checkInTime`)}
                    errorMessage={errors.checkInTime?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`checkOutTime`}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label={t(
                      "enterprise_management_section_add_or_edit_stay_tab_information_check_out_title"
                    )}
                    value={field.value as any}
                    onChange={field.onChange}
                    inputRef={register(`checkOutTime`)}
                    errorMessage={errors.checkOutTime?.message}
                  />
                )}
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
            <Grid xs={12} item>
              <p className={classes.titleInput}>
                {t("enterprise_management_section_tour_tab_information_hig")}
              </p>
              <Controller
                name="highlight"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    modules={modules}
                    className={clsx(classes.editor, {
                      [classes.editorError]: !!errors.highlight?.message,
                    })}
                    placeholder={t(
                      "enterprise_management_section_tour_tab_information_hig"
                    )}
                    value={field.value || ""}
                    onBlur={() => field.onBlur()}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.highlight?.message && (
                <ErrorMessage>{errors.highlight?.message}</ErrorMessage>
              )}
            </Grid>
            <Grid xs={12} item>
              <p className={classes.titleInput}>
                {t("enterprise_management_section_tour_tab_information_term")}
              </p>
              <Controller
                name="termsAndCondition"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    modules={modules}
                    className={clsx(classes.editor, {
                      [classes.editorError]:
                        !!errors.termsAndCondition?.message,
                    })}
                    placeholder={t(
                      "enterprise_management_section_tour_tab_information_term"
                    )}
                    value={field.value || ""}
                    onBlur={() => field.onBlur()}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors.termsAndCondition?.message && (
                <ErrorMessage>{errors.termsAndCondition?.message}</ErrorMessage>
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
                    {isLoading ? (
                      <p className={classes.selectImgTitle}>Uploading...</p>
                    ) : (
                      <p className={classes.selectImgTitle}>
                        {" "}
                        {t(
                          "enterprise_management_section_tour_tab_information_upload_img"
                        )}
                      </p>
                    )}
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
                  {t(
                    "enterprise_management_section_tour_tab_information_next_schedule"
                  )}
                  <ArrowRightAltIcon />
                </Button>
              </Row>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
});

export default InformationComponent;
