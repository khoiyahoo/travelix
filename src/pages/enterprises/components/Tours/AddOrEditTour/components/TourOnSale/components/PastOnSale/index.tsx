import React, { memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  Grid,
} from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import TableHeader from "components/Table/TableHeader";
import { DataPagination, TableHeaderLabel } from "models/general";
import { useRouter } from "next/router";
import "react-loading-skeleton/dist/skeleton.css";
import { fCurrency2VND } from "utils/formatNumber";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { TourOnSaleService } from "services/enterprise/tourOnSale";
import { ETour, FindAll, TourPrice } from "models/enterprise";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface Props {
  tour?: ETour;
  handleNextStep: () => void;
}
// eslint-disable-next-line react/display-name
const TourOnSalePast = memo(({ tour, handleNextStep }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "departure day",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_start_date"
      ),
      sortable: false,
    },
    {
      name: "quantity",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_quantity"
      ),
      sortable: false,
    },
    {
      name: "number of booking",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_number_booking"
      ),
      sortable: false,
    },
    {
      name: "number of tickets booked",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_adult_price"
      ),
      sortable: false,
    },
    {
      name: "revenue",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_children_price"
      ),
      sortable: false,
    },
    {
      name: "commission",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_children_age_min"
      ),
      sortable: false,
    },
    {
      name: "profit",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_children_age_max"
      ),
      sortable: false,
    },
    {
      name: "profit",
      label: t(
        "enterprise_management_section_tour_tab_range_price_header_table_discount"
      ),
      sortable: false,
    },
  ];

  const [data, setData] = useState<DataPagination<TourPrice>>();

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

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      isPast: true,
    };
    dispatch(setLoading(true));

    TourOnSaleService.findAll(tour?.id, params)
      .then((res) => {
        if (res.success) {
          setData({
            data: res.data,
            meta: res.meta,
          });
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    if (tour) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour]);

  return (
    <>
      <div className={classes.root}>
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
                        {moment(item?.startDate).format("D/M/YYYY")}{" "}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.quantity}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.quantityOrdered}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.adultPrice)}VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.childrenPrice)}VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.childrenAgeMin}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.childrenAgeMin}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.discount} %
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={9}>
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
        <Grid className={classes.boxNextBtn}>
          <Button btnType={BtnType.Primary} onClick={handleNextStep}>
            {t("enterprise_management_section_tour_tab_range_price_next")}
            <ArrowRightAltIcon />
          </Button>
        </Grid>
      </div>
    </>
  );
});

export default TourOnSalePast;
