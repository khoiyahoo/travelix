import React, { useMemo, memo, useState, useEffect } from "react";
import { Row, Col, Input } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { TourService } from "services/enterprise/tour";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { ETour } from "models/enterprise";
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
import { setTourReducer } from "redux/reducers/Enterprise/actionTypes";
import { ProvinceService } from "services/address";
import InputSelect from "components/common/inputs/InputSelect";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useTranslation } from "react-i18next";

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

export interface TourForm {
  title: string;
  province: OptionItem;
  district: OptionItem;
  commune: OptionItem;
  moreLocation?: string;
  provinceStart: OptionItem;
  districtStart: OptionItem;
  communeStart: OptionItem;
  moreLocationStart?: string;
  contact: string;
  description: string;
  highlight: string;
  suitablePerson: string;
  numberOfDays: number;
  numberOfNights: number;
  termsAndCondition: string;
  images?: File[];
}

interface Props {
  value?: number;
  index?: number;
  tour?: ETour;
  lang?: string;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const InformationComponent = memo((props: Props) => {
  const { value, index, tour, lang, handleNextStep } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const [imagesPreview, setImagesPreview] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [provincesStart, setProvincesStart] = useState([]);
  const [districtsStart, setDistrictsStart] = useState([]);
  const [communesStart, setCommunesStart] = useState([]);
  const [oldImages, setOldImages] = useState<any>([]);
  const [imagesDeleted, setImagesDeleted] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .required(
          t(
            "enterprise_management_section_tour_tab_information_title_validation"
          )
        ),
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
      provinceStart: yup
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
      districtStart: yup
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
      communeStart: yup
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
      moreLocationStart: yup
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
      description: yup
        .string()
        .required(
          t("enterprise_management_section_tour_tab_information_des_validation")
        ),
      highlight: yup
        .string()
        .required(
          t("enterprise_management_section_tour_tab_information_hig_validation")
        ),
      suitablePerson: yup
        .string()
        .required(
          t(
            "enterprise_management_section_tour_tab_information_suit_validation"
          )
        ),
      numberOfDays: yup
        .number()
        .typeError(
          t("enterprise_management_section_tour_tab_information_day_validation")
        )
        .positive(
          t(
            "enterprise_management_section_tour_tab_information_day_validation_error"
          )
        )
        .required(
          t("enterprise_management_section_tour_tab_information_day_validation")
        ),
      numberOfNights: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_tour_tab_information_night_validation"
          )
        )
        .positive(
          t(
            "enterprise_management_section_tour_tab_information_night_validation_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_tour_tab_information_night_validation"
          )
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
  } = useForm<TourForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      title: "",
      province: null,
      district: null,
      commune: null,
      moreLocation: "",
      contact: "",
      description: "",
      suitablePerson: "",
      numberOfDays: null,
      numberOfNights: null,
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
  // place start
  const fetchProvinceStart = () => {
    const _provinces = provincesStart?.map((item) => {
      return {
        id: item.province_id,
        name: item.province_name,
      };
    });
    return _provinces;
  };

  const watchCityStart = watch("provinceStart");

  const fetchDistrictStart = () => {
    const _districts = districtsStart?.map((item) => {
      return {
        id: item.district_id,
        name: item.district_name,
      };
    });
    return _districts;
  };

  const watchDistrictStart = watch("districtStart");

  const fetchCommuneStart = () => {
    const _communes = communes?.map((item) => {
      return {
        id: item.ward_id,
        name: item.ward_name,
      };
    });
    return _communes;
  };

  const _onSubmit = (data: TourForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("city[id]", `${data?.province?.id}`);
    formData.append("city[name]", data?.province?.name);
    formData.append("district[id]", `${data?.district?.id}`);
    formData.append("district[name]", data?.district?.name);
    formData.append("commune[id]", `${data?.commune?.id}`);
    formData.append("commune[name]", data?.commune?.name);
    formData.append("moreLocation", data.moreLocation);
    formData.append("cityStart[id]", `${data?.provinceStart?.id}`);
    formData.append("cityStart[name]", data?.provinceStart?.name);
    formData.append("districtStart[id]", `${data?.districtStart?.id}`);
    formData.append("districtStart[name]", data?.districtStart?.name);
    formData.append("communeStart[id]", `${data?.communeStart?.id}`);
    formData.append("communeStart[name]", data?.communeStart?.name);
    formData.append("moreLocationStart", data.moreLocationStart);
    formData.append("contact", data.contact);
    formData.append("description", data.description);
    formData.append("suitablePerson", `${data.suitablePerson}`);
    formData.append("numberOfDays", `${data.numberOfDays}`);
    formData.append("numberOfNights", `${data.numberOfNights}`);
    formData.append("highlight", data.highlight);
    formData.append("termsAndCondition", data.termsAndCondition);
    imagesUpload.forEach((item, index) => {
      formData.append(`imageFiles${index}`, item);
    });
    dispatch(setLoading(true));
    if (tour) {
      const formDataEdit = new FormData();
      formDataEdit.append("title", data.title);
      formDataEdit.append("city[id]", `${data?.province?.id}`);
      formDataEdit.append("city[name]", data?.province?.name);
      formDataEdit.append("district[id]", `${data?.district?.id}`);
      formDataEdit.append("district[name]", data?.district?.name);
      formDataEdit.append("commune[id]", `${data?.commune?.id}`);
      formDataEdit.append("commune[name]", data?.commune?.name);
      formDataEdit.append("moreLocation", data.moreLocation);
      formDataEdit.append("cityStart[id]", `${data?.provinceStart?.id}`);
      formDataEdit.append("cityStart[name]", data?.provinceStart?.name);
      formDataEdit.append("districtStart[id]", `${data?.districtStart?.id}`);
      formDataEdit.append("districtStart[name]", data?.districtStart?.name);
      formDataEdit.append("communeStart[id]", `${data?.communeStart?.id}`);
      formDataEdit.append("communeStart[name]", data?.communeStart?.name);
      formDataEdit.append("moreLocationStart", data.moreLocationStart);
      formDataEdit.append("contact", data.contact);
      formDataEdit.append("description", data.description);
      formDataEdit.append("suitablePerson", `${data.suitablePerson}`);
      formDataEdit.append("numberOfDays", `${data.numberOfDays}`);
      formDataEdit.append("numberOfNights", `${data.numberOfNights}`);
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
      TourService.updateTourInformation(tour?.id, formDataEdit)
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          handleNextStep();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    } else {
      TourService.createTour(formData)
        .then((res) => {
          dispatch(
            setTourReducer({
              id: res?.data?.id,
              title: res?.data?.title,
              city: res?.data?.city,
              district: res?.data?.district,
              commune: res?.data?.commune,
              moreLocation: res?.data?.moreLocation,
              contact: res?.data?.contact,
              description: res?.data?.description,
              highlight: res?.data?.highlight,
              suitablePerson: res?.data?.suitablePerson,
              numberOfDays: res?.data?.numberOfDays,
              numberOfNights: res?.data?.numberOfNights,
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
    if (tour) {
      reset({
        title: tour?.title,
        province: tour?.city,
        district: tour?.district,
        commune: tour?.commune,
        moreLocation: tour?.moreLocation,
        provinceStart: tour?.cityStart,
        districtStart: tour?.districtStart,
        communeStart: tour?.communeStart,
        moreLocationStart: tour?.moreLocationStart,
        contact: tour?.contact,
        description: tour?.description,
        highlight: tour?.highlight,
        suitablePerson: tour?.suitablePerson,
        numberOfDays: tour?.numberOfDays,
        numberOfNights: tour?.numberOfNights,
        termsAndCondition: tour?.termsAndCondition,
      });
      setOldImages(tour?.images);
      setImagesPreview(tour?.images);
      setImagesUpload(tour?.images);
    }
  }, [tour, reset]);

  useEffect(() => {
    if (!tour) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour]);

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

  useEffect(() => {
    ProvinceService.getProvince()
      .then((res) => {
        setProvincesStart(res?.data.results);
      })
      .catch((e) => {
        dispatch(setErrorMess("Get province fail"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ProvinceService.getDistrict(Number(watchCityStart?.id))
      .then((res) => {
        setDistrictsStart(res?.data.results);
      })
      .catch((e) => {
        dispatch(setErrorMess("Get district fail"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCityStart?.id]);

  useEffect(() => {
    ProvinceService.getCommune(Number(watchDistrictStart?.id))
      .then((res) => {
        setCommunesStart(res?.data.results);
      })
      .catch((e) => {
        dispatch(setErrorMess("Get commune fail"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDistrictStart?.id]);

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
              "enterprise_management_section_tour_tab_information_tour_name_title_setup"
            )}
          </h3>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_tour_name"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_tour_name"
                )}
                inputRef={register("title")}
                autoComplete="off"
                name="title"
                errorMessage={errors.title?.message}
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
                title={t(
                  "enterprise_management_section_tour_tab_information_city"
                )}
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
            {/* start place */}
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_tab_information_city_start"
                )}
                name="provinceStart"
                control={control}
                selectProps={{
                  options: fetchProvinceStart(),
                  placeholder: t(
                    "enterprise_management_section_tour_tab_information_city_placeholder"
                  ),
                }}
                errorMessage={(errors.provinceStart as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_tab_information_district_start"
                )}
                name="districtStart"
                control={control}
                selectProps={{
                  options: fetchDistrictStart(),
                  placeholder: t(
                    "enterprise_management_section_tour_tab_information_district_placeholder"
                  ),
                }}
                errorMessage={(errors.districtStart as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_tab_information_commune_start"
                )}
                name="communeStart"
                control={control}
                selectProps={{
                  options: fetchCommuneStart(),
                  placeholder: t(
                    "enterprise_management_section_tour_tab_information_commune_placeholder"
                  ),
                }}
                errorMessage={(errors.communeStart as any)?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_more_location_start"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_more_location"
                )}
                autoComplete="off"
                name="moreLocationStart"
                inputRef={register("moreLocationStart")}
                errorMessage={errors.moreLocationStart?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_day"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_day"
                )}
                autoComplete="off"
                name="numberOfDays"
                inputRef={register("numberOfDays")}
                errorMessage={errors.numberOfDays?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_night"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_night"
                )}
                autoComplete="off"
                name="numberOfNights"
                inputRef={register("numberOfNights")}
                errorMessage={errors.numberOfNights?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_tab_information_suit"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_information_suit_placeholder"
                )}
                autoComplete="off"
                name="suitablePerson"
                multiline
                rows={3}
                inputRef={register("suitablePerson")}
                errorMessage={errors.suitablePerson?.message}
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
