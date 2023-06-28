/* eslint-disable @next/next/no-img-element */
import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import SearchNotFound from "components/SearchNotFound";
import { useDispatch } from "react-redux";
import { TourBillService } from "services/normal/tourBill";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import moment from "moment";
import { fCurrency2VND } from "utils/formatNumber";
import { Box, Collapse, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import {
  DataPagination,
  EBillStatus,
  EPaymentStatus,
  EServicePolicyType,
} from "models/general";
import InputSearch from "components/common/inputs/InputSearch";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { FindAll } from "models/tourBill";
import useDebounce from "hooks/useDebounce";
import StatusPayment from "components/StatusPayment";
import AddCardIcon from "@mui/icons-material/AddCard";
import { useRouter } from "next/router";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useTranslation } from "react-i18next";
import { BillHelper } from "helpers/bill";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Pagination from "@mui/material/Pagination";
import { RoomBillService } from "services/normal/roomBill";
import { RoomBill } from "models/roomBill";
import { Stay } from "models/stay";
import { fTime } from "utils/formatTime";
import DownloadRoomBill from "./DownloadRoomBill";
import PopupAddHotelComment from "pages/listHotel/[hotelId]/components/PopupAddHotelComment";
import PopupConfirmCancel from "./PopupConfirmCancel";
import PopupConfirmChange from "./PopupConfirmChange";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PopupDefault from "components/Popup/PopupDefault";
import PopupTermAndCondition from "./PopupTermAndCondition";
import StatusRefund from "components/StatusRefund";
// eslint-disable-next-line react/display-name
const StayHistory = memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const [modalDownloadRoomBill, setModalDownloadRoomBill] = useState(false);
  const [roomBill, setRoomBill] = useState<RoomBill>(null);
  const [data, setData] = useState<DataPagination<RoomBill>>();
  const [keyword, setKeyword] = useState<string>("");
  const [itemAction, setItemAction] = useState<RoomBill>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [openConfirmCancelBook, setOpenConfirmCancelBook] = useState(false);
  const [openConfirmChange, setOpenConfirmChange] = useState(false);
  const [openPopupAddComment, setOpenPopupAddComment] = useState(false);
  const [open, setOpen] = useState(-1);
  const [openPopupWarningCancel, setOpenPopupWarningCancel] = useState(false);
  const [openPopupWarningRate, setOpenPopupWarningRate] = useState(false);
  const [openPopupWarningReschedule, setOpenPopupWarningReschedule] =
    useState(false);

  const [itemRoomBill, setItemRoomBill] = useState<RoomBill>(null);

  const onTogglePopupTermAndCondition = (e, item) => {
    setItemRoomBill(item);
  };

  const onClosePopupTermAndCondition = () => {
    if (!itemRoomBill) return;
    setItemRoomBill(null);
  };

  const onToggleAddComment = () => setOpenPopupAddComment(!openPopupAddComment);

  const onTogglePopupWarningCancel = () =>
    setOpenPopupWarningCancel(!openPopupWarningCancel);

  const onTogglePopupWarningRate = () =>
    setOpenPopupWarningRate(!openPopupWarningRate);

  const onTogglePopupWarningReschedule = () => {
    setOpenPopupWarningReschedule(!openPopupWarningReschedule);
  };

  const onTogglePopupConfirmCancel = () => {
    setOpenConfirmCancelBook(!openConfirmCancelBook);
  };
  const onTogglePopupConfirmChange = () => {
    setOpenConfirmChange(!openConfirmChange);
  };

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: RoomBill
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const sortDataByDate = (first, second) =>
    Number(Date.parse(second)) - Number(Date.parse(first));

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    fetchData({
      page: newPage,
    });
  };

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    RoomBillService.findAll(params)
      .then((res) => {
        setData({
          data: res.data.sort(sortDataByDate),
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const _onSearch = useDebounce(
    (keyword: string) => fetchData({ keyword, page: 1 }),
    500
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const onPaymentAgain = () => {
    if (!itemAction) return;
    TourBillService.payAgain(itemAction?.id)
      .then((res) => {
        router.push(res?.data?.checkoutUrl);
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      });
  };

  const onDownloadBill = () => {
    setModalDownloadRoomBill(true);
    setRoomBill(itemAction);
    onCloseActionMenu();
  };

  const onCloseModalDownloadRoomBill = () => {
    setModalDownloadRoomBill(false);
    setRoomBill(null);
  };

  const onCancel = () => {
    if (
      itemAction?.paymentStatus === EPaymentStatus.PAID &&
      BillHelper.isCanReScheduleOrCancelBooking(
        itemAction.status,
        itemAction?.startDate,
        EServicePolicyType.REFUND,
        itemAction?.stayData?.stayPolicies
      )
    ) {
      setRoomBill(itemAction);
      onTogglePopupConfirmCancel();
      onCloseActionMenu();
    } else {
      onTogglePopupWarningCancel();
      onCloseActionMenu();
    }
  };

  const onChange = () => {
    if (
      itemAction?.paymentStatus === EPaymentStatus.PAID &&
      BillHelper.isCanReScheduleOrCancelBooking(
        itemAction.status,
        itemAction?.startDate,
        EServicePolicyType.RESCHEDULE,
        itemAction?.stayData?.stayPolicies
      )
    ) {
      setRoomBill(itemAction);
      onTogglePopupConfirmChange();
      onCloseActionMenu();
    } else {
      onTogglePopupWarningReschedule();
      onCloseActionMenu();
    }
  };

  const onRate = () => {
    if (itemAction?.status === EBillStatus.USED) {
      setRoomBill(itemAction);
      onToggleAddComment();
      onCloseActionMenu();
    } else {
      onTogglePopupWarningRate();
      onCloseActionMenu();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <div className={classes.boxInputSearch}>
            <InputSearch
              autoComplete="off"
              placeholder={t("payment_history_page_search")}
              value={keyword || ""}
              onChange={onSearch}
            />
          </div>
        </Row>
        <Grid>
          {data?.data?.length ? (
            data.data?.map((item, index) => {
              return (
                <Grid className={classes.linkView} key={index}>
                  <Grid
                    sx={{
                      display: "flex",
                      minHeight: "200px",
                      minWidth: "640px",
                      paddingBottom: "24px",
                    }}
                    className={classes.row}
                  >
                    <Grid
                      container
                      sx={{
                        boxShadow: "var(--box-shadow-100)",
                        borderRadius: "10px",
                      }}
                    >
                      <Grid
                        sx={{
                          flex: "1",
                          padding: "14px 14px 14px 24px",
                          justifyContent: "space-between",
                          backgroundColor: "var(--white-color)",
                          boxShadow: "var(--bui-shadow-100)",
                          borderTopLeftRadius: "10px",
                          borderBottomLeftRadius: "10px",
                        }}
                        item
                        xs={7}
                      >
                        <Grid
                          className={clsx(
                            classes.boxTitleDetail,
                            classes.linkDetail
                          )}
                        >
                          <Link href={`/listHotel/:${item?.stayData?.id}`}>
                            <p>{item?.stayData?.name}</p>
                          </Link>
                        </Grid>
                        <Grid container xs={12}>
                          <Grid container item xs={6}>
                            {item?.oldBillId && item?.oldBillData && (
                              <Grid item className={classes.boxSave} xs={12}>
                                <div className={classes.boxDate}>
                                  <p>
                                    {t("payment_history_page_tour_new_bill")}
                                  </p>
                                </div>
                              </Grid>
                            )}
                            <Grid item className={classes.boxSave} xs={12}>
                              <div className={classes.boxDate}>
                                <p>
                                  {t("payment_history_page_tour_booking_date")}:{" "}
                                  <span>
                                    {moment(item?.createdAt).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </span>
                                </p>
                              </div>
                            </Grid>
                            <Grid item className={classes.boxSave} xs={12}>
                              <div className={classes.boxDate}>
                                <p>
                                  {t("payment_history_page_hotel_start_date")} :{" "}
                                  <span>
                                    {moment(item?.startDate).format(
                                      "DD-MM-YYYY"
                                    )}{", "}
                                    {fTime(item?.stayData?.checkInTime)}
                                  </span>
                                </p>
                              </div>
                            </Grid>
                            <Grid item className={classes.boxSave} xs={12}>
                              <div className={classes.boxDate}>
                                <p>
                                  {t("payment_history_page_hotel_end_date")} :{" "}
                                  <span>
                                    {moment(item?.endDate).format("DD-MM-YYYY")}{", "}
                                    {fTime(item?.stayData?.checkOutTime)}
                                  </span>
                                </p>
                              </div>
                            </Grid>
                            {/* <Grid item className={classes.boxSave} xs={12}>
                              <div className={classes.boxDate}>
                                <p>
                                  {t("payment_history_page_hotel_check_in")} :{" "}
                                  <span>
                                    {fTime(item?.stayData?.checkInTime)}
                                  </span>
                                </p>
                              </div>
                            </Grid>
                            <Grid item className={classes.boxSave} xs={12}>
                              <div className={classes.boxDate}>
                                <p>
                                  {t("payment_history_page_hotel_check_out")} :{" "}
                                  <span>
                                    {fTime(item?.stayData?.checkOutTime)}
                                  </span>
                                </p>
                              </div>
                            </Grid> */}
                            {item?.discount !== 0 && (
                              <Grid item className={classes.boxSave}>
                                <Grid className={classes.boxPrice}>
                                  <p>
                                    {t("payment_history_page_tour_discount")}:{" "}
                                    <span>
                                      {fCurrency2VND(item?.discount)} VND
                                    </span>
                                  </p>
                                </Grid>
                              </Grid>
                            )}
                            <Grid item className={classes.boxSave} xs={12}>
                              <Grid className={classes.boxPrice}>
                                <p>
                                  {t(
                                    "payment_history_page_hotel_number_of_room_book"
                                  )}
                                  :{" "}
                                  <span>
                                    {item?.roomBillDetail.reduce(function (
                                      acc,
                                      obj
                                    ) {
                                      return acc + obj.amount;
                                    },
                                    0)}{" "}
                                  </span>
                                </p>
                              </Grid>
                            </Grid>
                            <Grid item className={classes.boxSave} xs={12}>
                              <Grid className={classes.boxPrice}>
                                <p>
                                  {t("payment_history_page_tour_total_bill")}:{" "}
                                  <span>
                                    {fCurrency2VND(item?.totalBill)} VND
                                  </span>{" "}
                                </p>
                              </Grid>
                            </Grid>
                            {item?.oldBillId && item?.extraPay && (
                              <Grid item xs={12} className={classes.boxSave}>
                                <Grid className={classes.boxPrice}>
                                  <p>
                                    {t("payment_history_page_tour_extra_pay")}:{" "}
                                    <span>
                                      {fCurrency2VND(item?.extraPay)} VND
                                    </span>
                                  </p>
                                </Grid>
                              </Grid>
                            )}
                            {item?.moneyRefund && (
                              <Grid item xs={12} className={classes.boxSave}>
                                <Grid className={classes.boxPrice}>
                                  <p>
                                    {t(
                                      "payment_history_page_tour_money_refund"
                                    )}{" "}
                                    <span>
                                      {" "}
                                      {fCurrency2VND(item?.moneyRefund)} VND
                                    </span>
                                  </p>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>

                          {item?.oldBillId && item?.oldBillData && (
                            <Grid
                              container
                              item
                              xs={6}
                              className={classes.boxOldBill}
                            >
                              <Grid item className={classes.boxSave} xs={12}>
                                <div className={classes.boxDate}>
                                  <p>
                                    {t("payment_history_page_tour_old_bill")}
                                  </p>
                                </div>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <div className={classes.boxDate}>
                                  <p>
                                    {t(
                                      "payment_history_page_tour_booking_date"
                                    )}
                                    :{" "}
                                    <span>
                                      {moment(
                                        item?.oldBillData?.createdAt
                                      ).format("DD-MM-YYYY")}
                                    </span>
                                  </p>
                                </div>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <div className={classes.boxDate}>
                                  <p>
                                    {t("payment_history_page_hotel_start_date")}{" "}
                                    :{" "}
                                    <span>
                                      {moment(
                                        item?.oldBillData?.startDate
                                      ).format("DD-MM-YYYY")}
                                    </span>
                                  </p>
                                </div>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <div className={classes.boxDate}>
                                  <p>
                                    {t("payment_history_page_hotel_end_date")} :{" "}
                                    <span>
                                      {moment(
                                        item?.oldBillData?.endDate
                                      ).format("DD-MM-YYYY")}
                                    </span>
                                  </p>
                                </div>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <div className={classes.boxDate}>
                                  <p>
                                    {t("payment_history_page_hotel_check_in")} :{" "}
                                    <span>
                                      {fTime(
                                        item?.oldBillData?.stayData?.checkInTime
                                      )}
                                    </span>
                                  </p>
                                </div>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <Grid className={classes.boxDate}>
                                  <p>
                                    {t("payment_history_page_hotel_check_out")}:{" "}
                                    <span>
                                      {fTime(
                                        item?.oldBillData?.stayData
                                          ?.checkOutTime
                                      )}
                                    </span>
                                  </p>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <Grid className={classes.boxPrice}>
                                  <p>
                                    {t(
                                      "payment_history_page_hotel_number_of_room_book"
                                    )}
                                    :{" "}
                                    <span>
                                      {item?.oldBillData?.roomBillDetail?.reduce(
                                        function (acc, obj) {
                                          return acc + obj.amount;
                                        },
                                        0
                                      )}{" "}
                                    </span>
                                  </p>
                                </Grid>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                className={clsx(
                                  classes.boxSave,
                                  classes.boxOldRoom
                                )}
                              >
                                <Grid
                                  className={classes.boxDate}
                                  sx={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setOpen(open === index ? -1 : index)
                                  }
                                >
                                  <p>
                                    {t("payment_history_page_room_bill_info")}
                                  </p>
                                  {open === index ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </Grid>
                                <Collapse
                                  in={open === index}
                                  timeout="auto"
                                  unmountOnExit
                                  className={classes.boxCollapse}
                                >
                                  {item?.oldBillData?.roomBillDetail?.map(
                                    (room, i) => (
                                      <Grid
                                        item
                                        xs={12}
                                        className={classes.boxSave}
                                        key={i}
                                      >
                                        <Grid className={classes.boxDate}>
                                          <p>
                                            {t(
                                              "payment_history_page_hotel_room_name"
                                            )}
                                            :{" "}
                                            <span>{room?.roomData?.title}</span>
                                          </p>
                                        </Grid>
                                      </Grid>
                                    )
                                  )}
                                </Collapse>
                              </Grid>
                              <Grid item xs={12} className={classes.boxSave}>
                                <Grid className={classes.boxPrice}>
                                  <p>
                                    {t("payment_history_page_tour_total_bill")}:{" "}
                                    <span>
                                      {fCurrency2VND(
                                        item?.oldBillData?.totalBill
                                      )}{" "}
                                      VND
                                    </span>{" "}
                                  </p>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item xs={5} container>
                        <Grid className={classes.containerPrice} container>
                          <Grid item className={classes.boxMenu}>
                            <IconButton
                              className={clsx(classes.actionButton)}
                              color="primary"
                              onClick={(e) => {
                                handleAction(e, item);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Grid>

                          <Grid
                            container
                            item
                            xs={10}
                            sx={{ maxWidth: "100% !important" }}
                          >
                            <Grid>
                              <Grid className={classes.boxTitle} item xs={12}>
                                <p className={classes.textStatus}>
                                  {t(
                                    "payment_history_page_tour_status_payment"
                                  )}{" "}
                                  <StatusPayment status={item?.paymentStatus} />
                                </p>
                              </Grid>
                              {item?.paymentStatus === EPaymentStatus.PAID && (
                                <Grid className={classes.boxTitle} item xs={12}>
                                  <p className={classes.textStatus}>
                                    {t("payment_history_page_tour_status_bill")}{" "}
                                    {item?.paymentStatus ===
                                    EPaymentStatus.PAID ? (
                                      <StatusPayment
                                        status={item?.status}
                                        type={true}
                                      />
                                    ) : (
                                      "-"
                                    )}
                                  </p>
                                </Grid>
                              )}
                              {item?.moneyRefund && (
                                <Grid className={classes.boxTitle} item xs={12}>
                                  <p className={classes.textStatus}>
                                    {t(
                                      "payment_history_page_tour_status_refund"
                                    )}{" "}
                                    <StatusRefund
                                      statusRefund={item?.isRefunded}
                                      titleTrue={t(
                                        "payment_history_page_tour_bill_status_refund"
                                      )}
                                      titleFalse={t(
                                        "payment_history_page_tour_bill_status_not_refund"
                                      )}
                                    />
                                  </p>
                                </Grid>
                              )}
                              <Grid className={classes.boxImgTerms}>
                                <Grid
                                  className={clsx(classes.boxImg, {
                                    [classes.boxImgNew]: !item?.oldBillId,
                                  })}
                                  onClick={() =>
                                    router.push(
                                      `/listHotel/:${item?.stayData?.id}`
                                    )
                                  }
                                >
                                  <img
                                    src={item?.stayData?.images[0]}
                                    alt="anh"
                                  ></img>
                                </Grid>
                                <Grid
                                  className={classes.boxTerms}
                                  onClick={(e) =>
                                    onTogglePopupTermAndCondition(e, item)
                                  }
                                >
                                  {t("payment_history_page_tour_bill_terms")}
                                </Grid>
                                {itemRoomBill?.id === item?.id && (
                                  <PopupTermAndCondition
                                    isOpen={!!itemRoomBill}
                                    toggle={onClosePopupTermAndCondition}
                                    stay={item?.stayData}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })
          ) : (
            <Grid>
              <SearchNotFound searchQuery={keyword} />
            </Grid>
          )}
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Pagination
            count={data?.meta?.pageCount || 0}
            page={data?.meta?.page}
            onChange={handleChangePage}
          />
        </Grid>
        <Menu
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={actionAnchor}
          keepMounted
          open={Boolean(actionAnchor)}
          onClose={onCloseActionMenu}
        >
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            className={classes.menuItem}
            onClick={onDownloadBill}
          >
            <Box display="flex" alignItems={"center"}>
              <VisibilityIcon
                sx={{
                  fontSize: "28px",
                  color: "var(--primary-color)",
                  marginRight: "8px",
                }}
              />
              <span>{t("payment_history_page_tour_status_download_view")}</span>
            </Box>
          </MenuItem>
          {itemAction?.paymentStatus === EPaymentStatus.PAID && (
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              className={classes.menuItem}
              onClick={onChange}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined
                  sx={{ marginRight: "0.25rem" }}
                  fontSize="small"
                />
                <span>{t("payment_history_page_tour_action_reschedule")}</span>
              </Box>
            </MenuItem>
          )}
          {itemAction?.paymentStatus !== EPaymentStatus.PAID && (
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              className={classes.menuItem}
              onClick={onPaymentAgain}
            >
              <Box display="flex" alignItems={"center"}>
                <AddCardIcon
                  sx={{ marginRight: "0.25rem" }}
                  color="info"
                  fontSize="small"
                />
                <span>{t("payment_history_page_tour_action_pay")}</span>
              </Box>
            </MenuItem>
          )}
          {itemAction?.paymentStatus === EPaymentStatus.PAID && (
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              className={classes.menuItem}
              onClick={onCancel}
            >
              <Box display="flex" alignItems={"center"}>
                <DeleteOutlineOutlined
                  sx={{ marginRight: "0.25rem" }}
                  color="error"
                  fontSize="small"
                />
                <span>{t("payment_history_page_tour_action_cancel")}</span>
              </Box>
            </MenuItem>
          )}
          {itemAction?.status === EBillStatus.USED && (
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              className={classes.menuItem}
              onClick={onRate}
            >
              <Box display="flex" alignItems={"center"}>
                <AddCommentIcon
                  sx={{ marginRight: "0.25rem" }}
                  fontSize="small"
                  color="info"
                />
                <span>{t("payment_history_page_tour_action_rate")}</span>
              </Box>
            </MenuItem>
          )}
        </Menu>
      </div>
      <DownloadRoomBill
        onClose={onCloseModalDownloadRoomBill}
        isOpen={modalDownloadRoomBill}
        roomBill={roomBill}
      />
      {openConfirmChange && (
        <PopupConfirmChange
          isOpen={openConfirmChange}
          onClose={onTogglePopupConfirmChange}
          roomBill={roomBill}
        />
      )}
      {openConfirmCancelBook && (
        <PopupConfirmCancel
          isOpen={openConfirmCancelBook}
          onClose={onTogglePopupConfirmCancel}
          roomBill={roomBill}
          callBack={fetchData}
        />
      )}
      <PopupAddHotelComment
        isOpen={openPopupAddComment}
        // commentEdit={commentEdit}
        onClose={onToggleAddComment}
        toggle={onToggleAddComment}
        // onGetTourComments={onGetTourComments}
        roomBill={roomBill}
      />
      <PopupDefault
        isOpen={openPopupWarningCancel}
        toggle={onTogglePopupWarningCancel}
        title={t("popup_change_date_payment_history_notification")}
        description={t(
          "popup_change_date_payment_history_notification_not_cancel"
        )}
      />
      <PopupDefault
        isOpen={openPopupWarningRate}
        toggle={onTogglePopupWarningRate}
        title={t("popup_change_date_payment_history_notification")}
        description={t(
          "popup_change_date_payment_history_notification_not_rate"
        )}
      />
      <PopupDefault
        isOpen={openPopupWarningReschedule}
        toggle={onTogglePopupWarningReschedule}
        title={t("popup_change_date_payment_history_notification")}
        description={t(
          "popup_change_date_payment_history_notification_not_reschedule"
        )}
      />
    </>
  );
});

export default StayHistory;
