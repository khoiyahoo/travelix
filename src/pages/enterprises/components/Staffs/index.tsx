import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Row } from "reactstrap";
import Button, { BtnType } from "components/common/buttons/Button";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";

import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import { DataPagination, TableHeaderLabel } from "models/general";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import { FindAll, IStaff } from "models/enterprise/staff";
import { StaffService } from "services/enterprise/staff";
import PopupSendOffer from "./components/PopupSendOffer";
import { getRoleUser } from "utils/getOption";
import StatusChip from "components/StatusChip";
import { useTranslation } from "react-i18next";
import moment from "moment";
import TourIcon from "@mui/icons-material/Tour";
import ApartmentIcon from "@mui/icons-material/Apartment";
interface Props {
  handleTourEdit?: () => void;
}
// eslint-disable-next-line react/display-name
const Staff = memo(({ handleTourEdit }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_staff_header_table_name"),
      sortable: false,
    },
    {
      name: "address",
      label: t("enterprise_management_section_staff_header_table_address"),
      sortable: false,
    },
    {
      name: "phoneNumber",
      label: t("enterprise_management_section_staff_header_table_phone"),
      sortable: false,
    },
    {
      name: "dateBecome",
      label: t("enterprise_management_section_staff_header_table_date_become"),
      sortable: false,
    },
    {
      name: "role",
      label: t("enterprise_management_section_staff_header_table_role"),
      sortable: false,
    },
    {
      name: "status",
      label: t("enterprise_management_section_staff_header_table_status"),
      sortable: false,
    },
    {
      name: "actions",
      label: t("enterprise_management_section_staff_header_table_action"),
      sortable: false,
    },
  ];

  const [staffDelete, setStaffDelete] = useState<IStaff>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<IStaff>>();
  const [openPopupSendOffer, setOpenPopupSendOffer] = useState(false);

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
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    StaffService.findAll(params)
      .then((res) => {
        setData({
          data: res.data,
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

  const onOpenPopupSendOffer = () => setOpenPopupSendOffer(!openPopupSendOffer);

  const onRedirectOfferStaff = () => {
    router.push("/enterprises/staffs/list-offers");
  };

  const onRedirectTourTransaction = () => {
    router.push("/enterprises/staffs/tour-transaction");
  };

  const onRedirectStayTransaction = () => {
    router.push("/enterprises/staffs/stay-transaction");
  };

  const onShowConfirmDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: IStaff
  ) => {
    setStaffDelete(item);
  };

  const onClosePopupConfirmDelete = () => {
    if (!staffDelete) return;
    setStaffDelete(null);
  };

  const onYesDelete = () => {
    if (!staffDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    StaffService.delete(staffDelete?.id)
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
    console.log(fetchData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_staff_title")}</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <div className={classes.boxInputSearch}>
            <InputSearch
              autoComplete="off"
              placeholder={t("common_search")}
              value={keyword || ""}
              onChange={onSearch}
            />
          </div>
          <Button btnType={BtnType.Primary} onClick={onOpenPopupSendOffer}>
            <FontAwesomeIcon icon={faPlus} />
            {t("common_create")}
          </Button>
          <Button btnType={BtnType.Primary} onClick={onRedirectTourTransaction}>
            <TourIcon />
            {t("enterprise_management_section_staff_btn_tour")}
          </Button>
          <Button btnType={BtnType.Primary} onClick={onRedirectStayTransaction}>
            <ApartmentIcon />
            {t("enterprise_management_section_staff_btn_stay")}
          </Button>
          <Button btnType={BtnType.Outlined} onClick={onRedirectOfferStaff}>
            <ScheduleSendIcon />
            {t("enterprise_management_section_staff_btn_offer")}
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
                        {item?.username}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.address ? item?.address : ""}
                      </TableCell>{" "}
                      <TableCell className={classes.tableCell} component="th">
                        {item?.phoneNumber}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.becomeStaffDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {getRoleUser(item?.role)}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        <StatusChip status={!item.isDeleted} />
                      </TableCell>
                      <TableCell className="text-center" component="th">
                        <IconButton
                          className={clsx(classes.actionButton)}
                          color="primary"
                          onClick={(event) => {
                            onShowConfirmDelete(event, item);
                          }}
                        >
                          <DeleteOutlineOutlined
                            sx={{ marginRight: "0.25rem" }}
                            color="error"
                            fontSize="small"
                          />
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
        <PopupSendOffer
          isOpen={openPopupSendOffer}
          onClose={onOpenPopupSendOffer}
          toggle={onOpenPopupSendOffer}
          onYes={onYesDelete}
        />
        <PopupConfirmDelete
          title={t("enterprise_management_section_staff_confirm_delete")}
          isOpen={!!staffDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
      </div>
    </>
  );
});

export default Staff;
