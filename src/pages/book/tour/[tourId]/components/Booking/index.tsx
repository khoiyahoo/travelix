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
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCircleCheck,
  faCalendarDays,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextfield";
import { VALIDATION } from "configs/constants";
import UseAuth from "hooks/useAuth";
import { UserService } from "services/user";
import * as yup from "yup";

import PopupDetailTour from "pages/listTour/[tourId]/components/SectionTour/components/PopupDetailTour";
import { BookTourReview, Tour } from "models/tour";
import { ReducerType } from "redux/reducers";
import moment from "moment";
import { fCurrency2VND, fPercent, fShortenNumber } from "utils/formatNumber";
import _ from "lodash";
import {
  DataPagination,
  EDiscountType,
  EServicePolicyType,
  EServiceType,
} from "models/general";
import { FindAll, Voucher } from "models/voucher";
import { VoucherService } from "services/normal/voucher";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InputTextfield from "components/common/inputs/InputTextfield";
import { EventService } from "services/normal/event";
import { IEvent } from "models/event";
import PopupVoucherNew from "../PopopVoucherNew";
import Geocode from "react-geocode";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
const CHARACTER_LIMIT = 100;

export enum EStep {
  BOOKING,
  REVIEW,
  PAYMENT,
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
}
interface Props {
  onSubmit?: (data: BookTourReview) => void;
}
// eslint-disable-next-line react/display-name
const BookingComponent = memo(({ onSubmit }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const { user } = UseAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { confirmBookTour } = useSelector((state: ReducerType) => state.normal);
  // Geocode.setApiKey("AIzaSyDpoA_AeQ9I9bCBLdWDaCWICy-l55bFXpI");
  const [coords, setCoords] = useState(null);
  const [tour, setTour] = useState<Tour>();
  const [openPopupDetailTour, setOpenPopupDetailTour] = useState(false);
  const [openPopupVoucher, setOpenPopupVoucher] = useState(false);
  const [voucher, setVoucher] = useState<DataPagination<Voucher>>();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [inputValueCode, setInputValueCode] = useState(null);
  const [valueEvent, setValueEvent] = useState<IEvent>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [dateValidRefund, setDateValidRefund] = useState<Date>(new Date());
  const [voucherChoose, setVoucherChoose] = useState<Voucher>();
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const policyRefund = useMemo(() => {
    return tour?.tourPolicies.map((item) => {
      if (item.policyType === EServicePolicyType.REFUND) return item.dayRange;
    });
  }, [tour]);

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup
        .string()
        .required(t("book_page_section_contact_detail_first_name_validation")),
      lastName: yup
        .string()
        .required(t("book_page_section_contact_detail_last_name_validation")),
      email: yup
        .string()
        .email(t("book_page_section_contact_detail_email_validation"))
        .required(t("book_page_section_contact_detail_email_validation_error")),
      phoneNumber: yup
        .string()
        .required(t("book_page_section_contact_detail_phone_validation"))
        .matches(VALIDATION.phone, {
          message: t("book_page_section_contact_detail_phone_validation"),
          excludeEmptyString: true,
        }),
      specialRequest: yup.string().notRequired(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const specialRequest = watch("specialRequest");

  useEffect(() => {
    Geocode.fromAddress(
      `${tour?.moreLocation}, ${tour?.commune.name}, ${tour?.district.name}, ${tour?.city.name}`
    ).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoords({ lat, lng });
      },
      (error) => {
        // console.error(error);
      }
    );
  }, [tour]);

  useEffect(() => {
    let discount = 0;
    if (voucherChoose) {
      if (voucherChoose?.discountType === EDiscountType.PERCENT) {
        discount = (totalPrice * voucherChoose.discountValue) / 100;
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
  }, [totalPrice, voucherChoose]);

  useEffect(() => {
    let discount = 0;
    if (valueEvent) {
      if (!valueEvent?.minOrder || totalPrice >= valueEvent?.minOrder) {
        if (valueEvent?.discountType === EDiscountType.PERCENT) {
          discount = (totalPrice * valueEvent.discountValue) / 100;
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
  }, [totalPrice, valueEvent]);

  useEffect(() => {
    setTotalFinal(totalPrice - voucherDiscount - couponDiscount);
  }, [totalPrice, voucherDiscount, couponDiscount]);

  useEffect(() => {
    let max_val = policyRefund?.reduce(function (accumulator, element) {
      return accumulator > element ? accumulator : element;
    });
    const dateBookTour = new Date();
    setDateValidRefund(
      new Date(dateBookTour?.setDate(dateBookTour.getDate() + max_val))
    );
  }, [policyRefund]);

  useEffect(() => {
    if (router) {
      TourService.getTour(Number(router.query.tourId.slice(1)))
        .then((res) => {
          setTour(res.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (user) {
      UserService.getUserProfile(user?.id)
        .then((res) => {
          reset({
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            phoneNumber: res.phoneNumber,
          });
        })
        .catch((err) => dispatch(setErrorMess(err)))
        .finally(() => dispatch(setLoading(false)));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  useEffect(() => {
    setTotalPrice(
      (confirmBookTour?.totalPrice * (100 - confirmBookTour?.discount)) / 100
    );
  }, [confirmBookTour]);

  useEffect(() => {
    if (confirmBookTour?.owner) {
      fetchVoucher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmBookTour]);

  const onUseCoupon = () => {
    dispatch(setLoading(true));
    EventService.findByCode(inputValueCode)
      .then((res) => {
        setValueEvent(res?.data);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const onOpenPopupDetailTour = () =>
    setOpenPopupDetailTour(!openPopupDetailTour);

  const onOpenPopupVoucher = () => setOpenPopupVoucher(!openPopupVoucher);

  const _onSubmit = (data: BookForm) => {
    onSubmit({
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      tourId: tour?.id,
      tourOnSaleId: confirmBookTour?.tourOnSaleId,
      price: confirmBookTour?.totalPrice,
      discount:
        voucherDiscount +
        couponDiscount +
        (confirmBookTour?.totalPrice * confirmBookTour?.discount) / 100,
      totalBill: totalFinal,
      numberOfAdult: confirmBookTour?.amountAdult,
      numberOfChild: confirmBookTour?.amountChildren,
      startDate: confirmBookTour?.startDate,
      specialRequest: data?.specialRequest,
      priceOfChild: confirmBookTour?.priceChildren,
      priceOfAdult: confirmBookTour?.priceAdult,
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
      owner: confirmBookTour?.owner,
      serviceType: EServiceType.TOUR,
      serviceId: confirmBookTour?.tourId,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    VoucherService.getAllVouchers(params)
      .then((res) => {
        setVoucher({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
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

  const onChooseVoucher = (data: Voucher) => {
    setVoucherChoose(data);
    setOpenPopupVoucher(false);
  };

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
        <Container>
          <Grid container spacing={2} className={classes.rootContent}>
            <Grid xs={7} item className={classes.leftPanel}>
              <Grid container item spacing={2}>
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t("book_page_section_contact_detail_title")}
                  </h4>
                  <Grid
                    sx={{
                      backgroundColor: "var(--white-color)",
                      padding: "24px 16px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                      borderRadius: "10px",
                      marginTop: "0px !important",
                    }}
                    container
                    rowSpacing={3}
                  >
                    <Grid container columnSpacing={isMobile ? 0 : 1}>
                      <Grid item xs={12} sm={6}>
                        <InputTextField
                          title={t(
                            "book_page_section_contact_detail_first_name"
                          )}
                          placeholder={t(
                            "book_page_section_contact_detail_first_name"
                          )}
                          inputRef={register("firstName")}
                          startAdornment={
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                          }
                          errorMessage={errors?.firstName?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputTextField
                          title={t(
                            "book_page_section_contact_detail_last_name"
                          )}
                          placeholder={t(
                            "book_page_section_contact_detail_last_name"
                          )}
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
                        title={t("book_page_section_contact_detail_email")}
                        placeholder={t(
                          "book_page_section_contact_detail_email"
                        )}
                        inputRef={register("email")}
                        startAdornment={
                          <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                        }
                        errorMessage={errors?.email?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputTextField
                        title={t("book_page_section_contact_detail_phone")}
                        placeholder={t(
                          "book_page_section_contact_detail_phone"
                        )}
                        inputRef={register("phoneNumber")}
                        startAdornment={
                          <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                        }
                        errorMessage={errors?.phoneNumber?.message}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t("book_page_section_special_request_title")}
                  </h4>
                  <Grid
                    sx={{
                      backgroundColor: "var(--white-color)",
                      padding: "24px 16px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                      borderRadius: "10px",
                    }}
                  >
                    <p>{t("book_page_section_special_request_sub_title")}</p>
                    <InputTextfield
                      title={t("book_page_section_special_request_title_input")}
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
                    {t("book_page_section_location_detail_title")}
                  </h4>
                  <Grid
                    sx={{
                      backgroundColor: "var(--white-color)",
                      padding: "24px 16px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                      borderRadius: "10px",
                    }}
                  >
                    <p>
                      {tour?.moreLocation}, {tour?.commune.name},
                      {tour?.district.name}, {tour?.city.name}
                    </p>
                    {/* <div style={{ height: "30vh", width: "100%" }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: "AIzaSyDpoA_AeQ9I9bCBLdWDaCWICy-l55bFXpI",
                      }}
                      defaultCenter={coords}
                      defaultZoom={11}
                      center={coords}
                    >
                      <AnyReactComponent
                        lat={coords?.lat}
                        lng={coords?.lng}
                        text={
                          <LocationOnIcon
                            sx={{ color: "var(--danger-color)" }}
                          />
                        }
                      />
                    </GoogleMapReact>
                  </div> */}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t("book_page_section_price_detail_title")}
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
                      className={classes.boxPrice}
                      sx={{ borderBottom: "1px solid Var(--gray-10)" }}
                      onClick={() => setOpenCollapse(!openCollapse)}
                    >
                      <Grid>
                        {" "}
                        <p className={classes.titlePrice}>
                          {t("book_page_section_price_detail_total_cost")}
                        </p>
                      </Grid>
                      <Grid sx={{ display: "flex", alignItems: "center" }}>
                        <h4 className={classes.price}>
                          {fCurrency2VND(totalPrice)}
                          VND
                        </h4>
                        {openCollapse ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </Grid>
                    </Grid>
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                      <Grid className={classes.boxPriceDetail}>
                        {confirmBookTour?.discount !== 0 && (
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>
                              {t("book_page_section_price_detail_discount")}
                            </p>
                            <p> {fCurrency2VND(confirmBookTour?.discount)} %</p>
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
                            {t("book_page_section_price_detail_adult")} (
                            {confirmBookTour?.amountAdult}x)
                          </p>
                          <p>
                            {" "}
                            {fCurrency2VND(confirmBookTour?.priceAdult)} VND
                          </p>
                        </Grid>
                        {confirmBookTour?.amountChildren !== 0 && (
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>
                              {t("book_page_section_price_detail_child")} (
                              {confirmBookTour?.amountChildren}x)
                            </p>
                            <p>
                              {" "}
                              {fCurrency2VND(
                                confirmBookTour?.priceChildren
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
                        <p>
                          {t("book_page_section_price_detail_discount_code")}
                        </p>
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
                          <p>
                            {t("book_page_section_price_detail_choose_voucher")}
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid className={classes.inputCoupon} container spacing={2}>
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
                          marginTop: "20px",
                        }}
                      >
                        <Grid className={classes.boxPrice}>
                          <p>
                            {t("update_bill_price_detail_total_coupon_price")}:
                          </p>
                          <p>
                            {fCurrency2VND(voucherDiscount + couponDiscount)}{" "}
                            VND
                          </p>
                        </Grid>
                      </Grid>
                    )}
                    <Grid
                      className={classes.boxPrice}
                      sx={{
                        borderBottom: "1px solid Var(--gray-10)",
                        marginTop: "20px",
                      }}
                    >
                      <Grid>
                        {" "}
                        <p className={classes.titlePrice}>
                          {t("book_page_section_price_detail_price_you_pay")}
                        </p>
                      </Grid>
                      <Grid sx={{ display: "flex", alignItems: "center" }}>
                        <h4 className={classes.price}>
                          {fCurrency2VND(totalFinal)}
                          VND
                        </h4>
                      </Grid>
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
                        {t("book_page_section_price_detail_continue_review")}
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
                  <p>{t("book_page_booking_summary_title")}</p>
                </Grid>
                <Grid className={classes.boxProduct}>
                  <Grid>
                    <p>{tour?.title}</p>
                  </Grid>
                  <Grid className={classes.product}>
                    <img src={tour?.images[0]} alt="anh"></img>
                    <p onClick={onOpenPopupDetailTour}>
                      {t("book_page_booking_summary_view_detail")}
                    </p>
                  </Grid>
                </Grid>
                <Grid className={classes.boxInfoPerson}>
                  <Grid className={classes.information}>
                    <Grid>
                      <span>{t("book_page_booking_summary_visit_date")}</span>
                    </Grid>
                    <Grid>
                      <p>
                        {moment(confirmBookTour?.startDate).format(
                          "dddd, MMMM Do YYYY"
                        )}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid className={classes.information}>
                    <Grid>
                      <span>
                        {t("book_page_booking_summary_total_visitor")}
                      </span>
                    </Grid>
                    <Grid>
                      <p>
                        {t("book_page_section_price_detail_adult")}:{" "}
                        {confirmBookTour?.amountAdult}
                      </p>
                      <p>
                        {t("book_page_section_price_detail_child")}:{" "}
                        {confirmBookTour?.amountChildren}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.boxTip}>
                  <Grid className={classes.tip}>
                    <FontAwesomeIcon icon={faCalendarDays}></FontAwesomeIcon>
                    <p>
                      {t("book_page_booking_summary_valid_date")}{" "}
                      <span className={classes.tipBold}>
                        {moment(confirmBookTour?.startDate).format(
                          "MMMM Do YY"
                        )}
                      </span>
                    </p>
                  </Grid>
                  <Grid className={clsx(classes.tipRequest, classes.tip)}>
                    <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                    <p>{t("book_page_booking_summary_no_needed")}</p>
                  </Grid>
                  <Grid className={clsx(classes.tipRequest, classes.tip)}>
                    <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
                    <p>
                      {t("book_page_booking_summary_refund")}{" "}
                      <span className={classes.tipBold}>
                        {moment(dateValidRefund).format("MMM Do YY")}
                      </span>
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid className={classes.btnContinueMobile}>
                <Button btnType={BtnType.Secondary} type="submit">
                  {t("book_page_section_price_detail_continue_review")}
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
