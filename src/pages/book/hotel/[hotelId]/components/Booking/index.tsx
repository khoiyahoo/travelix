import React, { memo, useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { Grid, useMediaQuery, useTheme, Collapse } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarDays,
  faRotateLeft,
  faHotel,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextfield";
import { VALIDATION } from "configs/constants";
import UseAuth from "hooks/useAuth";
import { UserService } from "services/user";
import * as yup from "yup";
import { Restaurant, Wifi } from "@mui/icons-material";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InputTextfield from "components/common/inputs/InputTextfield";
import { fCurrency2VND, fPercent, fShortenNumber } from "utils/formatNumber";
import { ReducerType } from "redux/reducers";
import { PAYMENT_HOTEL_SECTION } from "models/payment";
import { StayService } from "services/normal/stay";
import {
  DataPagination,
  EDiscountType,
  EServicePolicyType,
  EServiceType,
} from "models/general";
import { Stay } from "models/stay";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { FindAll, Voucher } from "models/voucher";
import { IEvent } from "models/event";
import { VoucherService } from "services/normal/voucher";
import { RoomBillConfirm } from "models/roomBill";
import PopupVoucherNew from "pages/book/tour/[tourId]/components/PopopVoucherNew";
import { EventService } from "services/normal/event";
import PopupDetailRoom from "pages/listHotel/[hotelId]/components/PopupDetailRoom";
import { Room } from "models/room";

const CHARACTER_LIMIT = 100;

export interface BookForm {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialRequest?: string;
}
interface Props {
  onSubmit?: (data: RoomBillConfirm) => void;
}
// eslint-disable-next-line react/display-name
const BookingComponent = memo(({ onSubmit }: Props) => {
  const dispatch = useDispatch();
  const { roomBillConfirm } = useSelector((state: ReducerType) => state.normal);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const { user } = UseAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const [open, setOpen] = useState(true);
  const [stay, setStay] = useState<Stay>();
  const [openPopupDetailStay, setOpenPopupDetailStay] = useState(false);
  const [dateValidRefund, setDateValidRefund] = useState<Date>(new Date());
  const [voucher, setVoucher] = useState<DataPagination<Voucher>>();
  const [inputValueCode, setInputValueCode] = useState(null);
  const [initialPrice, setInitialPrice] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [openPopupVoucher, setOpenPopupVoucher] = useState(false);
  const [valueEvent, setValueEvent] = useState<IEvent>(null);
  const [voucherChoose, setVoucherChoose] = useState<Voucher>();
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [itemRoom, setItemRoom] = useState<Room>(null);

  const policyRefund = useMemo(() => {
    return stay?.stayPolicies.map((item) => {
      if (item.policyType === EServicePolicyType.REFUND) return item.dayRange;
    });
  }, [stay]);

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
    setTotalFinal(initialPrice - voucherDiscount - couponDiscount);
  }, [initialPrice, voucherDiscount, couponDiscount]);

  useEffect(() => {
    let discount = 0;
    if (voucherChoose) {
      if (voucherChoose?.discountType === EDiscountType.PERCENT) {
        discount = (initialPrice * voucherChoose.discountValue) / 100;
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
  }, [initialPrice, voucherChoose]);

  useEffect(() => {
    let discount = 0;
    if (valueEvent) {
      if (!valueEvent?.minOrder || initialPrice >= valueEvent?.minOrder) {
        if (valueEvent?.discountType === EDiscountType.PERCENT) {
          discount = (initialPrice * valueEvent.discountValue) / 100;
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
  }, [initialPrice, valueEvent]);

  useEffect(() => {
    let max_val = policyRefund?.reduce(function (accumulator, element) {
      return accumulator > element ? accumulator : element;
    });
    const dateBookStay = new Date();
    setDateValidRefund(
      new Date(dateBookStay?.setDate(dateBookStay.getDate() + max_val))
    );
  }, [policyRefund]);

  useEffect(() => {
    if (router) {
      StayService.findOne(Number(router.query.hotelId.slice(1)))
        .then((res) => {
          setStay(res.data);
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
    if (roomBillConfirm?.rooms?.length) {
      fetchVoucher();
      let _initialPrice = 0;
      roomBillConfirm?.rooms.forEach((room) => {
        _initialPrice += calculatePriceOfRoom(
          room?.prices,
          room?.amount,
          room?.discount
        );
      });
      setInitialPrice(_initialPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomBillConfirm]);

  const onTogglePopupDetailRoom = (e, item) => {
    setItemRoom(item);
  };

  const onClosePopupDetailRoom = () => {
    if (!itemRoom) return;
    setItemRoom(null);
  };

  const calculatePriceOfRoom = (roomPrice, amount, discount) => {
    let price = 0;
    roomPrice?.forEach((item) => {
      price += item.price;
    });
    return (price * amount * (100 - discount)) / 100;
  };

  const onOpenPopupVoucher = () => setOpenPopupVoucher(!openPopupVoucher);

  const onOpenPopupDetailStay = () =>
    setOpenPopupDetailStay(!openPopupDetailStay);

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
      owner: roomBillConfirm?.stay?.owner,
      serviceType: EServiceType.HOTEL,
      serviceId: roomBillConfirm?.stay?.id,
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

  const onChooseVoucher = (data: Voucher) => {
    setVoucherChoose(data);
    setOpenPopupVoucher(false);
  };

  const _onSubmit = (data: BookForm) => {
    if (user) {
      onSubmit({
        userId: user?.id,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        firstName: data?.firstName,
        lastName: data?.lastName,
        specialRequest: data?.specialRequest,
        price: initialPrice,
        discount: voucherDiscount + couponDiscount,
        totalBill: totalFinal,
        stay: roomBillConfirm?.stay,
        rooms: roomBillConfirm?.rooms,
        startDate: moment(roomBillConfirm?.startDate)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toDate(),
        endDate: moment(roomBillConfirm?.endDate)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .toDate(),
      });
    }
  };

  return (
    <>
      <Grid
        component="form"
        onSubmit={handleSubmit(_onSubmit)}
        id={PAYMENT_HOTEL_SECTION.BOOKING}
      >
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
                    {t("book_page_section_price_detail_title")}
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
                      className={classes.boxPrice}
                      sx={{ borderBottom: "1px solid Var(--gray-10)" }}
                      onClick={() => setOpen(!open)}
                    >
                      <Grid>
                        {" "}
                        <p className={classes.titlePrice}>
                          {t("book_page_section_price_detail_total_cost")}
                        </p>
                      </Grid>
                      <Grid className={classes.priceTotal}>
                        <h4 className={classes.price}>
                          {fCurrency2VND(initialPrice)} VND
                        </h4>
                        {open ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </Grid>
                    </Grid>
                    <Grid className={classes.boxInforPrice}>
                      <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                      <p>{t("book_page_booking_tax")}</p>
                    </Grid>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Grid className={classes.boxPriceDetail}>
                        {roomBillConfirm?.rooms.map((room, index) => (
                          <Grid sx={{ padding: "0 0 14px 16px" }} key={index}>
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p>{t("book_page_booking_room_name")}: </p>{" "}
                              <p>{room?.title}</p>
                            </Grid>{" "}
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>{t("book_page_booking_price")}: </p>
                              <Grid>
                                {room?.prices.map((price, index) => (
                                  <Grid key={index} className="d-flex">
                                    <p
                                      className="mr-2"
                                      style={{ minWidth: "84px" }}
                                    >
                                      {moment(price.date).format("DD/MM/YYYY")}:
                                    </p>
                                    <p>{fCurrency2VND(price?.price)} VND</p>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                            {room?.discount !== 0 && (
                              <Grid
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <p>{t("book_page_booking_discount")}: </p>{" "}
                                <p>{room?.discount}%</p>
                              </Grid>
                            )}
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p>Amount: </p> <p>{room?.amount}</p>
                            </Grid>
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p>Total: </p>{" "}
                              <p>
                                {fCurrency2VND(
                                  calculatePriceOfRoom(
                                    room?.prices,
                                    room?.amount,
                                    room?.discount
                                  )
                                )}{" "}
                                VND
                              </p>
                            </Grid>
                          </Grid>
                        ))}
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
                        marginTop: "14px",
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
                  <FontAwesomeIcon icon={faHotel}></FontAwesomeIcon>
                  <p>{stay?.name}</p>
                </Grid>
                <Grid className={classes.boxInfoPerson}>
                  <Grid className={classes.information}>
                    <Grid>
                      <span>{t("book_page_booking_check_in")}</span>
                    </Grid>
                    <Grid>
                      <p>
                        {moment(roomBillConfirm?.startDate).format(
                          "DD/MM/YYYY"
                        )}
                      </p>
                    </Grid>
                  </Grid>
                  <Grid className={classes.information}>
                    <Grid>
                      <span>{t("book_page_booking_check_out")}</span>
                    </Grid>
                    <Grid>
                      <p>
                        {moment(roomBillConfirm?.endDate).format("DD/MM/YYYY")}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
                {roomBillConfirm?.rooms.map((room, index) => (
                  <Grid className={classes.boxProduct} key={index}>
                    <Grid>
                      <p className={classes.nameProduct}>{room?.title}</p>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: "8px",
                      }}
                    >
                      <p>{t("book_page_booking_number_of_bed")}</p>{" "}
                      <span>
                        {room?.numberOfBed}{" "}
                        {t("book_page_booking_number_of_bed_title")}
                      </span>
                    </Grid>
                    <Grid
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <p>{t("book_page_booking_guest_per_room")}</p>{" "}
                      <span>
                        {room?.numberOfAdult}{" "}
                        {t("book_page_section_price_detail_adult")},{" "}
                        {room?.numberOfChildren}{" "}
                        {t("book_page_section_price_detail_child")}
                      </span>
                    </Grid>
                    <Grid className={classes.product}>
                      <img src={room?.images[0]} alt="anh"></img>
                      <Grid
                        sx={{
                          paddingLeft: "12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                        onClick={(e) => onTogglePopupDetailRoom(e, room)}
                      >
                        <p className={classes.textViewDetail}>
                          {t("book_page_booking_summary_view_detail")}
                        </p>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}

                <Grid className={classes.boxTip}>
                  <Grid className={classes.tip}>
                    <FontAwesomeIcon icon={faCalendarDays}></FontAwesomeIcon>
                    <p>
                      {t("book_page_booking_summary_valid_date")}{" "}
                      {moment(roomBillConfirm?.startDate).format("MMMM Do YY")}
                    </p>
                  </Grid>
                  <Grid className={clsx(classes.tipRequest, classes.tip)}>
                    <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                    <p>{t("book_page_booking_summary_no_needed")}</p>
                  </Grid>
                  <Grid className={clsx(classes.tipRequest, classes.tip)}>
                    <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
                    <p>
                      {dateValidRefund ? (
                        <>{t("book_page_booking_summary_no_refund")}</>
                      ) : (
                        <>
                          {t("book_page_booking_summary_refund")}{" "}
                          {moment(dateValidRefund).format("MMM Do YY")}
                        </>
                      )}
                    </p>
                  </Grid>
                </Grid>
                <PopupDetailRoom
                  isOpen={!!itemRoom}
                  toggle={onClosePopupDetailRoom}
                  room={itemRoom}
                  stay={roomBillConfirm?.stay}
                />
              </Grid>
              <Grid className={classes.btnContinueMobile}>
                <Button btnType={BtnType.Secondary} type="submit">
                  {t("book_page_section_price_detail_continue_review")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        {openPopupVoucher && (
          <PopupVoucherNew
            isOpen={openPopupVoucher}
            toggle={onOpenPopupVoucher}
            vouchers={voucher?.data}
            totalBill={initialPrice}
            voucherUsing={voucherChoose}
            onChooseVoucher={onChooseVoucher}
          />
        )}
      </Grid>
    </>
  );
});

export default BookingComponent;
