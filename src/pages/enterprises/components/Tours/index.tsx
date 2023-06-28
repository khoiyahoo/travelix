import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Row } from "reactstrap";
import Button, { BtnType } from "components/common/buttons/Button";
import Skeleton from "react-loading-skeleton";

import { AdminGetTours, ETour } from "models/enterprise";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
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
  LangSupport,
  langSupports,
  TableHeaderLabel,
} from "models/general";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";

import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import { fCurrency2VND } from "utils/formatNumber";
import StatusChip from "components/StatusChip";
import PopupConfirmWarning from "components/Popup/PopupConfirmWarning";
import InputSelect from "components/common/inputs/InputSelect";

interface Props {
  handleTourEdit?: () => void;
}

// eslint-disable-next-line react/display-name
const Tour = memo(({ handleTourEdit }: Props) => {
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
      name: "duration",
      label: t("enterprise_management_section_tour_header_duration"),
      sortable: false,
    },
    {
      name: "Number of tour on sale",
      label: t("enterprise_management_section_tour_header_number_tour_on_sale"),
      sortable: false,
    },
    {
      name: "Price range",
      label: t("enterprise_management_section_tour_header_price_range"),
      sortable: false,
    },
    {
      name: "status",
      label: t("enterprise_management_section_tour_header_status"),
      sortable: false,
    },
    {
      name: "languages",
      label: t("enterprise_management_section_tour_header_language"),
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
  const [itemDelete, setItemDelete] = useState<ETour>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<ETour>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(
    null
  );
  const [openPopupWarning, setOpenPopupWarning] = useState(false);
  const [tourFilter, setTourFilter] = useState<number>(-1);

  const onTogglePopupWarning = () => {
    setOpenPopupWarning(!openPopupWarning);
  };

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

  const onCreateTour = () => {
    router.push("/enterprises/tours/create-tour");
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
    setLanguageAnchor(null);
  };

  const onShowLangAction = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const onCloseLangAction = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageRedirect = (lang?: LangSupport) => {
    if (!itemAction) return;
    onRedirectEdit(itemAction, lang);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: ETour, lang?: LangSupport) => {
    router.push({
      pathname: `/enterprises/tours/${item.id}`,
      search: lang && `?lang=${lang.key}`,
    });
  };

  const onShowConfirm = () => {
    if (!itemAction) return;

    if (itemAction?.isCanDelete === false) {
      onTogglePopupWarning();
    } else {
      setItemDelete(itemAction);
    }
    onCloseActionMenu();
  };

  const onClosePopupConfirmDelete = () => {
    if (!itemDelete) return;
    setItemDelete(null);
    onCloseActionMenu();
  };

  const onYesDelete = () => {
    if (!itemDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    TourService.delete(itemDelete?.id)
      .then(() => {
        dispatch(setSuccessMess(t("common_delete_success")));
        fetchData();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
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
          <h3>{t("enterprise_management_section_tour_title")}</h3>
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

          <Button btnType={BtnType.Primary} onClick={onCreateTour}>
            <FontAwesomeIcon icon={faPlus} />
            {t("common_create")}
          </Button>
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
                        {item?.numberOfDays}{" "}
                        {t("enterprise_management_section_tour_body_day")} -{" "}
                        {item?.numberOfNights}{" "}
                        {t("enterprise_management_section_tour_body_night")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.numberOfTookPlaceTours}{" "}
                        {t(
                          "enterprise_management_section_tour_body_took_place"
                        )}
                        , {item?.numberOfUpcomingTours}
                        {t("enterprise_management_section_tour_body_upcoming")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.minPrice)} -{" "}
                        {fCurrency2VND(item?.maxPrice)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        <StatusChip status={!item?.isDeleted} />
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.languages?.map((it) => it.language).join(", ")}
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
            onClick={onShowLangAction}
            className={classes.menuItem}
          >
            <Box display="flex" alignItems={"center"}>
              <EditOutlined sx={{ marginRight: "0.25rem" }} fontSize="small" />
              <span>
                {t("enterprise_management_section_tour_edit_language")}
              </span>
            </Box>
          </MenuItem>

          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            className={classes.menuItem}
            onClick={onShowConfirm}
          >
            <Box display="flex" alignItems={"center"}>
              <DeleteOutlineOutlined
                sx={{ marginRight: "0.25rem" }}
                color="error"
                fontSize="small"
              />
              <span>{t("common_delete")}</span>
            </Box>
          </MenuItem>
        </Menu>
        <Menu
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={languageAnchor}
          keepMounted
          open={Boolean(languageAnchor)}
          onClose={onCloseLangAction}
        >
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            className={classes.menuItem}
            onClick={() => {
              handleLanguageRedirect();
            }}
          >
            <span>
              {t("enterprise_management_section_tour_edit_language_default")}
            </span>
          </MenuItem>
          {langSupports.map((item, index) => (
            <MenuItem
              key={index}
              sx={{ fontSize: "0.875rem" }}
              className={classes.menuItem}
              onClick={() => {
                handleLanguageRedirect(item);
              }}
            >
              <span>{item.name}</span>
            </MenuItem>
          ))}
        </Menu>
        <PopupConfirmDelete
          title={t(
            "enterprise_management_section_tour_popup_confirm_delete_title"
          )}
          isOpen={!!itemDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
        <PopupConfirmWarning
          title={t(
            "enterprise_management_section_tour_popup_confirm_delete_title"
          )}
          isOpen={openPopupWarning}
          onClose={onTogglePopupWarning}
          toggle={onTogglePopupWarning}
        />
      </div>
    </>
  );
});

export default Tour;
