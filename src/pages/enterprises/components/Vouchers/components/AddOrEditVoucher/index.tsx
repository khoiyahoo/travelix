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
import { TourService } from "services/enterprise/tour";
import { VoucherService } from "services/enterprise/voucher";
import { FindAll, Voucher } from "models/enterprise/voucher";
import { FindAll as FindAllStay, Stay } from "models/enterprise/stay";
import InputTextfield from "components/common/inputs/InputTextfield";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "components/common/texts/ErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { reactQuillModules } from "common/general";
import InputCreatableSelect from "components/common/inputs/InputCreatableSelect";
import { AdminGetTours, ETour } from "models/enterprise";
import {
  DataPagination,
  EDiscountType,
  OptionItem,
  discountType,
} from "models/general";

import { KeyboardArrowDown } from "@mui/icons-material";

import moment from "moment";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import InputSelect from "components/common/inputs/InputSelect";
import { getDiscountType } from "utils/getOption";
import { StayService } from "services/enterprise/stay";

export interface VoucherForm {
  startTime: Date;
  endTime: Date;
  hotelIds: OptionItem<number>[];
  tourIds: OptionItem<number>[];
  numberOfCodes: number;
  discountType: OptionItem;
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  isQuantityLimit: boolean;
}

interface Props {
  voucherId?: number;
}

// eslint-disable-next-line react/display-name
const AddOrEditVoucher = memo((props: Props) => {
  const { voucherId } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  let lang;
  if (typeof window !== "undefined") {
    ({ lang } = QueryString.parse(window.location.search));
  }

  const [dataTour, setDataTour] = useState<DataPagination<ETour>>();
  const [dataStay, setDataStay] = useState<DataPagination<Stay>>();
  const [voucher, setVoucher] = useState<Voucher>(null);
  const [dataVoucher, setDataVoucher] = useState<DataPagination<Voucher>>();
  const [anchorElMenuChooseTour, setAnchorElMenuChooseTour] =
    useState<null | HTMLElement>(null);
  const [anchorElMenuChooseStay, setAnchorElMenuChooseStay] =
    useState<null | HTMLElement>(null);
  const [tourSelected, setTourSelected] = useState<number[]>([]);
  const [isEmptyTourSelect, setIsEmptyTourSelect] = useState(false);
  const [staySelected, setStaySelected] = useState<number[]>([]);
  const [isEmptyStaySelect, setIsEmptyStaySelect] = useState(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      startTime: yup
        .date()
        .required(
          t(
            "enterprise_management_section_add_or_edit_voucher_start_time_validate"
          )
        ),
      endTime: yup
        .date()
        .min(
          yup.ref("startTime"),
          t(
            "enterprise_management_section_add_or_edit_voucher_end_time_validate_min"
          )
        )
        .required(
          t(
            "enterprise_management_section_add_or_edit_voucher_end_time_validate"
          )
        ),
      discountType: yup
        .object()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_voucher_discount_type_validate"
          )
        )
        .shape({
          id: yup.number().required("Discount type is required"),
          name: yup.string().required(),
        })
        .required(),
      discountValue:
        // yup
        //   .number()
        //   .typeError(
        //     t(
        //       "enterprise_management_section_add_or_edit_voucher_discount_value_validate"
        //     )
        //   )
        //   .positive(
        //     t(
        //       "enterprise_management_section_add_or_edit_voucher_discount_value_validate_error"
        //     )
        //   )
        //   .required(
        //     t(
        //       "enterprise_management_section_add_or_edit_voucher_discount_value_validate"
        //     )
        //   ),
        yup.number().when("discountType", {
          is: (type: OptionItem) => type?.id === EDiscountType.PERCENT,
          then: yup
            .number()
            .typeError(
              t(
                "enterprise_management_section_add_or_edit_voucher_max_discount_validate"
              )
            )
            .positive(
              t(
                "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
              )
            )
            .max(
              100,
              t(
                "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error_max"
              )
            )
            .required(
              "enterprise_management_section_add_or_edit_voucher_max_discount_validate"
            ),
          otherwise: yup
            .number()
            .typeError(
              t(
                "enterprise_management_section_add_or_edit_voucher_max_discount_validate"
              )
            )
            .positive(
              t(
                "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
              )
            )
            .required(
              t(
                "enterprise_management_section_add_or_edit_voucher_max_discount_validate"
              )
            ),
        }),
      minOder: yup
        .number()
        .typeError(
          t(
            "enterprise_management_section_add_or_edit_voucher_min_order_validate"
          )
        )
        .positive(
          t(
            "enterprise_management_section_add_or_edit_voucher_min_order_validate_error"
          )
        )
        .notRequired(),
      maxDiscount: yup.number().when("discountType", {
        is: (type: OptionItem) => type?.id === EDiscountType.PERCENT,
        then: yup
          .number()
          .typeError(
            t(
              "enterprise_management_section_add_or_edit_voucher_max_discount_validate"
            )
          )
          .nullable()
          .positive(
            t(
              "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
            )
          )
          .notRequired()
          .transform((value) => (isNaN(value) ? undefined : value)),
        otherwise: yup
          .number()
          .typeError(
            t(
              "enterprise_management_section_add_or_edit_voucher_max_discount_validate"
            )
          )
          .nullable()
          .notRequired()
          .positive(
            t(
              "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
            )
          )
          .transform((_, val) => (val !== "" ? Number(val) : null)),
      }),
      numberOfCodes: yup.number().when(["isQuantityLimit"], {
        is: (isQuantityLimit: boolean) => !!isQuantityLimit,
        then: yup
          .number()
          .typeError(
            t(
              "enterprise_management_section_add_or_edit_voucher_number_code_validate"
            )
          )
          .positive(
            t(
              "enterprise_management_section_add_or_edit_voucher_number_code_validate"
            )
          )
          .required(
            t(
              "enterprise_management_section_add_or_edit_voucher_number_code_validate_error"
            )
          ),
        otherwise: yup.number().nullable().notRequired().default(0),
      }),
      isQuantityLimit: yup
        .boolean()
        .required(
          t(
            "enterprise_management_section_add_or_edit_voucher_number_code_quantity_limit"
          )
        ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    clearErrors,
  } = useForm<VoucherForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      discountType: discountType[0],
      isQuantityLimit: false,
    },
  });

  const clearForm = () => {
    reset({
      startTime: new Date(),
      endTime: new Date(),
      hotelIds: [],
      tourIds: [],
      discountType: discountType[0],
      discountValue: null,
      minOrder: null,
      maxDiscount: null,
      numberOfCodes: null,
      isQuantityLimit: false,
    });
  };

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const onBack = () => {
    router.push("/enterprises/vouchers");
    clearForm();
  };

  useEffect(() => {
    if (voucherId && !isNaN(Number(voucherId))) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherId, dispatch]);

  const fetchData = async () => {
    dispatch(setLoading(true));
    VoucherService.findOne(Number(voucherId))
      .then((res) => {
        setVoucher(res?.data);
      })
      .catch((err) => setErrorMess(err))
      .finally(() => dispatch(setLoading(false)));
  };

  const fetchVoucher = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || dataVoucher?.meta?.take || 10,
      page: value?.page || dataVoucher?.meta?.page || 1,
      keyword: null,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    VoucherService.findAll(params)
      .then((res) => {
        setDataVoucher({
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
    TourService.getTours(params)
      .then((res) => {
        setDataTour({
          data: [{ id: -1, title: "All" }, ...res.data],
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const handleClickMenuChooseTour = (
    voucher: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElMenuChooseTour(voucher.currentTarget);
  };

  const handleCloseMenuChooseTour = () => {
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
    const params: FindAllStay = {
      take: value?.take || dataStay?.meta?.take || 10,
      page: value?.page || dataStay?.meta?.page || 1,
      keyword: "",
      status: -1,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    StayService.findAll(params)
      .then((res) => {
        setDataStay({
          data: [{ id: -1, name: "All" }, ...res.data],
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

  const onSubmit = (data: VoucherForm) => {
    dispatch(setLoading(true));
    const formData = new FormData();

    formData.append("startTime", `${data.startTime}`);
    formData.append("endTime", `${data.endTime}`);
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
      if (data?.maxDiscount === null) {
        formData.append("maxDiscount", `${0}`);
      } else {
        formData.append("maxDiscount", `${data.maxDiscount}`);
      }
    } else {
      formData.append("maxDiscount", `${0}`);
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
    if (voucher) {
      VoucherService.update(voucher.id, formData)
        .then(async () => {
          dispatch(setSuccessMess(t("common_update_success")));
          onBack();
          await fetchData();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    } else {
      VoucherService.create(formData)
        .then((res) => {
          dispatch(setSuccessMess(t("common_create_success")));
          onBack();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
  };

  useEffect(() => {
    if (voucher) {
      reset({
        startTime: new Date(voucher?.startTime),
        endTime: new Date(voucher?.endTime),
        discountType: getDiscountType(voucher?.discountType),
        discountValue: voucher?.discountValue,
        minOrder: voucher?.minOrder,
        isQuantityLimit: voucher?.isQuantityLimit,
        numberOfCodes: voucher?.numberOfCodes,
        maxDiscount: voucher?.maxDiscount,
      });
      setTourSelected(voucher.tourIds);
      setStaySelected(voucher.hotelIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucher]);

  useEffect(() => {
    fetchTour();
    fetchStay();
    fetchVoucher();
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Container className={clsx(classes.rowHeaderBox, classes.title)}>
          {!voucherId ? (
            <h3>
              {t(
                "enterprise_management_section_add_or_edit_voucher_title_create"
              )}
            </h3>
          ) : (
            <h3>
              {t(
                "enterprise_management_section_add_or_edit_voucher_title_edit"
              )}
            </h3>
          )}
          <Button onClick={onBack} btnType={BtnType.Primary}>
            {t("common_back")}
          </Button>
        </Container>
        <Container>
          <Grid
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputDatePicker
                  name={`startTime`}
                  control={control}
                  label={t(
                    "enterprise_management_section_add_or_edit_voucher_start_time"
                  )}
                  timeConstraints={{
                    minutes: { min: 0, max: 59, step: 5 },
                  }}
                  placeholder="Select date"
                  errorMessage={errors.startTime?.message}
                  isValidDate={disablePastDt}
                />
              </Grid>
              <Grid item xs={6}>
                <InputDatePicker
                  name={`endTime`}
                  control={control}
                  label={t(
                    "enterprise_management_section_add_or_edit_voucher_end_time"
                  )}
                  timeConstraints={{
                    minutes: { min: 0, max: 59, step: 5 },
                  }}
                  placeholder="Select date"
                  errorMessage={errors.endTime?.message}
                  isValidDate={disablePastDt}
                  className={classes.inputSearchDate}
                />
              </Grid>
              <Grid item xs={6}>
                <p className={classes.titleSelect}>
                  {t(
                    "enterprise_management_section_add_or_edit_voucher_select_tour"
                  )}
                </p>
                <Button
                  sx={{ width: { xs: "100%", sm: "auto" }, maxHeight: "36px" }}
                  className={classes.selectTourBtn}
                  btnType={BtnType.Outlined}
                  onClick={handleClickMenuChooseTour}
                >
                  {t(
                    "enterprise_management_section_add_or_edit_voucher_select_tour"
                  )}
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
                      "enterprise_management_section_add_or_edit_voucher_select_tour_error"
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
                      {t("common_save")}
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
                    "enterprise_management_section_add_or_edit_voucher_discount_type"
                  )}
                  name="discountType"
                  control={control}
                  selectProps={{
                    options: discountType,
                    placeholder: t(
                      "enterprise_management_section_add_or_edit_voucher_discount_type_placeholder"
                    ),
                  }}
                  errorMessage={(errors.discountType as any)?.message}
                />
              </Grid>
              {watch("discountType")?.value === EDiscountType.PERCENT && (
                <Grid item xs={12} sm={6}>
                  <InputTextfield
                    title={t(
                      "enterprise_management_section_add_or_edit_voucher_max_discount"
                    )}
                    placeholder={t(
                      "enterprise_management_section_add_or_edit_voucher_max_discount_placeholder"
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
                    "enterprise_management_section_add_or_edit_voucher_discount_value"
                  )}
                  placeholder={t(
                    "enterprise_management_section_add_or_edit_voucher_discount_value"
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
                    "enterprise_management_section_add_or_edit_voucher_min_order"
                  )}
                  placeholder={t(
                    "enterprise_management_section_add_or_edit_voucher_min_order_placeholder"
                  )}
                  autoComplete="off"
                  name="minOrder"
                  optional
                  type="number"
                  inputRef={register("minOrder")}
                  errorMessage={errors.minOrder?.message}
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
                    "enterprise_management_section_add_or_edit_voucher_is_quantity"
                  )}
                />
              </Grid>
              {watch("isQuantityLimit") && (
                <Grid item xs={12} sm={6}>
                  <InputTextfield
                    title={t(
                      "enterprise_management_section_add_or_edit_voucher_number_code"
                    )}
                    placeholder={t(
                      "enterprise_management_section_add_or_edit_voucher_number_code"
                    )}
                    autoComplete="off"
                    name="code"
                    type="number"
                    inputRef={register("numberOfCodes")}
                    errorMessage={errors.numberOfCodes?.message}
                  />
                </Grid>
              )}
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

export default AddOrEditVoucher;
