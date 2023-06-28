/* eslint-disable @next/next/no-img-element */
import React, { memo, useEffect, useMemo, useState } from "react";
import { Badge, Container } from "reactstrap";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import InputCounter from "components/common/inputs/InputCounter";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { RoomService } from "services/normal/room";
import { useDispatch } from "react-redux";
import { HOTEL_SECTION } from "models/hotel";
import { useRouter } from "next/router";
import {
  fCurrency2,
  fCurrency2VND,
  fPercent,
  fShortenNumber,
} from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import { Grid, Collapse } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WifiIcon from "@mui/icons-material/Wifi";
import SmokeFreeIcon from "@mui/icons-material/SmokeFree";
import BedIcon from "@mui/icons-material/Bed";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InfoIcon from "@mui/icons-material/Info";
import { Stay } from "models/stay";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import moment, { Moment } from "moment";
import InputTextfield from "components/common/inputs/InputTextfield";
import { useTranslation } from "react-i18next";
import {
  DataPagination,
  EDiscountType,
  EServicePolicyType,
  EServiceType,
  ESortOption,
  sortOption,
} from "models/general";
import InputSelect from "components/common/inputs/InputSelect";
import { NormalGetRoom, Room } from "models/room";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { setRoomBillConfirmReducer } from "redux/reducers/Normal/actionTypes";
import PopupDetailRoom from "../PopupDetailRoom";
import { FindAll, Voucher } from "models/voucher";
import PopupVoucherNew from "pages/book/tour/[tourId]/components/PopopVoucherNew";
import { EventService } from "services/normal/event";
import { IEvent } from "models/event";
import { VoucherService } from "services/normal/voucher";
import { RoomBillService } from "services/normal/roomBill";
import { RoomBill } from "models/roomBill";
import { BillHelper } from "helpers/bill";
import { VALIDATION } from "configs/constants";
export interface CheckRoomForm {
  departure: Date;
  return: Date;
  amountList: {
    amount: number;
  }[];
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
interface Props {
  stay: Stay;
}

// eslint-disable-next-line react/display-name
const CheckRoomEmpty = memo(({ stay }: Props) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const schema = useMemo(() => {
    let validate: any = {
      departure: yup
        .date()
        .max(
          yup.ref("return"),
          t(
            "stay_detail_section_stay_check_room_empty_start_time_validate_error"
          )
        )
        .required("Start datetime is required"),
      return: yup
        .date()
        .min(
          yup.ref("departure"),
          t("stay_detail_section_stay_check_room_empty_end_time_validate_error")
        )
        .required("End datetime is required"),
      amountList: yup.array().of(
        yup.object().shape({
          amount: yup.number(),
        })
      ),
    };
    if (router.query?.action) {
      validate = {
        ...validate,
        firstName: yup
          .string()
          .required(
            t("book_page_section_contact_detail_first_name_validation")
          ),
        lastName: yup
          .string()
          .required(t("book_page_section_contact_detail_last_name_validation")),
        email: yup
          .string()
          .email(t("book_page_section_contact_detail_email_validation"))
          .required(
            t("book_page_section_contact_detail_email_validation_error")
          ),
        phoneNumber: yup
          .string()
          .required(t("book_page_section_contact_detail_phone_validation"))
          .matches(VALIDATION.phone, {
            message: t("book_page_section_contact_detail_phone_validation"),
            excludeEmptyString: true,
          }),
      };
    }
    return yup.object().shape({
      ...validate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(0);
  const [dateStart, setDateStart] = useState<Moment>(moment(new Date()));
  const [dateEnd, setDateEnd] = useState<Moment>(
    moment(new Date(Date.now() + 3600 * 1000 * 24))
  );
  const [numberOfAdult, setNumberOfAdult] = useState(2);
  const [numberOfChild, setNumberOfChild] = useState(0);
  const [numberOfRoom, setNumberOfRoom] = useState(1);
  const [roomFilter, setRoomFilter] = useState<number>(
    ESortOption.LOWEST_PRICE
  );
  const [data, setData] = useState<DataPagination<Room>>();
  const [itemRoom, setItemRoom] = useState<Room>(null);

  // re-schedule
  const [voucherChoose, setVoucherChoose] = useState<Voucher>();
  const [openPopupVoucher, setOpenPopupVoucher] = useState(false);
  const [voucher, setVoucher] = useState<DataPagination<Voucher>>();
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalBillAfterDiscount, setTotalBillAfterDiscount] = useState(0);
  const [inputValueCode, setInputValueCode] = useState(null);
  const [valueEvent, setValueEvent] = useState<IEvent>(null);
  const [roomBill, setRoomBill] = useState<RoomBill>(null);
  const [priceMustPay, setPriceMustPay] = useState(null);

  const refundRate = useMemo(() => {
    return (
      BillHelper.getRefundRate(
        roomBill?.startDate,
        EServicePolicyType.RESCHEDULE,
        roomBill?.stayData?.stayPolicies
      ) || 0
    );
  }, [roomBill]);
  const priceRefund = useMemo(() => {
    return (roomBill?.totalBill * refundRate) / 100 || 0;
  }, [roomBill, refundRate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    getValues,
    control,
  } = useForm<CheckRoomForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      departure: new Date(),
      return: new Date(Date.now() + 3600 * 1000 * 24),
      amountList: [{ amount: 0 }],
    },
  });

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const onFocus = () => {
    setFocus(!focus);
  };

  const onTogglePopupDetailRoom = (e, item) => {
    setItemRoom(item);
  };

  const onClosePopupDetailRoom = () => {
    if (!itemRoom) return;
    setItemRoom(null);
  };

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const params: NormalGetRoom = {
      stayId: stay?.id || Number(router.query.hotelId.slice(1)),
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      startDate:
        dateStart
          ?.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          ?.toDate() || value?.startDate,
      endDate:
        dateEnd
          ?.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          ?.toDate() || value?.endDate,
      sort: roomFilter || null,
      numberOfAdult: numberOfAdult || null,
      numberOfChildren: numberOfChild || null,
      numberOfRoom: numberOfRoom || null,
    };
    dispatch(setLoading(true));
    RoomService.findAll(params)
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onClearFilter = () => {
    setDateStart(moment(new Date()));
    setDateEnd(moment(new Date(Date.now() + 3600 * 1000 * 24)));
    setRoomFilter(null);
    setNumberOfAdult(0);
    setNumberOfChild(0);
    setNumberOfRoom(0);
  };

  const _newListPriceDay = data?.data?.map((item) => {
    return [
      item.mondayPrice,
      item.tuesdayPrice,
      item.wednesdayPrice,
      item.thursdayPrice,
      item.fridayPrice,
      item.saturdayPrice,
      item.sundayPrice,
    ];
  });

  let totalPrice = 0;
  let totalRoom = 0;

  for (var i = 0; i < data?.data?.length; i++) {
    const _watchAmount = watch(`amountList.${i}.amount`);
    let result = data?.data[i]?.prices.reduce(function (total, element) {
      if (data?.data[i].discount) {
        return total + element.price * ((100 - data?.data[i].discount) / 100);
      } else {
        return total + element.price;
      }
    }, 0);
    totalPrice += result * _watchAmount;
    totalRoom += _watchAmount;
  }

  const listMinPrice = [];
  for (var i = 0; i < _newListPriceDay?.length; i++) {
    let minPrice = _newListPriceDay[i]?.reduce(function (accumulator, element) {
      return accumulator < element ? accumulator : element;
    });
    listMinPrice?.push(minPrice);
  }

  const _onSubmit = (dataCheckForm: CheckRoomForm) => {
    const roomBillConfirm = [];
    dataCheckForm?.amountList?.map((item, index) => {
      if (item?.amount > 0) {
        roomBillConfirm.push({
          ...data?.data[index],
          amount: item.amount,
        });
      }
    });
    dispatch(
      setRoomBillConfirmReducer({
        stay: stay,
        rooms: roomBillConfirm,
        startDate: new Date(dataCheckForm?.departure),
        endDate: new Date(dataCheckForm?.return),
      })
    );
    if (!user) {
      router.push(`/auth/login`);
    } else {
      router.push(`/book/hotel/:${stay?.id}/booking`);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dateStart,
    dateEnd,
    roomFilter,
    numberOfAdult,
    numberOfChild,
    numberOfRoom,
  ]);

  useEffect(() => {
    setValue(
      "amountList",
      data?.data.map(() => ({
        amount: 0,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  // useEffect of re-schedule
  useEffect(() => {
    if (router.query?.action) {
      RoomBillService.findOne(Number(router.query?.action))
        .then((res) => {
          setRoomBill(res?.data);
          reset({
            firstName: res?.data?.firstName,
            lastName: res?.data?.lastName,
            email: res?.data?.email,
            phoneNumber: res?.data?.phoneNumber,
          });
        })
        .catch(() => {
          dispatch(setErrorMess({ message: t("common_not_found") }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (router.query?.action) {
      setPriceMustPay(totalBillAfterDiscount - priceRefund);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBillAfterDiscount, priceRefund]);

  useEffect(() => {
    if (router.query?.action) {
      setVoucherChoose(null);
      setValueEvent(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice]);

  useEffect(() => {
    if (router.query?.action) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherChoose]);

  useEffect(() => {
    if (router.query?.action) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueEvent]);

  useEffect(() => {
    if (router.query?.action) {
      setTotalBillAfterDiscount(totalPrice - voucherDiscount - couponDiscount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice, voucherDiscount, couponDiscount]);

  useEffect(() => {
    if (stay && router.query?.action) {
      fetchVoucher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stay, router.query]);

  // re-schedule
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
      owner: stay?.owner,
      serviceType: EServiceType.HOTEL,
      serviceId: stay?.id,
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

  const onOpenPopupVoucher = () => setOpenPopupVoucher(!openPopupVoucher);

  const onChooseVoucher = (data: Voucher) => {
    setVoucherChoose(data);
    setOpenPopupVoucher(false);
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

  const onReSchedule = (dataCheckForm: CheckRoomForm) => {
    const rooms: any[] = [];
    dataCheckForm?.amountList?.map((itemAmountList, index) => {
      if (itemAmountList.amount > 0) {
        const roomInfo = data?.data[index];
        roomInfo.prices.forEach((item) => {
          rooms.push({
            roomId: roomInfo?.id,
            amount: itemAmountList.amount,
            discount: roomInfo?.discount,
            price: item.price,
            bookedDate: item.date,
          });
        });
      }
    });
    RoomBillService.reSchedule(Number(router.query?.action), {
      stayId: stay?.id,
      rooms: rooms,
      startDate: dataCheckForm.departure,
      endDate: dataCheckForm.return,
      price: totalPrice,
      discount: voucherDiscount + couponDiscount,
      totalBill: totalBillAfterDiscount,
      email: dataCheckForm.email,
      phoneNumber: dataCheckForm.phoneNumber,
      firstName: dataCheckForm.firstName,
      lastName: dataCheckForm.lastName,
      extraPay: priceMustPay >= 0 ? priceMustPay : null,
      moneyRefund: priceMustPay < 0 ? -priceMustPay : null,
    })
      .then((res) => {
        if (priceMustPay >= 0) {
          router.push(res?.data?.checkoutUrl);
        } else {
          router.push("/paymentHistory/hotel");
        }
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      });
  };

  return (
    <Grid
      sx={{ backgroundColor: "#f6f2f2", padding: "32px 0 32px 0" }}
      id={HOTEL_SECTION.section_check_room}
      component={"form"}
      onSubmit={handleSubmit(_onSubmit)}
    >
      <Container className={classes.root}>
        <Grid
          sx={{
            padding: "16px",
            backgroundColor: "var(--white-color)",
            borderRadius: "10px",
            boxShadow: "var(--box-shadow-100)",
          }}
        >
          <h5 className={classes.titleCheckEmpty}>
            {t("stay_detail_section_stay_check_room_empty_title")} {stay?.name}
          </h5>
          <Grid>
            <Grid
              xs={12}
              container
              className={classes.inputDateContainer}
              spacing={2}
            >
              <Grid item xs={2} className={classes.boxItemSearch}>
                <InputDatePicker
                  className={classes.inputSearchDate}
                  label={t(
                    "stay_detail_section_stay_check_room_empty_departure"
                  )}
                  placeholder="Departure"
                  name="departure"
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  isValidDate={disablePastDt}
                  closeOnSelect
                  value={dateStart ? dateStart : ""}
                  initialValue={dateStart ? dateStart : ""}
                  _onChange={(e) => {
                    setDateStart(moment(e?._d));
                  }}
                  inputRef={register("departure")}
                  errorMessage={errors.departure?.message}
                  minDate={moment().toDate()}
                  maxDate={watch("return")}
                  control={control}
                />
              </Grid>
              <Grid item xs={2} className={classes.boxItemSearch}>
                <InputDatePicker
                  className={classes.inputSearchDate}
                  label={t("stay_detail_section_stay_check_room_empty_return")}
                  placeholder="Return"
                  name="return"
                  dateFormat="DD/MM/YYYY"
                  isValidDate={disablePastDt}
                  timeFormat={false}
                  closeOnSelect
                  value={dateEnd ? dateEnd : ""}
                  initialValue={dateEnd ? dateEnd : ""}
                  _onChange={(e) => {
                    setDateEnd(moment(e?._d));
                  }}
                  inputRef={register("return")}
                  errorMessage={errors.return?.message}
                  minDate={watch("departure") || moment().toDate()}
                  control={control}
                />
              </Grid>
              <Grid
                className={clsx(classes.boxItem, classes.boxGuest)}
                item
                xs={5}
              >
                <InputTextfield
                  title={t(
                    "landing_page_section_search_stay_input_guest_title"
                  )}
                  className={classes.inputSearchLocation}
                  placeholder="Guest and Room"
                  name="people"
                  autoComplete="off"
                  startAdornment={<FamilyRestroomIcon />}
                  onFocus={onFocus}
                  value={`${numberOfAdult ? numberOfAdult : 1} ${t(
                    "landing_page_section_search_stay_input_adult_placeholder"
                  )}, ${numberOfChild ? numberOfChild : 0} ${t(
                    "landing_page_section_search_stay_input_child_placeholder"
                  )}, ${numberOfRoom ? numberOfRoom : 1} ${t(
                    "landing_page_section_search_stay_input_room_placeholder"
                  )}`}
                />
                {focus && (
                  <div className={classes.containerChooseGuest}>
                    <Grid container sx={{ width: "100%" }}>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "14px",
                        }}
                        xs={12}
                      >
                        <Grid className={classes.boxTitleCounter}>
                          <PeopleAltIcon />
                          <p>
                            {t(
                              "landing_page_section_search_stay_input_adult_placeholder"
                            )}
                          </p>
                        </Grid>
                        <Grid>
                          <InputCounter
                            className={classes.inputCounter}
                            max={9999}
                            min={0}
                            onChange={(e) => setNumberOfAdult(e)}
                            value={numberOfAdult}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "14px",
                        }}
                        xs={12}
                      >
                        <Grid className={classes.boxTitleCounter}>
                          <ChildFriendlyIcon />
                          <p>
                            {t(
                              "landing_page_section_search_stay_input_child_placeholder"
                            )}
                          </p>
                        </Grid>
                        <Grid>
                          <InputCounter
                            className={classes.inputCounter}
                            max={9999}
                            min={0}
                            onChange={(e) => setNumberOfChild(e)}
                            value={numberOfChild}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "14px",
                        }}
                        xs={12}
                      >
                        <Grid className={classes.boxTitleCounter}>
                          <MeetingRoomIcon />
                          <p>
                            {t(
                              "landing_page_section_search_stay_input_room_placeholder"
                            )}
                          </p>
                        </Grid>
                        <Grid>
                          <InputCounter
                            className={classes.inputCounter}
                            max={9999}
                            min={0}
                            onChange={(e) => setNumberOfRoom(e)}
                            value={numberOfRoom}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginBottom: "14px",
                        }}
                        xs={12}
                      >
                        <Button
                          btnType={BtnType.Secondary}
                          onClick={() => setFocus(!focus)}
                        >
                          {t("common_cancel")}
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </Grid>
              <Grid xs={3} item className={classes.boxItemSearch}>
                <InputSelect
                  title={t("stay_detail_section_stay_check_room_empty_sort")}
                  className={classes.inputSelect}
                  bindLabel="translation"
                  selectProps={{
                    options: sortOption,
                    placeholder: t("list_tours_sort_by_placeholder"),
                  }}
                  onChange={(e) => setRoomFilter(e?.value)}
                />
              </Grid>
            </Grid>
            <Grid className={classes.boxResetFilter}>
              <Button
                btnType={BtnType.Primary}
                className={classes.btnResetOption}
                onClick={onClearFilter}
              >
                <FontAwesomeIcon icon={faArrowsRotate} />{" "}
                {t("list_tours_reset_filter")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container className={classes.rootRooms}>
        {data?.data?.map((room, index) => (
          <Grid
            sx={{ padding: "16px" }}
            container
            key={index}
            className={classes.containerCheckRoom}
          >
            <Grid
              className={classes.leftPanel}
              item
              xs={3}
              onClick={(e) => onTogglePopupDetailRoom(e, room)}
            >
              <Grid className={classes.boxLeftItem}>
                <Grid sx={{ position: "relative", cursor: "pointer" }}>
                  <img src={room?.images[0]} alt="anh"></img>
                  {/* <Grid className={classes.numberImg}>1/4</Grid> */}
                  <Grid container className={classes.moreImg} spacing={0.5}>
                    <Grid item xs={4}>
                      <img src={room?.images[1]} alt="anh"></img>
                    </Grid>
                    <Grid item xs={4}>
                      <img src={room?.images[2]} alt="anh"></img>
                    </Grid>
                    <Grid item xs={4}>
                      <img src={room?.images[1]} alt="anh"></img>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid sx={{ padding: "14px" }}>
                  <Grid
                    sx={{ paddingBottom: "10px" }}
                    className={classes.boxUtility}
                  >
                    {room?.utility?.map((item) => (
                      <Badge className={classes.tag} key={index}>
                        {item}
                      </Badge>
                    ))}
                  </Grid>
                  <Button
                    btnType={BtnType.Outlined}
                    className={classes.btnSeeRoom}
                    onClick={(e) => onTogglePopupDetailRoom(e, room)}
                  >
                    {t("stay_detail_section_stay_check_room_empty_see_detail")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              xs={9}
              sx={{ paddingLeft: "10px" }}
              className={classes.rootRightPanel}
            >
              <Grid className={classes.rightPanel}>
                <Grid className={classes.rightPanelHeader}>
                  <Grid>
                    <p>{room?.title}</p>
                  </Grid>
                  <Grid>
                    <FontAwesomeIcon icon={faUserGroup}></FontAwesomeIcon>
                    <span>
                      {room?.numberOfAdult}{" "}
                      {t("stay_detail_section_stay_check_room_empty_adult")},{" "}
                      {room?.numberOfChildren}{" "}
                      {t("stay_detail_section_stay_check_room_empty_child")}
                    </span>
                  </Grid>
                </Grid>
                <Grid className={classes.boxServices} container>
                  <Grid item xs={4}>
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemService}
                    >
                      <RestaurantIcon />
                      <span>
                        {t(
                          "stay_detail_section_stay_check_room_empty_free_breakfast"
                        )}
                      </span>
                    </Grid>
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemService}
                    >
                      <WifiIcon />
                      <span>
                        {t(
                          "stay_detail_section_stay_check_room_empty_free_wifi"
                        )}
                      </span>
                    </Grid>
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemService}
                    >
                      <SmokeFreeIcon />
                      <span>
                        {t(
                          "stay_detail_section_stay_check_room_empty_non_smoking"
                        )}
                      </span>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemInforRoom}
                    >
                      <BedIcon />
                      <span>
                        {" "}
                        {t(
                          "stay_detail_section_stay_check_room_empty_number_of_bed"
                        )}
                        : {room?.numberOfBed}
                      </span>
                    </Grid>
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemInforRoom}
                    >
                      <CheckBoxIcon />
                      <span>
                        {t(
                          "stay_detail_section_stay_check_room_empty_number_of_room_left"
                        )}
                        : {room?.numberOfRoom}
                      </span>
                    </Grid>
                  </Grid>
                  <Grid item xs={4} className={classes.boxPrice}>
                    {room?.discount !== 0 && (
                      <Grid
                        sx={{ padding: "0 0 10px 0" }}
                        className={classes.itemPriceRoom}
                      >
                        <span className={classes.discount}>
                          {fCurrency2(listMinPrice[index])} VND
                        </span>
                      </Grid>
                    )}
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemPriceRoom}
                    >
                      <span>
                        {t("stay_detail_section_stay_from_review")} &nbsp;
                      </span>{" "}
                      <p>
                        {fCurrency2(
                          Math.ceil(
                            listMinPrice[index] * ((100 - room?.discount) / 100)
                          )
                        )}{" "}
                        VND
                      </p>
                    </Grid>
                    <Grid
                      sx={{ padding: "0 0 10px 0" }}
                      className={classes.itemPriceRoom}
                    >
                      <span>
                        {t(
                          "stay_detail_section_stay_check_room_empty_room_night"
                        )}
                      </span>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.boxDetailPrice}>
                  <Grid
                    onClick={() => setOpen(open === index ? -1 : index)}
                    className={classes.boxControl}
                  >
                    <p>
                      {t(
                        "stay_detail_section_stay_check_room_empty_price_detail"
                      )}
                    </p>
                    {open === index ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </Grid>
                  <Collapse in={open === index} timeout="auto" unmountOnExit>
                    <Grid
                      sx={{ display: "flex", justifyContent: "space-between" }}
                      container
                    >
                      {room?.prices?.map((priceInfo, index) => (
                        <Grid
                          className={classes.itemPrice}
                          xs={6}
                          item
                          key={index}
                        >
                          <p>
                            {moment(priceInfo?.date).format("DD/MM/YYYY")} {":"}{" "}
                            <span>{fCurrency2(priceInfo?.price)} VND</span>{" "}
                            {t(
                              "stay_detail_section_stay_check_room_empty_room_night"
                            )}
                          </p>
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>
                </Grid>
                <Grid className={classes.footerPrice}>
                  <Grid className={classes.boxTip}>
                    <InfoIcon />
                    <p>
                      {t(
                        "stay_detail_section_stay_check_room_empty_tip_select"
                      )}
                    </p>
                  </Grid>
                  <Grid className={classes.boxNumberOfRoom}>
                    <Grid sx={{ flex: "2", paddingRight: "10px" }}>
                      <p>
                        {t(
                          "stay_detail_section_stay_check_room_empty_number_of_room"
                        )}
                      </p>
                    </Grid>
                    <Grid sx={{ flex: "1" }}>
                      <Controller
                        name={`amountList.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <InputCounter
                            className={classes.inputCounter}
                            max={room?.numberOfRoom}
                            min={0}
                            onChange={field.onChange}
                            value={field.value}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {itemRoom?.id === room?.id && (
              <PopupDetailRoom
                isOpen={!!itemRoom}
                toggle={onClosePopupDetailRoom}
                room={itemRoom}
                minPrice={listMinPrice[index]}
              />
            )}
          </Grid>
        ))}
        {router.query?.hotelId && (
          <Grid className={classes.footerRoom}>
            <Grid className={classes.boxTotalPrice}>
              <p>
                {t("stay_detail_section_stay_check_room_empty_total_price")}
              </p>
              <p className={classes.price}>
                <span>{fCurrency2(Math.ceil(totalPrice))} VND</span>
                {/* <span>{fCurrency2(Math.ceil(totalPrice))} VND</span> / {totalRoom}{" "}
                {t("stay_detail_section_stay_check_room_empty_room_night")} */}
              </p>
            </Grid>
            <Grid className={classes.btnControl}>
              <Button
                btnType={BtnType.Secondary}
                type="submit"
                disabled={totalPrice === 0}
              >
                {t("stay_detail_section_stay_check_room_empty_book_now")}
              </Button>
            </Grid>
          </Grid>
        )}
      </Container>
      {router.query?.action && (
        <Grid className={classes.resSheduleWrapper} container spacing={2}>
          <Grid item sm={6} className="pl-0">
            <Grid className={clsx(classes.resSheduleItem)}>
              <Grid container rowSpacing={3}>
                <Grid item xs={12}>
                  <InputTextfield
                    title={t("book_page_section_contact_detail_first_name")}
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
                <Grid item xs={12}>
                  <InputTextfield
                    title={t("book_page_section_contact_detail_last_name")}
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
                <Grid item xs={12}>
                  <InputTextfield
                    title={t("book_page_section_contact_detail_email")}
                    placeholder={t("book_page_section_contact_detail_email")}
                    inputRef={register("email")}
                    startAdornment={
                      <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>
                    }
                    errorMessage={errors?.email?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputTextfield
                    title={t("book_page_section_contact_detail_phone")}
                    placeholder={t("book_page_section_contact_detail_phone")}
                    inputRef={register("phoneNumber")}
                    startAdornment={
                      <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                    }
                    errorMessage={errors?.phoneNumber?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6}>
            <Grid className={clsx(classes.resSheduleItem)}>
              <Grid className={classes.resSheduleDetail}>
                <p>Tổng tiền đã thanh toán trước đó:</p>
                <p>{fCurrency2VND(roomBill?.totalBill)} VND</p>
              </Grid>
              <Grid className={classes.resSheduleDetail}>
                <p>Tiền được hoàn lại ({refundRate}%):</p>
                <p>{fCurrency2VND(priceRefund)} VND</p>
              </Grid>
              <hr style={{ margin: 0 }} />
              <Grid className={classes.resSheduleDetail}>
                <p>Chi phí sau khi đổi lịch:</p>
                <p>{fCurrency2VND(totalPrice)} VND</p>
              </Grid>
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
                              [classes.boxVoucherInValid]: handleValidVoucher(
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
                                {fCurrency2VND(voucherChoose?.maxDiscount)} VND
                              </span>
                            )}
                          </Grid>
                        ) : (
                          <Grid
                            className={clsx(classes.boxVoucher, {
                              [classes.boxVoucherInValid]: handleValidVoucher(
                                voucherChoose?.startTime
                              ),
                            })}
                          >
                            {t("voucher_title_deal")}{" "}
                            {fShortenNumber(voucherChoose?.discountValue)} VND
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
                <Grid>
                  <Grid className={classes.resSheduleDetail}>
                    <p>{t("update_bill_price_detail_total_coupon_price")}:</p>
                    <p>{fCurrency2VND(voucherDiscount + couponDiscount)} VND</p>
                  </Grid>
                  <Grid
                    className={clsx(classes.resSheduleDetail, classes.boxPrice)}
                  >
                    <p>
                      {t("update_bill_price_detail_price_after_apply_coupon")}:
                    </p>
                    <p>{fCurrency2VND(totalBillAfterDiscount)} VND</p>
                  </Grid>
                </Grid>
              )}
              {totalPrice > 0 && (
                <>
                  <hr />
                  <Grid>
                    {priceMustPay >= 0 ? (
                      <Grid className={classes.resSheduleDetail}>
                        <p>{t("update_bill_price_detail_price_you_extra")}:</p>
                        <p className={classes.price}>
                          {fCurrency2VND(priceMustPay)} VND
                        </p>
                      </Grid>
                    ) : (
                      <Grid className={classes.resSheduleDetail}>
                        <p>
                          {t("update_bill_price_detail_price_you_reimbursed")}:
                        </p>
                        <p className={classes.price}>
                          {fCurrency2VND(-priceMustPay)} VND
                        </p>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
              <Grid className={classes.btnControl}>
                <Button
                  btnType={BtnType.Secondary}
                  disabled={totalPrice === 0}
                  onClick={handleSubmit(onReSchedule)}
                >
                  Xác nhận đổi lịch
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {openPopupVoucher && (
        <PopupVoucherNew
          isOpen={openPopupVoucher}
          toggle={onOpenPopupVoucher}
          vouchers={voucher?.data}
          voucherUsing={voucherChoose}
          onChooseVoucher={onChooseVoucher}
        />
      )}
    </Grid>
  );
});

export default CheckRoomEmpty;
