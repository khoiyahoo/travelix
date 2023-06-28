import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import {
  DataPagination,
  EBillStatus,
  EPaymentStatus,
  OptionItem,
  TableHeaderLabel,
  billStatusType,
} from "models/general";
import { EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";

import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import "react-loading-skeleton/dist/skeleton.css";
import { TourBill } from "models/enterprise/tourBill";
import { TourBillService } from "services/enterprise/tourBill";
import { fCurrency2VND } from "utils/formatNumber";
import moment from "moment";
import StatusPayment from "components/StatusPayment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PopupChangeStatus from "./components/PopupChangeStatus";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { useTranslation } from "react-i18next";
import InputSelect from "components/common/inputs/InputSelect";
import { SelectOption } from "common/general";
import InputSearch from "components/common/inputs/InputSearch";
import { RoomBillService } from "services/enterprise/roomBill";
import { Moment } from "moment";
import { FindAll, RoomBill } from "models/enterprise/roomBill";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import Button, { BtnType } from "components/common/buttons/Button";
import { fTime } from "utils/formatTime";

interface Props {}
// eslint-disable-next-line react/display-name
const RoomBills = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_room_bill_title_stay_name"),
      sortable: false,
    },
    {
      name: "roomName",
      label: t("enterprise_management_section_room_bill_title_room_name"),
      sortable: false,
    },
    {
      name: "duration",
      label: t("enterprise_management_section_room_bill_header_table_duration"),
      sortable: false,
    },
    {
      name: "total bill",
      label: t("enterprise_management_section_tour_bill_header_table_total"),
      sortable: false,
    },
    {
      name: "start time",
      label: t(
        "enterprise_management_section_tour_bill_header_table_start_time"
      ),
      sortable: false,
    },
    {
      name: "end time",
      label: t("enterprise_management_section_tour_bill_header_table_end_time"),
      sortable: false,
    },
    {
      name: "booking date",
      label: t(
        "enterprise_management_section_tour_bill_header_table_booking_date"
      ),
      sortable: false,
    },
    {
      name: "statusPayment",
      label: t(
        "enterprise_management_section_tour_bill_header_table_status_payment"
      ),
      sortable: false,
    },
    {
      name: "statusBill",
      label: t("enterprise_management_section_tour_bill_header_table_status"),
      sortable: false,
    },
    {
      name: "actions",
      label: t("enterprise_management_section_tour_bill_header_table_action"),
      sortable: false,
    },
  ];

  const [itemAction, setItemAction] = useState<RoomBill>();

  const [data, setData] = useState<DataPagination<RoomBill>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [openPopupChangeStatus, setOpenPopupChangeStatus] = useState(false);
  const [roomBillId, setRoomBillId] = useState(null);
  const [stayOption, setStayOption] = useState<OptionItem[]>([]);
  const [roomOption, setRoomOption] = useState<OptionItem[]>([]);
  const [stayFilter, setStayFilter] = useState<number>(-1);
  const [roomFilter, setRoomFilter] = useState<number>(null);
  const [statusFilter, setStatusFilter] = useState<number>(-1);
  const [dateFilter, setDateFilter] = useState<Moment>(null);
  const [filterData, setFilterData] = useState(null);

  useEffect(() => {
    getFilterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stayOption,
    roomOption,
    stayFilter,
    roomFilter,
    dateFilter,
    statusFilter,
  ]);

  const onClosePopupChangeStatus = () => {
    setOpenPopupChangeStatus(!openPopupChangeStatus);
  };

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: RoomBill
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    fetchData({
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    fetchData({
      take: Number(event.target.value),
      page: 1,
    });
  };

  const getFilterData = () => {
    RoomBillService.getFilters()
      .then((res) => {
        if (res?.success) {
          const _stayOption = res.data?.stays?.map((item, index) => ({
            id: index + 1,
            name: item?.name,
            value: item?.id,
          }));
          setStayOption(_stayOption);
          setStayFilter(_stayOption[0].value);
          setFilterData(res?.data?.stays);
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    filterData?.forEach((item, index) => {
      if (item?.id === stayFilter) {
        setRoomOption(
          item?.listRooms?.map((room, index) => ({
            id: index + 1,
            name: room.title,
            value: room?.id,
          }))
        );
      }
    });
  }, [stayFilter]);

  const sortDataByDate = (first, second) =>
    Number(Date.parse(second)) - Number(Date.parse(first));

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,

      roomId: roomFilter || null,
      stayId: stayFilter || -1,
      date: dateFilter?.toDate(),
      status: statusFilter || -1,
    };

    dispatch(setLoading(true));

    RoomBillService.findAll(params)
      .then((res) => {
        setData({
          data: res.data.sort(sortDataByDate),
          meta: res.meta,
        });
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: RoomBill) => {
    router.push({
      pathname: `/enterprises/roomBills/${item.id}`,
    });
  };

  const onChangeStatus = () => {
    setRoomBillId(itemAction?.id);
    onClosePopupChangeStatus();
    onCloseActionMenu();
  };

  const onClear = () => {
    setDateFilter(null);
    setRoomFilter(null);
    setStatusFilter(-1);
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_room_bill_title_tab")}</h3>
        </Row>
        <Grid
          item
          xs={12}
          sx={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid container columnSpacing={2} xs={10}>
            <Grid item xs={3}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_room_bill_title_tab_filter_stay"
                )}
                defaultValue={stayOption[0]}
                value={stayOption[0]}
                selectProps={{
                  options: stayOption,
                  placeholder: t(
                    "enterprise_management_section_room_bill_title_tab_filter_stay_place"
                  ),
                }}
                onChange={(e) => setStayFilter(e?.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_room_bill_title_tab_filter_room"
                )}
                selectProps={{
                  options: roomOption,
                  placeholder: t(
                    "enterprise_management_section_room_bill_title_tab_filter_room_place"
                  ),
                }}
                onChange={(e) => setRoomFilter(e?.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_bill_title_filter_status"
                )}
                bindLabel="translation"
                selectProps={{
                  options: billStatusType,
                  placeholder: t(
                    "enterprise_management_section_tour_bill_title_filter_status_placeholder"
                  ),
                }}
                onChange={(e) => setStatusFilter(e?.value)}
              />
            </Grid>
            <Grid xs={3} item>
              <InputDatePicker
                label={t(
                  "enterprise_management_section_room_bill_title_tab_filter_date"
                )}
                className={classes.inputSearchDate}
                placeholder={t(
                  "landing_page_section_search_tour_input_start_time"
                )}
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                closeOnSelect
                value={dateFilter ? dateFilter : ""}
                initialValue={dateFilter ? dateFilter : ""}
                _onChange={(e) => setDateFilter(moment(e?._d))}
              />
            </Grid>
          </Grid>
          <Grid>
            <Button btnType={BtnType.Primary} onClick={onClear}>
              {t("enterprise_management_section_tour_statistic_btn_clear")}
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table className={classes.table}>
            <TableHeader headers={tableHeaders} />
            <TableBody>
              {data?.data?.length ? (
                data.data?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell scope="row" className={classes.tableCell}>
                        {index + 1}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.stayData?.name}
                      </TableCell>
                      <TableCell
                        className={clsx(classes.tableCell, classes.bookInfo)}
                        component="th"
                      >
                        {item?.bookedRoomsInfo?.map((item, index) => (
                          <div key={index}>
                            <span>
                              {item?.title} - {item?.amount}{" "}
                              {t(
                                "enterprise_management_section_room_bill_title_room"
                              )}{" "}
                            </span>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fTime(item?.stayData?.checkInTime)}{" "}
                        {fTime(item?.stayData?.checkOutTime)}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.totalBill)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.startDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.endDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        <StatusPayment status={item?.paymentStatus} />
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.paymentStatus === EPaymentStatus.PAID ||
                        item?.status === EBillStatus.CANCELED ? (
                          <StatusPayment status={item?.status} type={true} />
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="text-center" component="th">
                        <IconButton
                          className={clsx(classes.actionButton)}
                          color="primary"
                          onClick={(event) => {
                            handleAction(event, item);
                          }}
                        >
                          <ExpandMoreOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={11}>
                    <SearchNotFound />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            labelRowsPerPage={t("common_row_per_page")}
            labelDisplayedRows={function defaultLabelDisplayedRows({
              from,
              to,
              count,
            }) {
              return t("common_row_of_page", {
                from: from,
                to: to,
                count: count,
              });
            }}
            component="div"
            className={classes.pagination}
            count={data?.meta?.itemCount || 0}
            rowsPerPage={data?.meta?.take || 10}
            page={data?.meta?.page ? data?.meta?.page - 1 : 0}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
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
            onClick={handleRedirect}
            className={classes.menuItem}
          >
            <Box display="flex" alignItems={"center"}>
              <VisibilityIcon
                sx={{ marginRight: "0.25rem" }}
                fontSize="small"
                color="info"
              />
              <span>
                {t("enterprise_management_section_tour_bill_action_view")}
              </span>
            </Box>
          </MenuItem>
          {itemAction?.paymentStatus === EPaymentStatus.PAID &&
            itemAction?.status !== EBillStatus.USED &&
            itemAction?.status !== EBillStatus.CANCELED && (
              <MenuItem
                sx={{ fontSize: "0.875rem" }}
                onClick={onChangeStatus}
                className={classes.menuItem}
              >
                <Box display="flex" alignItems={"center"}>
                  <PublishedWithChangesIcon
                    sx={{ marginRight: "0.25rem" }}
                    fontSize="small"
                    color="success"
                  />
                  <span>
                    {t(
                      "enterprise_management_section_tour_bill_action_change_status"
                    )}
                  </span>
                </Box>
              </MenuItem>
            )}
        </Menu>
      </div>
      <PopupChangeStatus
        isOpen={openPopupChangeStatus}
        onClose={onClosePopupChangeStatus}
        billId={roomBillId}
        fetchData={fetchData}
      />
    </>
  );
});

export default RoomBills;
