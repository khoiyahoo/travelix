import React, { memo, useEffect, useMemo, useState } from "react";
import SectionHeader from "components/Header/SectionHeader";
import { images } from "configs/images";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { TourService } from "services/normal/tour";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import Box from "components/BoxSmallLeft";
import CustomSelect from "components/common/CustomSelect";
import { VietQR } from "vietqr";
import { ReducerType } from "redux/reducers";
import { fCurrency2VND } from "utils/formatNumber";
import { Divider } from "components/common/Divider";
import Button, { BtnType } from "components/common/buttons/Button";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import UseAuth from "hooks/useAuth";
import { TourBillService } from "services/normal/tourBill";
import PopupDefault from "components/Popup/PopupDefault";
import { Grid } from "@mui/material";

export interface BookForm {
  banks: any;
  cardName: string;
  cardNumber: string;
  issueDate: Date;
  deposit: number;
}
// eslint-disable-next-line react/display-name
const BookTour = memo(() => {
  const dispatch = useDispatch();
  const { user } = UseAuth();
  const { confirmBookTour } = useSelector((state: ReducerType) => state.normal);
  const [listBanks, setListBanks] = useState([]);
  const router = useRouter();
  const [tour, setTour] = useState<any>();
  const [modal, setModal] = useState(false);

  return (
    <>
      <Grid>
        <Container>Payment Progressing ...</Container>
      </Grid>
    </>
  );
});

export default BookTour;
