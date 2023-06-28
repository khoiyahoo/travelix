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
import { FindAll, TourBill } from "models/enterprise/tourBill";
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
import Button, { BtnType } from "components/common/buttons/Button";

interface Props {}
// eslint-disable-next-line react/display-name
const Tour = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_tour_bill_header_table_name"),
      sortable: false,
    },
    {
      name: "duration",
      label: t("enterprise_management_section_tour_bill_header_table_duration"),
      sortable: false,
    },
    {
      name: "total bill",
      label: t("enterprise_management_section_tour_bill_header_table_total"),
      sortable: false,
    },
    {
      name: "amount",
      label: t("enterprise_management_section_tour_bill_header_table_amount"),
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

  const [itemAction, setItemAction] = useState<TourBill>();

  const [data, setData] = useState<DataPagination<TourBill>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [openPopupChangeStatus, setOpenPopupChangeStatus] = useState(false);
  const [isTookPlace, setIsTookPlace] = useState<boolean>(false);
  const [tourBillId, setTourBillId] = useState(null);
  const [tourOption, setTourOption] = useState<OptionItem[]>([]);
  const [tourOnSaleOption, setTourOnSaleOption] = useState<OptionItem[]>([]);
  const [tourFilter, setTourFilter] = useState<number>(-1);
  const [tourOnSalesFilter, setTourOnSalesFilter] = useState<number[]>([-1]);
  const [statusFilter, setStatusFilter] = useState<number>(-1);

  useEffect(() => {
    getFilterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTookPlace]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourFilter, tourOnSalesFilter, isTookPlace, statusFilter]);

  const onClosePopupChangeStatus = () => {
    setOpenPopupChangeStatus(!openPopupChangeStatus);
  };

  const sortDataByDate = (first, second) =>
    Number(Date.parse(second)) - Number(Date.parse(first));

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: TourBill
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
    TourBillService.getFilters({ isPast: isTookPlace })
      .then((res) => {
        if (res?.success) {
          setTourOption([
            ...[{ id: 0, name: t("common_select_all"), value: -1 }],
            ...res.data.tour.map((item, index) => ({
              id: index + 1,
              name: item.title,
              value: item.id,
            })),
          ]);
          setTourOnSaleOption([
            ...[{ id: 0, name: t("common_select_all"), value: [-1] }],
            ...res.data.tourOnSale.map((item, index) => ({
              id: index + 1,
              name: moment(item.startDate).format("DD/MM/YYYY"),
              value: item.tourOnSaleIds,
            })),
          ]);
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      tourId: tourFilter || -1,
      tourOnSaleIds: tourOnSalesFilter || [-1],
      status: statusFilter || -1,
    };

    dispatch(setLoading(true));

    TourBillService.findAll(params)
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

  const onRedirectEdit = (item: TourBill) => {
    router.push({
      pathname: `/enterprises/tourBills/${item.id}`,
    });
  };

  const onChangeStatus = () => {
    setTourBillId(itemAction?.id);
    onClosePopupChangeStatus();
    onCloseActionMenu();
  };

  const onClear = () => {
    setTourOnSalesFilter([-1]);
    setStatusFilter(-1);
    setStatusFilter(-1);
    setTourFilter(-1);
    setIsTookPlace(false);
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_tour_bill_title_tab")}</h3>
        </Row>
        <Grid
          item
          xs={3}
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
                  "enterprise_management_section_tour_bill_title_filter_tour"
                )}
                selectProps={{
                  options: tourOption,
                  placeholder: t(
                    "enterprise_management_section_tour_bill_title_filter_tour_placeholder"
                  ),
                }}
                onChange={(e) => setTourFilter(e?.value)}
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

            <Grid item xs={3}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_bill_title_filter_date"
                )}
                selectProps={{
                  options: tourOnSaleOption,
                  placeholder: t(
                    "enterprise_management_section_tour_bill_title_filter_date_placeholder"
                  ),
                }}
                onChange={(e) => setTourOnSalesFilter(e?.value)}
              />
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }} xs={3}>
              <FormControlLabel
                className={classes.checkBoxTourTaken}
                control={
                  <InputCheckbox
                    checked={isTookPlace}
                    onChange={() => setIsTookPlace(!isTookPlace)}
                  />
                }
                label={t(
                  "enterprise_management_section_tour_bill_title_filter_taken_place"
                )}
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
                        <a
                          href={`/listTour/:${item?.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className={classes.tourName}
                        >
                          {item?.tourData?.title}
                        </a>
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.tourData?.numberOfDays} {t("common_days")}{" "}
                        {item?.tourData?.numberOfNights} {t("common_nights")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.totalBill)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.amountAdult + item?.amountChild}{" "}
                        {t(
                          "enterprise_management_section_tour_bill_body_table_amount"
                        )}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.tourOnSaleData?.startDate).format(
                          "DD-MM-YYYY"
                        )}
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
                  <TableCell align="center" colSpan={10}>
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
        tourBillId={tourBillId}
        fetchData={fetchData}
      />
    </>
  );
});

export default Tour;
