import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdminGetTours, ETour } from "models/enterprise";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { TourService } from "services/enterprise/tour";
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
  Grid,
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import {
  DataPagination,
  EStatusService,
  TableHeaderLabel,
} from "models/general";
import { EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";

import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import StatusChip from "components/StatusChip";
import InputSelect from "components/common/inputs/InputSelect";

interface Props {}

// eslint-disable-next-line react/display-name
const Tour = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_tour_header_name"),
      sortable: false,
    },

    {
      name: "rate",
      label: t("enterprise_management_section_tour_header_rate"),
      sortable: false,
    },
    {
      name: "numberOfReviewers",
      label: t("enterprise_management_section_tour_header_reviewer"),
      sortable: false,
    },

    {
      name: "status",
      label: t("enterprise_management_section_tour_header_status"),
      sortable: false,
    },

    { name: "actions", label: t("common_action"), sortable: false },
  ];

  const tourFilterOption = [
    { id: 0, name: t("common_select_all"), value: -1 },
    {
      id: 1,
      name: t("enterprise_management_section_tour_filter_status_active"),
      value: EStatusService.ACTIVE,
    },
    {
      id: 2,
      name: t("enterprise_management_section_tour_filter_status_in_active"),
      value: EStatusService.IN_ACTIVE,
    },
  ];

  const [itemAction, setItemAction] = useState<ETour>();
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<ETour>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [tourFilter, setTourFilter] = useState<number>(-1);

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: ETour
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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: AdminGetTours = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
      status: tourFilter || -1,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));

    TourService.getTours(params)
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const _onSearch = useDebounce(
    (keyword: string) => fetchData({ keyword, page: 1 }),
    500
  );
  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const onRedirectEdit = (item: ETour) => {
    router.push({
      pathname: `/enterprises/tourRates/${item.id}`,
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourFilter, keyword]);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_tour_title_rate")}</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <Grid className={classes.boxInputSearch} container spacing={2} xs={6}>
            <Grid item>
              <InputSearch
                autoComplete="off"
                placeholder={t("common_search")}
                value={keyword || ""}
                onChange={onSearch}
              />
            </Grid>
            <Grid item xs={6}>
              <InputSelect
                fullWidth
                selectProps={{
                  options: tourFilterOption,
                  placeholder: t(
                    "enterprise_management_section_tour_header_status"
                  ),
                }}
                onChange={(e) => setTourFilter(e?.value)}
              />
            </Grid>
          </Grid>
        </Row>
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
                          {item?.title}
                        </a>
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.rate}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.numberOfReviewer}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        <StatusChip status={!item?.isDeleted} />
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
                  <TableCell align="center" colSpan={8}>
                    <SearchNotFound searchQuery={keyword} />
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
        </Menu>
      </div>
    </>
  );
});

export default Tour;
