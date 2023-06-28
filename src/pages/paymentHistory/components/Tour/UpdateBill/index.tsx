import React, { memo, useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { TourService } from "services/normal/tour";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { Collapse, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextfield";
import { VALIDATION } from "configs/constants";
import * as yup from "yup";
import PopupDetailTour from "pages/listTour/[tourId]/components/SectionTour/components/PopupDetailTour";
import { BookTourReview, Tour } from "models/tour";
import { ReducerType } from "redux/reducers";
import moment from "moment";
import {
  fCurrency2,
  fCurrency2VND,
  fPercent,
  fShortenNumber,
} from "utils/formatNumber";
import _ from "lodash";
import {
  DataPagination,
  EDiscountType,
  EServicePolicyType,
  EServiceType,
  OptionItem,
} from "models/general";
import { FindAll, Voucher } from "models/voucher";
import { VoucherService } from "services/normal/voucher";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import InputTextfield from "components/common/inputs/InputTextfield";
import { TourBillService } from "services/normal/tourBill";
import { TourBill } from "models/tourBill";
import InputCounter from "components/common/inputs/InputCounter";
import InputSelect from "components/common/inputs/InputSelect";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import { BillHelper } from "helpers/bill";
import PopupVoucherNew from "pages/book/tour/[tourId]/components/PopopVoucherNew";
import { EventService } from "services/normal/event";
import { IEvent } from "models/event";
var isEmpty = require("lodash.isempty");

const CHARACTER_LIMIT = 100;

const languageOptions = [
  { id: 1, name: "English", value: "English" },
  { id: 2, name: "VietNamese", value: "VietNamese" },
];

interface PriceAndAge {
  tourOnSaleId: number;
  childrenAgeMin: number;
  childrenAgeMax: number;
  priceChildren: number;
  adultPrice: number;
  discount: number;
  quantity: number;
  quantityOrdered: number;
}

export interface BookForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  tourId: number;
  tourOnSaleId: number;
  price: number;
  discount: number;
  totalBill: number;
  numberOfAdult: number;
  numberOfChild: number;
  priceOfChild: number;
  priceOfAdult: number;
  startDate: Date;
  specialRequest?: string;
  language?: OptionItem;
}

interface Props {
  tourBillId: number;
  onSubmit?: (data: BookTourReview) => void;
}
// eslint-disable-next-line react/display-name
const BookingComponent = memo(({ tourBillId, onSubmit }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const { getSelectChangeDate } = useSelector(
    (state: ReducerType) => state.normal
  );

  const { t, i18n } = useTranslation("common");

  const [tourBill, setTourBill] = useState<TourBill>(null);
  const [tour, setTour] = useState<Tour>();
  const [openPopupDetailTour, setOpenPopupDetailTour] = useState(false);
  const [openPopupVoucher, setOpenPopupVoucher] = useState(false);
  const [voucher, setVoucher] = useState<DataPagination<Voucher>>();
  const [openCollapseReschedule, setOpenCollapseReschedule] = useState(false);
  const [voucherChoose, setVoucherChoose] = useState<Voucher>();
  const [priceAndAge, setPriceAndAge] = useState<PriceAndAge>({
    tourOnSaleId: null,
    childrenAgeMin: null,
    childrenAgeMax: null,
    priceChildren: null,
    adultPrice: null,
    discount: null,
    quantity: null,
    quantityOrdered: null,
  });
  const [totalBillReschedule, setTotalBillReschedule] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalBillAfterDiscount, setTotalBillAfterDiscount] = useState(0);
  const [isValidQuantity, setIsValidQuantity] = useState(false);
  const [priceMustPay, setPriceMustPay] = useState(null);
  const [inputValueCode, setInputValueCode] = useState(null);
  const [valueEvent, setValueEvent] = useState<IEvent>(null);

  const dayValid = useMemo(() => {
    return tour?.tourOnSales?.map((item) => {
      return moment(item.startDate).format("DD/MM/YYYY");
    });
  }, [tour]);
  const refundRate = useMemo(() => {
    return (
      BillHelper.getRefundRate(
        tourBill?.tourOnSaleData?.startDate,
        EServicePolicyType.REFUND,
        tourBill?.tourData?.tourPolicies
      ) || 0
    );
  }, [tourBill]);
  const priceRefund = useMemo(() => {
    return (tourBill?.totalBill * refundRate) / 100 || 0;
  }, [tourBill, refundRate]);

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup
        .string()
        .required(t("update_bill_contact_detail_first_name_validation")),
      lastName: yup
        .string()
        .required(t("update_bill_contact_detail_last_name_validation")),
      email: yup
        .string()
        .email(t("update_bill_contact_detail_email_validation"))
        .required(t("update_bill_contact_detail_email_validation_error")),
      phoneNumber: yup
        .string()
        .required(t("update_bill_contact_detail_phone_validation"))
        .matches(VALIDATION.phone, {
          message: t("update_bill_contact_detail_phone_validation"),
          excludeEmptyString: true,
        }),
      startDate: yup.date().required(),
      numberOfAdult: yup.number().notRequired(),
      numberOfChild: yup.number().notRequired(),
      specialRequest: yup.string().notRequired(),
      language: yup
        .object()
        .typeError("Language is required.")
        .shape({
          id: yup.number().required("Language is required"),
          name: yup.string().required(),
          value: yup.string().required(),
        })
        .required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<BookForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      language: languageOptions[0],
    },
  });

  const specialRequest = watch("specialRequest");
  const _numberOfChild = watch("numberOfChild");
  const _numberOfAdult = watch("numberOfAdult");
  const _startDate = watch("startDate");

  useEffect(() => {
    if (tourBillId && !isNaN(Number(tourBillId))) {
      TourBillService.getTourBill(tourBillId)
        .then((res) => {
          setTourBill(res?.data);
        })
        .catch((err) => {
          dispatch(setErrorMess(err));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourBillId]);

  useEffect(() => {
    if (_startDate) {
      handleChangeStartDate(_startDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_startDate]);

  useEffect(() => {
    if (!isEmpty(tourBill)) {
      TourService.getTour(tourBill?.tourData?.id)
        .then((res) => {
          setTour(res.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        });
    }
    reset({
      lastName: tourBill?.lastName,
      firstName: tourBill?.firstName,
      email: tourBill?.email,
      phoneNumber: tourBill?.phoneNumber,
      specialRequest: tourBill?.specialRequest,
      startDate: new Date(getSelectChangeDate?.startDate),
      numberOfAdult: tourBill?.amountAdult,
      numberOfChild: tourBill?.amountChild,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourBill]);

  useEffect(() => {
    setPriceAndAge({
      tourOnSaleId: getSelectChangeDate?.id,
      childrenAgeMin: getSelectChangeDate?.childrenAgeMin,
      childrenAgeMax: getSelectChangeDate?.childrenAgeMax,
      priceChildren: getSelectChangeDate?.childrenPrice,
      adultPrice: getSelectChangeDate?.adultPrice,
      discount: getSelectChangeDate?.discount,
      quantity: getSelectChangeDate?.quantity,
      quantityOrdered: getSelectChangeDate?.quantityOrdered,
    });
  }, [getSelectChangeDate]);

  useEffect(() => {
    if (!isEmpty(tour) && !isEmpty(tour.tourOnSales)) {
      fetchVoucher();
      for (let item of tour.tourOnSales) {
        if (
          moment(item.startDate).format("DD/MM/YYYY") !==
          moment(tourBill.tourOnSaleData.startDate).format("DD/MM/YYYY")
        ) {
          setValue("startDate", new Date(item.startDate));
          handleChangeStartDate(moment(item.startDate));
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour]);

  useEffect(() => {
    console.log(priceAndAge?.priceChildren, _numberOfChild);
    if (
      _numberOfAdult + _numberOfChild >=
      priceAndAge.quantity - priceAndAge.quantityOrdered
    ) {
      setIsValidQuantity(true);
    } else {
      setIsValidQuantity(false);
    }
    setTotalBillReschedule(
      ((_numberOfChild * priceAndAge?.priceChildren +
        _numberOfAdult * priceAndAge?.adultPrice) *
        (100 - priceAndAge?.discount)) /
        100
    );
  }, [priceAndAge, _numberOfAdult, _numberOfChild]);

  useEffect(() => {
    let discount = 0;
    if (voucherChoose) {
      if (voucherChoose?.discountType === EDiscountType.PERCENT) {
        discount = (totalBillReschedule * voucherChoose.discountValue) / 100;
        if (
          !!voucherChoose.maxDiscount &&
          discount > voucherChoose.maxDiscount
        ) {
          discount = voucherChoose.maxDiscount;
        }
      } else {
        discount = voucherChoose.discountValue;
      }
    }
    setVoucherDiscount(discount);
  }, [totalBillReschedule, voucherChoose]);

  useEffect(() => {
    let discount = 0;
    if (valueEvent) {
      if (
        !valueEvent?.minOrder ||
        totalBillReschedule >= valueEvent?.minOrder
      ) {
        if (valueEvent?.discountType === EDiscountType.PERCENT) {
          discount = (totalBillReschedule * valueEvent.discountValue) / 100;
          if (!!valueEvent.maxDiscount && discount > valueEvent.maxDiscount) {
            discount = valueEvent.maxDiscount;
          }
        } else {
          discount = valueEvent.discountValue;
        }
        dispatch(setSuccessMess(t("update_bill_price_apply_coupon_success")));
      } else {
        dispatch(
          setErrorMess({
            message: t("update_bill_price_apply_coupon_min_price", {
              minPrice: fCurrency2VND(valueEvent?.minOrder),
            }),
          })
        );
      }
    }
    setCouponDiscount(discount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBillReschedule, valueEvent]);

  useEffect(() => {
    setTotalBillAfterDiscount(
      totalBillReschedule - voucherDiscount - couponDiscount
    );
  }, [totalBillReschedule, voucherDiscount, couponDiscount]);

  useEffect(() => {
    setPriceMustPay(totalBillAfterDiscount - priceRefund);
  }, [totalBillAfterDiscount, priceRefund]);

  const onOpenPopupDetailTour = () =>
    setOpenPopupDetailTour(!openPopupDetailTour);

  const onOpenPopupVoucher = () => setOpenPopupVoucher(!openPopupVoucher);

  const _onSubmit = (data: BookForm) => {
    const price = totalBillReschedule / (1 - priceAndAge?.discount / 100);
    TourBillService.reSchedule(tourBill?.id, {
      tourId: tour?.id,
      tourOnSaleId: priceAndAge?.tourOnSaleId,
      amountChild: data?.numberOfChild,
      amountAdult: data?.numberOfAdult,
      price: price,
      discount: price - totalBillAfterDiscount,
      totalBill: totalBillAfterDiscount,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      firstName: data?.firstName,
      lastName: data?.lastName,
      extraPay: priceMustPay >= 0 ? priceMustPay : null,
      moneyRefund: priceMustPay < 0 ? -priceMustPay : null,
    })
      .then((res) => {
        if (priceMustPay >= 0) {
          router.push(res?.data?.checkoutUrl);
        } else {
          router.push("/paymentHistory/tour");
        }
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      });
  };

  const fetchVoucher = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
    owner?: number;
  }) => {
    const params: FindAll = {
      take: value?.take || voucher?.meta?.take || 10,
      page: value?.page || voucher?.meta?.page || 1,
      keyword: undefined,
      owner: tour?.owner,
      serviceType: EServiceType.TOUR,
      serviceId: tour?.id,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }

    VoucherService.getAllVouchers(params)
      .then((res) => {
        setVoucher({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      });
  };

  const onChooseVoucher = (data: Voucher) => {
    setVoucherChoose(data);
    setOpenPopupVoucher(false);
  };

  const handleValidVoucher = (startTime) => {
    var bookDate = new Date();
    let isValid = false;
    if (bookDate < new Date(startTime)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid;
  };

  const onUseCoupon = () => {
    dispatch(setLoading(true));
    EventService.findByCode(inputValueCode)
      .then((res) => {
        setValueEvent(res?.data);
      })
      .catch((e) => {
        dispatch(
          setErrorMess({ message: t("update_bill_price_apply_coupon_fail") })
        );
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const yesterday = moment().subtract(1, "day");

  const disableCustomDt = (current) => {
    return (
      dayValid?.includes(current.format("DD/MM/YYYY")) &&
      current.isAfter(yesterday) &&
      !current.isSame(tourBill?.tourOnSaleData?.startDate)
    );
  };

  const handleChangeStartDate = (e) => {
    tour?.tourOnSales.forEach((item) => {
      if (
        moment(item.startDate).format("DD/MM/YYYY") ===
        moment(e._d).format("DD/MM/YYYY")
      ) {
        setPriceAndAge({
          tourOnSaleId: item?.id,
          childrenAgeMin: item.childrenAgeMin,
          childrenAgeMax: item.childrenAgeMax,
          priceChildren: item.childrenPrice,
          adultPrice: item.adultPrice,
          discount: item.discount,
          quantity: item.quantity,
          quantityOrdered: item.quantityOrdered,
        });
      }
    });
  };

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
        <Container>
          <Grid container spacing={2} className={classes.rootContent}>
            <Grid xs={7} item className={classes.leftPanel}>
              <Grid item xs={12}>
                <h4 className={classes.title}>
                  {t("update_bill_contact_detail_title")}
                </h4>
                <Grid
                  sx={{
                    backgroundColor: "var(--white-color)",
                    padding: "24px 16px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    container
                    columnSpacing={isMobile ? 0 : 1}
                    rowSpacing={3}
                  >
                    <Grid item xs={12} sm={6}>
                      <InputTextField
                        title={t("update_bill_contact_detail_first_name")}
                        placeholder={t("update_bill_contact_detail_first_name")}
                        inputRef={register("firstName")}
                        startAdornment={
                          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        }
                        errorMessage={errors?.firstName?.message}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputTextField
                        title={t("update_bill_contact_detail_last_name")}
                        placeholder={t("update_bill_contact_detail_last_name")}
                        inputRef={register("lastName")}
                        startAdornment={
                          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        }
                        errorMessage={errors?.lastName?.message}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <InputTextField
                      title={t("update_bill_contact_detail_email")}
                      placeholder={t("update_bill_contact_detail_email")}
                      inputRef={register("email")}
                      startAdornment={
                        <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                      }
                      errorMessage={errors?.email?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputTextField
                      title={t("update_bill_contact_detail_phone")}
                      placeholder={t("update_bill_contact_detail_phone")}
                      inputRef={register("phoneNumber")}
                      startAdornment={
                        <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                      }
                      errorMessage={errors?.phoneNumber?.message}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t("update_bill_special_request_title")}
                  </h4>
                  <Grid
                    sx={{
                      backgroundColor: "var(--white-color)",
                      padding: "24px 16px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                      borderRadius: "10px",
                    }}
                  >
                    <p>{t("update_bill_special_request_sub_title")}</p>
                    <InputTextfield
                      title={t("update_bill_special_request_title_input")}
                      optional
                      multiline
                      rows={3}
                      infor={`${
                        specialRequest?.length || 0
                      }/${CHARACTER_LIMIT}`}
                      inputRef={register("specialRequest")}
                      inputProps={{
                        maxLength: CHARACTER_LIMIT,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t("update_bill_price_detail_title")}
                  </h4>
                  <Grid
                    sx={{
                      backgroundColor: "var(--white-color)",
                      padding: "24px 16px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Grid
                      // className={classes.boxPrice}
                      sx={{
                        borderBottom: "1px solid Var(--gray-10)",
                        paddingBottom: "14px",
                      }}
                    >
                      <Grid className={classes.boxReschedule}>
                        <p className={classes.titlePrice}>
                          {t("update_bill_price_detail_price_you_pay")}:
                        </p>
                        <p>
                          {fCurrency2VND(tourBill?.totalBill)}
                          VND
                        </p>
                      </Grid>
                      <Grid className={classes.boxReschedule}>
                        <p>
                          {t("update_bill_price_detail_price_reimbursed")} (
                          {refundRate}%):
                        </p>
                        <p>{fCurrency2VND(priceRefund)} VND</p>
                      </Grid>
                    </Grid>
                    <Grid
                      className={classes.boxPrice}
                      sx={{
                        borderBottom: "1px solid Var(--gray-10)",
                        padding: "14px 0",
                      }}
                      onClick={() =>
                        setOpenCollapseReschedule(!openCollapseReschedule)
                      }
                    >
                      <Grid>
                        {" "}
                        <p className={classes.titlePrice}>
                          {t(
                            "update_bill_price_detail_price_you_pay_reschedule"
                          )}
                        </p>
                      </Grid>
                      <Grid sx={{ display: "flex", alignItems: "center" }}>
                        <h4 className={classes.price}>
                          {fCurrency2VND(totalBillReschedule)}
                          VND
                        </h4>
                        {openCollapseReschedule ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </Grid>
                    </Grid>
                    <Collapse
                      in={openCollapseReschedule}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Grid
                        className={classes.boxPriceDetail}
                        sx={{
                          borderBottom: "1px solid Var(--gray-10)",
                        }}
                      >
                        {priceAndAge?.discount !== 0 && (
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>{t("update_bill_price_detail_discount")}</p>
                            {priceAndAge?.discount <= 100 ? (
                              <p>{fPercent(priceAndAge?.discount)}</p>
                            ) : (
                              <p>{fCurrency2VND(priceAndAge?.discount)} VND</p>
                            )}
                          </Grid>
                        )}
                        <Grid
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <p>
                            {t("update_bill_price_detail_adult")} (
                            {_numberOfAdult}x)
                          </p>
                          <p>
                            {" "}
                            {fCurrency2VND(
                              priceAndAge?.adultPrice * _numberOfAdult
                            )}{" "}
                            VND
                          </p>
                        </Grid>
                        {_numberOfChild !== 0 && (
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>
                              {t("update_bill_price_detail_child")} (
                              {_numberOfChild}x)
                            </p>
                            <p>
                              {" "}
                              {fCurrency2VND(
                                priceAndAge?.priceChildren * _numberOfChild
                              )}{" "}
                              VND
                            </p>
                          </Grid>
                        )}
                      </Grid>
                    </Collapse>
                    <Grid className={classes.containerVoucher}>
                      <Grid className={classes.titleVoucher}>
                        <MonetizationOnIcon />
                        <p>{t("update_bill_price_detail_discount_code")}</p>
                      </Grid>
                      <Grid className="d-flex">
                        <Grid sx={{ display: "flex", paddingTop: "14px" }}>
                          {voucherChoose ? (
                            <Grid>
                              {voucherChoose?.discountType ===
                              EDiscountType.PERCENT ? (
                                <Grid
                                  className={clsx(classes.boxVoucher, {
                                    [classes.boxVoucherInValid]:
                                      handleValidVoucher(
                                        voucherChoose?.startTime
                                      ),
                                  })}
                                >
                                  <span>
                                    {t("voucher_title_deal")}{" "}
                                    {fPercent(voucherChoose?.discountValue)}
                                  </span>
                                  {voucherChoose?.maxDiscount !== 0 && (
                                    <span>
                                      {t("voucher_title_max")}{" "}
                                      {fCurrency2VND(
                                        voucherChoose?.maxDiscount
                                      )}{" "}
                                      VND
                                    </span>
                                  )}
                                </Grid>
                              ) : (
                                <Grid
                                  className={clsx(classes.boxVoucher, {
                                    [classes.boxVoucherInValid]:
                                      handleValidVoucher(
                                        voucherChoose?.startTime
                                      ),
                                  })}
                                >
                                  {t("voucher_title_deal")}{" "}
                                  {fShortenNumber(voucherChoose?.discountValue)}{" "}
                                  VND
                                </Grid>
                              )}
                            </Grid>
                          ) : (
                            <Grid>
                              <p style={{ fontWeight: "600" }}>
                                {t("update_bill_price_detail_no_use_voucher")}
                              </p>
                            </Grid>
                          )}
                        </Grid>
                        <Grid
                          className={classes.btnChooseVoucher}
                          onClick={onOpenPopupVoucher}
                        >
                          <p>{t("update_bill_price_detail_choose_voucher")}</p>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: "8px" }}>
                      <Grid item xs={8}>
                        <InputTextfield
                          title={t(
                            "book_page_section_price_detail_use_coupon_btn_title"
                          )}
                          placeholder="Example: CHEAPTRAVEL"
                          type="text"
                          onChange={(e) => setInputValueCode(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          btnType={BtnType.Primary}
                          className={classes.btnUseCoupon}
                          onClick={onUseCoupon}
                        >
                          {t("book_page_section_price_detail_use_coupon_btn")}
                        </Button>
                      </Grid>
                    </Grid>
                    {(!!voucherDiscount || !!couponDiscount) && (
                      <Grid
                        sx={{
                          borderBottom: "1px solid Var(--gray-10)",
                        }}
                      >
                        <Grid className={classes.boxReschedule}>
                          <p>
                            {t("update_bill_price_detail_total_coupon_price")}:
                          </p>
                          <p>
                            {fCurrency2VND(voucherDiscount + couponDiscount)}{" "}
                            VND
                          </p>
                        </Grid>
                        <Grid
                          className={clsx(
                            classes.boxReschedule,
                            classes.boxPrice
                          )}
                        >
                          <p>
                            {t(
                              "update_bill_price_detail_price_after_apply_coupon"
                            )}
                            :
                          </p>
                          <h4 className={classes.price}>
                            {fCurrency2VND(totalBillAfterDiscount)} VND
                          </h4>
                        </Grid>
                      </Grid>
                    )}
                    <Grid>
                      {priceMustPay >= 0 ? (
                        <Grid className={classes.boxReschedule}>
                          <p>
                            {t("update_bill_price_detail_price_you_extra")}:
                          </p>
                          <p>{fCurrency2VND(priceMustPay)} VND</p>
                        </Grid>
                      ) : (
                        <Grid className={classes.boxReschedule}>
                          <p>
                            {t("update_bill_price_detail_price_you_reimbursed")}
                            :
                          </p>
                          <p>{fCurrency2VND(-priceMustPay)} VND</p>
                        </Grid>
                      )}
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingTop: "14px",
                      }}
                      className={classes.btnContinue}
                    >
                      <Button btnType={BtnType.Primary} type="submit">
                        {t("update_bill_price_detail_continue_to_pay")}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              xs={5}
              item
              sx={{ marginTop: "40px" }}
              className={classes.rightPanel}
            >
              <Grid className={classes.rootPanelRight}>
                <Grid className={classes.boxTitle}>
                  <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>
                  <p>{t("update_bill_booking_summary_title")}</p>
                </Grid>
                <Grid className={classes.boxProduct}>
                  <Grid>
                    <p>{tourBill?.tourData?.title}</p>
                  </Grid>
                  <Grid className={classes.product}>
                    <img src={tourBill?.tourData?.images[0]} alt="anh"></img>
                    <p onClick={onOpenPopupDetailTour}>
                      {t("update_bill_booking_summary_view_detail")}
                    </p>
                  </Grid>
                </Grid>
                <Grid className={classes.boxSelect}>
                  <p>{t("update_bill_section_when")}</p>
                  <Grid sx={{ paddingTop: "14px" }}>
                    <InputDatePicker
                      control={control}
                      name="startDate"
                      placeholder="Check-out"
                      closeOnSelect={true}
                      timeFormat={false}
                      className={classes.inputStartDate}
                      isValidDate={disableCustomDt}
                      inputRef={register("startDate")}
                      // _onChange={(e) => setStartDateSelected(e)}
                      errorMessage={errors.startDate?.message}
                    />
                  </Grid>
                </Grid>
                <Grid className={classes.boxSelect}>
                  <p>{t("update_bill_section_many_ticket")}</p>
                  <Grid className={classes.boxNumberTickets}>
                    <Grid>
                      <p>
                        {t("update_bill_section_adult")} (
                        {t("update_bill_section_age")} &gt;{" "}
                        {priceAndAge?.childrenAgeMax})
                      </p>
                      <span>{fCurrency2(priceAndAge?.adultPrice)} VND</span>
                    </Grid>
                    <Grid>
                      <Controller
                        name="numberOfAdult"
                        control={control}
                        render={({ field }) => (
                          <InputCounter
                            className={classes.inputCounter}
                            max={
                              priceAndAge?.quantity -
                              priceAndAge.quantityOrdered
                            }
                            min={
                              priceAndAge?.quantity -
                                priceAndAge.quantityOrdered ===
                              0
                                ? 0
                                : 1
                            }
                            onChange={field.onChange}
                            value={field.value}
                            valueDisable={
                              watch("numberOfAdult") + watch("numberOfChild") >
                              priceAndAge?.quantity -
                                priceAndAge.quantityOrdered
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid className={classes.boxNumberTickets}>
                    <Grid>
                      <p>
                        {t("update_bill_section_child")} (
                        {t("update_bill_section_age")}{" "}
                        {priceAndAge?.childrenAgeMin}-
                        {priceAndAge?.childrenAgeMax})
                      </p>
                      <span>{fCurrency2(priceAndAge?.priceChildren)} VND</span>
                    </Grid>
                    <Grid>
                      <Controller
                        name="numberOfChild"
                        control={control}
                        render={({ field }) => (
                          <InputCounter
                            className={classes.inputCounter}
                            max={
                              priceAndAge?.quantity -
                              priceAndAge.quantityOrdered
                            }
                            min={tourBill?.amountChild}
                            onChange={field.onChange}
                            value={field.value}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <div className={classes.priceWrapper}>
                  <Grid>
                    <p
                      className={classes.discount}
                      dangerouslySetInnerHTML={{
                        __html: t("update_bill_section_number_ticket_left", {
                          number:
                            priceAndAge?.quantity - priceAndAge.quantityOrdered,
                        }),
                      }}
                    ></p>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      paddingTop: "10px",
                    }}
                  >
                    <p>{t("update_bill_section_duration")}: &nbsp;</p>
                    <p>
                      {tour?.numberOfDays} {t("update_bill_section_days")} -{" "}
                      {tour?.numberOfNights} {t("update_bill_section_nights")}
                    </p>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      paddingTop: "10px",
                    }}
                  >
                    <p>{t("update_bill_section_booking_date")}: &nbsp;</p>
                    <p>{moment(tourBill?.createdAt).format("DD-MM-YYYY")}</p>
                  </Grid>
                </div>
              </Grid>
              <Grid className={classes.btnContinueMobile}>
                <Button btnType={BtnType.Secondary} type="submit">
                  {t("update_bill_price_detail_continue_to_pay")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <PopupDetailTour
        isOpen={openPopupDetailTour}
        toggle={onOpenPopupDetailTour}
        tour={tour}
      />
      {openPopupVoucher && (
        <PopupVoucherNew
          isOpen={openPopupVoucher}
          toggle={onOpenPopupVoucher}
          vouchers={voucher?.data}
          voucherUsing={voucherChoose}
          onChooseVoucher={onChooseVoucher}
        />
      )}
    </>
  );
});

export default BookingComponent;
