import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import clsx from "clsx";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import QueryString from "query-string";
import * as yup from "yup";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";

import { EventService } from "services/admin/event";
import { FindAll, IEvent } from "models/admin/event";
import InputTextfield from "components/common/inputs/InputTextfield";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "components/common/texts/ErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { NormalGetStay } from "models/stay";
import { AdminGetTours, ETour } from "models/enterprise";
import {
  DataPagination,
  EDiscountType,
  OptionItem,
  discountType,
} from "models/general";
import { useDropzone } from "react-dropzone";
import useIsMountedRef from "hooks/useIsMountedRef";
import { fData } from "utils/formatNumber";
import { CameraAlt, KeyboardArrowDown } from "@mui/icons-material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import moment from "moment";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import InputSelect from "components/common/inputs/InputSelect";
import { TourService } from "services/normal/tour";
import { getDiscountType } from "utils/getOption";
import { Stay } from "models/enterprise/stay";
import { StayService } from "services/normal/stay";
const PHOTO_SIZE = 10 * 1000000; // bytes
const FILE_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
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
export interface EventForm {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  code: string;
  hotelIds: OptionItem<number>[];
  tourIds: OptionItem<number>[];
  numberOfCodes: number;
  discountType?: OptionItem;
  discountValue?: number;
  minOrder?: number;
  maxDiscount?: number;
  isQuantityLimit?: boolean;
  banner: string | File;
}

interface Props {
  eventId?: number;
}

// eslint-disable-next-line react/display-name
const AddOrEditEvent = memo((props: Props) => {
  const { eventId } = props;
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  let lang;
  if (typeof window !== "undefined") {
    ({ lang } = QueryString.parse(window.location.search));
  }

  const [fileReview, setFileReview] = useState<string>("");
  const [dataTour, setDataTour] = useState<DataPagination<ETour>>();
  const [event, setEvent] = useState<IEvent>(null);
  const [dataEvent, setDataEvent] = useState<DataPagination<IEvent>>();
  const [anchorElMenuChooseTour, setAnchorElMenuChooseTour] =
    useState<null | HTMLElement>(null);
  const [tourSelected, setTourSelected] = useState<number[]>([]);
  const [isEmptyTourSelect, setIsEmptyTourSelect] = useState(false);
  const [dataStay, setDataStay] = useState<DataPagination<Stay>>();
  const [anchorElMenuChooseStay, setAnchorElMenuChooseStay] =
    useState<null | HTMLElement>(null);
  const [staySelected, setStaySelected] = useState<number[]>([]);
  const [isEmptyStaySelect, setIsEmptyStaySelect] = useState(false);
  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup
        .string()
        .required(
          t("admin_management_section_add_or_edit_event_name_validate")
        ),
      description: yup
        .string()
        .required(t("admin_management_section_add_or_edit_event_des_validate")),
      startTime: yup
        .date()
        .required(
          t("admin_management_section_add_or_edit_event_start_time_validate")
        ),
      endTime: yup
        .date()
        .min(
          yup.ref("startTime"),
          t("admin_management_section_add_or_edit_event_end_time_validate_min")
        )
        .required(
          t("admin_management_section_add_or_edit_event_end_time_validate")
        ),
      code: yup
        .string()
        .required(
          t("admin_management_section_add_or_edit_event_code_validate")
        ),

      discountType: yup
        .object()
        .typeError(
          t("admin_management_section_add_or_edit_event_discount_type_validate")
        )
        .shape({
          id: yup
            .number()
            .required(
              t(
                "admin_management_section_add_or_edit_event_discount_type_validate"
              )
            ),
          name: yup.string().required(),
        })
        .required(),
      discountValue: yup
        .number()
        .typeError(
          t(
            "admin_management_section_add_or_edit_event_discount_value_validate"
          )
        )
        .positive(
          t(
            "admin_management_section_add_or_edit_event_discount_value_validate_error"
          )
        )
        .required(
          t(
            "admin_management_section_add_or_edit_event_discount_value_validate"
          )
        ),
      minOder: yup
        .number()
        .typeError(
          t("admin_management_section_add_or_edit_event_min_order_validate")
        )
        .positive(
          t(
            "admin_management_section_add_or_edit_event_min_order_validate_error"
          )
        )
        .notRequired(),
      maxDiscount: yup.number().when("discountType", {
        is: (type: OptionItem) => type?.id === EDiscountType.PERCENT,
        then: yup
          .number()
          .typeError(
            t(
              "admin_management_section_add_or_edit_event_max_discount_validate"
            )
          )
          .positive(
            t(
              "admin_management_section_add_or_edit_event_max_discount_validate_error"
            )
          )
          .required(
            t(
              "admin_management_section_add_or_edit_event_max_discount_validate"
            )
          ),
        otherwise: yup.number().nullable().notRequired().default(0),
      }),
      numberOfCodes: yup.number().when(["isQuantityLimit"], {
        is: (isQuantityLimit: boolean) => !!isQuantityLimit,
        then: yup
          .number()
          .typeError(
            t("admin_management_section_add_or_edit_event_number_code_validate")
          )
          .positive(
            t(
              "admin_management_section_add_or_edit_event_number_code_validate_error"
            )
          )
          .required(
            t("admin_management_section_add_or_edit_event_number_code_validate")
          ),
        otherwise: yup.number().nullable().notRequired().default(0),
      }),
      isQuantityLimit: yup
        .boolean()
        .required(
          t(
            "admin_management_section_add_or_edit_event_number_code_quantity_limit"
          )
        ),
      banner: yup
        .mixed()
        .required(t("admin_management_section_add_or_edit_event_banner")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    setValue,
    watch,
    clearErrors,
  } = useForm<EventForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      discountType: discountType[0],
      isQuantityLimit: false,
    },
  });

  const isValidSize = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result as string;
        image.onload = function () {
          const height = image.height;
          const width = image.width;
          resolve(height >= 200 && width >= 200);
        };
        image.onerror = function () {
          resolve(false);
        };
      };
      reader.onerror = function () {
        resolve(false);
      };
    });
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      let file = acceptedFiles[0];
      const checkSize = file.size < PHOTO_SIZE;
      const checkType = FILE_FORMATS.includes(file.type);
      const validSize = await isValidSize(file);
      if (!validSize) {
        setError("banner", {
          message: t("admin_management_section_add_or_edit_event_image_size"),
        });
        return;
      }
      if (!checkSize) {
        setError("banner", {
          message: t(
            "admin_management_section_add_or_edit_event_image_file_size",
            {
              size: fData(PHOTO_SIZE),
            }
          ),
        });
        return;
      }
      if (!checkType) {
        setError("banner", {
          message: t("admin_management_section_add_or_edit_event_image_type"),
        });
        return;
      }
      setValue("banner", file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMountedRef]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  const clearForm = () => {
    reset({
      name: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      code: "",
      hotelIds: [],
      tourIds: [],
      discountType: discountType[0],
      discountValue: null,
      minOrder: null,
      maxDiscount: null,
      numberOfCodes: null,
      banner: undefined,
      isQuantityLimit: false,
    });
  };

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const onBack = () => {
    router.push("/admin/events");
    clearForm();
  };

  useEffect(() => {
    if (eventId && !isNaN(Number(eventId))) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, dispatch]);

  const fetchData = async () => {
    dispatch(setLoading(true));
    EventService.findOne(Number(eventId), lang)
      .then((res) => {
        setEvent(res?.data);
      })
      .catch((err) => setErrorMess(err))
      .finally(() => dispatch(setLoading(false)));
  };

  const fetchEvent = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || dataEvent?.meta?.take || 10,
      page: value?.page || dataEvent?.meta?.page || 1,
      keyword: null,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    EventService.findAll(params)
      .then((res) => {
        setDataEvent({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const fetchTour = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: AdminGetTours = {
      take: value?.take || dataTour?.meta?.take || 10,
      page: value?.page || dataTour?.meta?.page || 1,
      keyword: null,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    TourService.getAllTours(params)
      .then((res) => {
        setDataTour({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const handleClickMenuChooseTour = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElMenuChooseTour(event.currentTarget);
  };

  const handleCloseMenuChooseTour = () => {
    // setCompetingToursSelected([])
    setAnchorElMenuChooseTour(null);
  };

  const onSubmitChooseProjectTour = () => {
    handleCloseMenuChooseTour();
  };

  const onChangeChooseTour = (item: ETour) => {
    let _tourSelected = [...tourSelected];
    if (_tourSelected.includes(item.id)) {
      _tourSelected = _tourSelected.filter((it) => it !== item.id);
    } else {
      _tourSelected.push(item.id);
    }
    setTourSelected(_tourSelected);
  };

  const fetchStay = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: NormalGetStay = {
      take: value?.take || dataStay?.meta?.take || 10,
      page: value?.page || dataStay?.meta?.page || 1,
      keyword: null,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    StayService.findAll(params)
      .then((res) => {
        setDataStay({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const handleClickMenuChooseStay = (
    voucher: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElMenuChooseStay(voucher.currentTarget);
  };

  const handleCloseMenuChooseStay = () => {
    setAnchorElMenuChooseStay(null);
  };

  const onSubmitChooseProjectStay = () => {
    handleCloseMenuChooseStay();
  };

  const onChangeChooseStay = (item: Stay) => {
    let _staySelected = [...staySelected];
    if (_staySelected.includes(item.id)) {
      _staySelected = _staySelected.filter((it) => it !== item.id);
    } else {
      _staySelected.push(item.id);
    }
    setStaySelected(_staySelected);
  };

  const watchCode = watch("code");

  const handleCheckCode = () => {
    for (var i = 0; i < dataEvent?.data?.length; i++) {
      if (watchCode.trim() === dataEvent?.data[i].name) {
        setError("code", {
          message: t(
            "admin_management_section_add_or_edit_event_number_code_validate_exist"
          ),
        });
        break;
      }
    }
  };

  const onSubmit = (data: EventForm) => {
    dispatch(setLoading(true));
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("startTime", `${data.startTime}`);
    formData.append("endTime", `${data.endTime}`);
    formData.append("code", data.code);
    formData.append("discountType", `${data.discountType.value}`);
    formData.append("discountValue", `${data.discountValue}`);
    if (data?.minOrder) {
      formData.append("minOrder", `${data.minOrder}`);
    } else {
      formData.append("minOrder", `${0}`);
    }
    formData.append("isQuantityLimit", `${data.isQuantityLimit}`);
    if (data?.isQuantityLimit) {
      formData.append("numberOfCodes", `${data.numberOfCodes}`);
    }
    if (data?.discountType.value === EDiscountType.PERCENT) {
      formData.append("maxDiscount", `${data.maxDiscount}`);
    }
    if (tourSelected.length === 0) {
      setIsEmptyTourSelect(true);
    } else {
      tourSelected?.forEach((item) => {
        formData.append(`tourIds[]`, `${item}`);
      });
    }
    if (staySelected.length === 0) {
      setIsEmptyStaySelect(true);
    } else {
      staySelected?.forEach((item) => {
        formData.append(`hotelIds[]`, `${item}`);
      });
    }
    if (data.banner && typeof data.banner === "object")
      formData.append("banner", data.banner);
    if (event) {
      if (lang) {
        formData.append("language", lang);
      }
      EventService.update(event.id, formData)
        .then(async () => {
          dispatch(setSuccessMess(t("common_update_success")));
          onBack();
          await fetchData();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    } else {
      EventService.create(formData)
        .then((res) => {
          dispatch(setSuccessMess(t("common_create_success")));
          onBack();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
  };

  const banner = watch("banner");

  useEffect(() => {
    if (banner) {
      if (typeof banner === "object") {
        const reader = new FileReader();
        reader.readAsDataURL(banner);
        reader.onload = () => setFileReview(reader.result as string);
      } else {
        setFileReview(banner as string);
      }
      clearErrors("banner");
    } else setFileReview("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner]);

  useEffect(() => {
    if (event) {
      reset({
        banner: event?.banner,
        name: event?.name,
        description: event?.description,
        startTime: new Date(event?.startTime),
        endTime: new Date(event?.endTime),
        code: event?.code,
        discountType: getDiscountType(event?.discountType),
        discountValue: event?.discountValue,
        minOrder: event?.minOrder,
        isQuantityLimit: event?.isQuantityLimit,
        numberOfCodes: event?.numberOfCodes,
        maxDiscount: event?.maxDiscount,
      });
      setTourSelected(event.tourIds);
      setStaySelected(event.hotelIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    fetchTour();
    fetchStay();
    fetchEvent();
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Container className={clsx(classes.rowHeaderBox, classes.title)}>
          {!eventId ? <h3>Create event</h3> : <h3>Edit event</h3>}
          <Button onClick={onBack} btnType={BtnType.Primary}>
            Back
          </Button>
        </Container>
        <Container>
          <Grid
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputTextfield
                  title={t(
                    "admin_management_section_add_or_edit_event_event_name"
                  )}
                  placeholder={t(
                    "admin_management_section_add_or_edit_event_event_name"
                  )}
                  inputRef={register("name")}
                  autoComplete="off"
                  name="name"
                  errorMessage={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputDatePicker
                  name={`startTime`}
                  control={control}
                  label={t(
                    "admin_management_section_add_or_edit_event_start_time"
                  )}
                  timeConstraints={{
                    minutes: { min: 0, max: 59, step: 5 },
                  }}
                  placeholder={t(
                    "admin_management_section_add_or_edit_event_start_time"
                  )}
                  errorMessage={errors.startTime?.message}
                  isValidDate={disablePastDt}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputDatePicker
                  name={`endTime`}
                  control={control}
                  label={t(
                    "admin_management_section_add_or_edit_event_end_time"
                  )}
                  timeConstraints={{
                    minutes: { min: 0, max: 59, step: 5 },
                  }}
                  placeholder={t(
                    "admin_management_section_add_or_edit_event_end_time"
                  )}
                  errorMessage={errors.endTime?.message}
                  isValidDate={disablePastDt}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <p className={classes.titleSelect}>
                  {t("admin_management_section_add_or_edit_event_select_tour")}
                </p>
                <Button
                  sx={{ width: { xs: "100%", sm: "auto" }, maxHeight: "36px" }}
                  className={classes.selectTourBtn}
                  btnType={BtnType.Outlined}
                  onClick={handleClickMenuChooseTour}
                >
                  {t("admin_management_section_add_or_edit_event_select_tour")}
                  <KeyboardArrowDown
                    sx={{
                      color: "var(--gray-80)",
                      marginRight: "0px !important",
                    }}
                  />
                </Button>
                {isEmptyTourSelect && (
                  <ErrorMessage>
                    {t(
                      "admin_management_section_add_or_edit_event_select_tour_error"
                    )}
                  </ErrorMessage>
                )}
                <Menu
                  anchorEl={anchorElMenuChooseTour}
                  open={Boolean(anchorElMenuChooseTour)}
                  onClose={handleCloseMenuChooseTour}
                  sx={{ mt: 1 }}
                >
                  <Grid className={classes.menuChooseTour}>
                    {dataTour?.data.map((item, index) => (
                      <MenuItem
                        key={index}
                        classes={{
                          root: clsx(classes.rootMenuItemChooseTour),
                        }}
                        onClick={() => onChangeChooseTour(item)}
                      >
                        <Grid
                          className={clsx(classes.menuItemFlex, {
                            [classes.listFlexChecked]: tourSelected.includes(
                              item?.id
                            ),
                          })}
                        >
                          <Grid>
                            <InputCheckbox
                              checked={tourSelected.includes(item?.id)}
                              classes={{ root: classes.rootMenuCheckbox }}
                            />
                          </Grid>
                          <Grid item className={classes.listTextLeft}>
                            <p>{item.title}</p>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Grid>
                  <Grid className={classes.menuChooseTourAction}>
                    <Button
                      btnType={BtnType.Outlined}
                      translation-key="common_cancel"
                      onClick={handleCloseMenuChooseTour}
                    >
                      {t("common_cancel")}
                    </Button>
                    <Button
                      btnType={BtnType.Primary}
                      translation-key="common_done"
                      className={classes.btnSave}
                      onClick={onSubmitChooseProjectTour}
                    >
                      {t("common_done")}
                    </Button>
                  </Grid>
                </Menu>
              </Grid>
              <Grid item xs={6}>
                <p className={classes.titleSelect}>
                  {t(
                    "enterprise_management_section_add_or_edit_voucher_select_stay"
                  )}
                </p>
                <Button
                  sx={{ width: { xs: "100%", sm: "auto" }, maxHeight: "36px" }}
                  className={classes.selectTourBtn}
                  btnType={BtnType.Outlined}
                  onClick={handleClickMenuChooseStay}
                >
                  {t(
                    "enterprise_management_section_add_or_edit_voucher_select_stay"
                  )}
                  <KeyboardArrowDown
                    sx={{
                      color: "var(--gray-80)",
                      marginRight: "0px !important",
                    }}
                  />
                </Button>
                {isEmptyStaySelect && (
                  <ErrorMessage>
                    {t(
                      "enterprise_management_section_add_or_edit_voucher_select_tour_error"
                    )}
                  </ErrorMessage>
                )}
                <Menu
                  anchorEl={anchorElMenuChooseStay}
                  open={Boolean(anchorElMenuChooseStay)}
                  onClose={handleCloseMenuChooseStay}
                  sx={{ mt: 1 }}
                >
                  <Grid className={classes.menuChooseTour}>
                    {dataStay?.data.map((item, index) => (
                      <MenuItem
                        key={index}
                        classes={{
                          root: clsx(classes.rootMenuItemChooseStay),
                        }}
                        onClick={() => onChangeChooseStay(item)}
                      >
                        <Grid
                          className={clsx(classes.menuItemFlex, {
                            [classes.listFlexChecked]: staySelected.includes(
                              item?.id
                            ),
                          })}
                        >
                          <Grid>
                            <InputCheckbox
                              checked={staySelected.includes(item?.id)}
                              classes={{ root: classes.rootMenuCheckbox }}
                            />
                          </Grid>
                          <Grid item className={classes.listTextLeft}>
                            <p>{item.name}</p>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Grid>
                  <Grid className={classes.menuChooseTourAction}>
                    <Button
                      btnType={BtnType.Outlined}
                      translation-key="common_cancel"
                      onClick={handleCloseMenuChooseStay}
                    >
                      {t("common_cancel")}
                    </Button>
                    <Button
                      btnType={BtnType.Primary}
                      translation-key="common_done"
                      className={classes.btnSave}
                      onClick={onSubmitChooseProjectStay}
                    >
                      {t("common_save")}
                    </Button>
                  </Grid>
                </Menu>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputSelect
                  fullWidth
                  title={t(
                    "admin_management_section_add_or_edit_event_discount_type"
                  )}
                  name="discountType"
                  control={control}
                  selectProps={{
                    options: discountType,
                    placeholder: t(
                      "admin_management_section_add_or_edit_event_discount_type_placeholder"
                    ),
                  }}
                  errorMessage={(errors.discountType as any)?.message}
                />
              </Grid>
              {watch("discountType")?.value === EDiscountType.PERCENT && (
                <Grid item xs={12} sm={6}>
                  <InputTextfield
                    title={t(
                      "admin_management_section_add_or_edit_event_max_discount"
                    )}
                    placeholder={t(
                      "admin_management_section_add_or_edit_event_max_discount_placeholder"
                    )}
                    autoComplete="off"
                    name="maxDiscount"
                    optional
                    type="number"
                    inputRef={register("maxDiscount")}
                    errorMessage={errors.maxDiscount?.message}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <InputTextfield
                  title={t(
                    "admin_management_section_add_or_edit_event_discount_value"
                  )}
                  placeholder={t(
                    "admin_management_section_add_or_edit_event_discount_value"
                  )}
                  autoComplete="off"
                  name="discountValue"
                  type="number"
                  inputRef={register("discountValue")}
                  errorMessage={errors.discountValue?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputTextfield
                  title={t(
                    "admin_management_section_add_or_edit_event_min_order"
                  )}
                  placeholder={t(
                    "admin_management_section_add_or_edit_event_min_order_placeholder"
                  )}
                  autoComplete="off"
                  name="minOrder"
                  optional
                  type="number"
                  inputRef={register("minOrder")}
                  errorMessage={errors.minOrder?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputTextfield
                  title={t("admin_management_section_add_or_edit_event_code")}
                  placeholder={t(
                    "admin_management_section_add_or_edit_event_code_placeholder"
                  )}
                  autoComplete="off"
                  name="code"
                  onBlur={handleCheckCode}
                  inputRef={register("code")}
                  errorMessage={errors.code?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  className={classes.checkBoxQuantity}
                  control={
                    <Controller
                      name="isQuantityLimit"
                      control={control}
                      render={({ field }) => (
                        <Checkbox checked={field.value} {...field} />
                      )}
                    />
                  }
                  label={t(
                    "admin_management_section_add_or_edit_event_is_quantity"
                  )}
                />
              </Grid>
              {watch("isQuantityLimit") && (
                <Grid item xs={12} sm={6}>
                  <InputTextfield
                    title={t(
                      "admin_management_section_add_or_edit_event_number_code"
                    )}
                    placeholder={t(
                      "admin_management_section_add_or_edit_event_number_code"
                    )}
                    autoComplete="off"
                    name="code"
                    type="number"
                    inputRef={register("numberOfCodes")}
                    errorMessage={errors.numberOfCodes?.message}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid xs={12} item>
                <p className={classes.titleInput}>
                  {t("admin_management_section_add_or_edit_event_description")}
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
                        "admin_management_section_add_or_edit_event_description"
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

              <Grid
                xs={12}
                item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p className={classes.titleInput}>
                  {t(
                    "admin_management_section_add_or_edit_event_upload_banner"
                  )}
                </p>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    className={classes.imgUp}
                    style={{
                      border: fileReview
                        ? "1px solid rgba(28, 28, 28, 0.2)"
                        : "1px dashed rgba(28, 28, 28, 0.2)",
                      minHeight: fileReview ? 200 : "unset",
                    }}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {fileReview ? (
                      <>
                        <img
                          src={fileReview}
                          className={classes.imgPreview}
                          alt="preview"
                        />
                        <IconButton
                          aria-label="upload"
                          className={classes.btnUpload}
                        >
                          <CameraAlt />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <AddPhotoAlternateOutlinedIcon
                          className={classes.imgAddPhoto}
                        />
                        <p className={classes.selectImgTitle}>
                          {t(
                            "admin_management_section_add_or_edit_event_select_banner"
                          )}
                        </p>
                      </>
                    )}
                  </Grid>
                  <ErrorMessage>{errors?.banner?.message}</ErrorMessage>
                </Grid>
              </Grid>
            </Grid>
            <Grid className={classes.footer}>
              <Button
                btnType={BtnType.Primary}
                type="submit"
                className={classes.btnSave}
              >
                {t("common_save")}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
});

export default AddOrEditEvent;
