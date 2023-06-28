import React, { memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";
import {
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
import { useTranslation } from "react-i18next";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { RoomOtherPriceService } from "services/enterprise/roomOtherPrice";
import { FindAll, IRoomOtherPrice } from "models/enterprise/roomOtherPrice";
import { Room } from "models/enterprise/room";
import moment from "moment";
import { fCurrency2VND } from "utils/formatNumber";

interface Props {
  room?: Room;
  handleNextStep: () => void;
}
// eslint-disable-next-line react/display-name
const RoomOtherPricePast = memo(({ room, handleNextStep }: Props) => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "Date",
      label: t(
        "enterprise_management_section_stay_header_table_room_other_price_date"
      ),
      sortable: false,
    },
    {
      name: "price",
      label: t(
        "enterprise_management_section_stay_header_table_room_other_price_price"
      ),
      sortable: false,
    },
  ];

  const [data, setData] = useState<DataPagination<IRoomOtherPrice>>();

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
    RoomOtherPriceService.findAll(room?.id, params)
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
    if (room) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

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
                        {moment(item?.date).format("D/M/YYYY")}{" "}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.price)} VND
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

export default RoomOtherPricePast;
