import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Row, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import SearchNotFound from "components/SearchNotFound";
import { ReducerType } from "redux/reducers";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import moment from "moment";
import CustomSelect from "components/common/CustomSelect";
import { fCurrency2VND } from "utils/formatNumber";
import { RoomBillService } from "services/enterprise/roomBill";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";

interface IHotelStatistic {
  hotel: any;
  date: Date;
}

// eslint-disable-next-line react/display-name
const HotelStatistic = memo(() => {
  const dispatch = useDispatch();
  const { allHotels } = useSelector((state: ReducerType) => state.enterprise);
  const [listRoomBills, setListRoomBills] = useState([]);
  const [listHotels, setListHotels] = useState([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      hotel: yup.object().required("This field is required"),
      date: yup.date().required("This field is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IHotelStatistic>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      date: new Date(),
    },
  });

  // useEffect(() => {
  //   if (allHotels) {
  //     setListHotels(
  //       allHotels.map((item) => {
  //         return {
  //           id: item?.id,
  //           name: item?.name,
  //         };
  //       })
  //     );
  //   }
  // }, [dispatch, allHotels]);

  const _onSubmit = (data: IHotelStatistic) => {
    dispatch(setLoading(true));
    RoomBillService.getAllRoomBillsAnyDate({
      hotelId: data?.hotel?.id,
      date: data?.date,
    })
      .then((res) => {
        setListRoomBills(res?.data);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  // const getRoomsTitle = (roomBillDetail) => {
  //   let rooms = "";
  //   let roomBillDetailIds = [];
  //   roomBillDetail.map((item) => {
  //     if (!roomBillDetailIds.includes(item?.roomId)) {
  //       rooms += `${item?.title}, `;
  //       roomBillDetailIds.push(item?.roomId);
  //     }
  //   });
  //   return rooms.slice(0, -2);
  // };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>Hotel booking statistics</h3>
        </Row>
        <Form
          role="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <Row className={classes.formWrapper}>
            <div className={classes.formInputWrapper}>
              <div>
                <p className={classes.inputTitle}>Hotel:</p>
                <CustomSelect
                  className={classes.input}
                  placeholder="Please choose the hotel"
                  name="hotel"
                  control={control}
                  options={listHotels}
                  errorMessage={errors.hotel?.message}
                />
              </div>
              <InputDatePicker
                className={classes.inputSearchDate}
                label="Start date"
                placeholder="Start date"
                control={control}
                name="date"
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                labelIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                inputRef={register("date")}
                errorMessage={errors.date?.message}
              />
            </div>
            <Button className={classes.btnPrimary}>Check</Button>
          </Row>
        </Form>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row">#</th>
              <th>Rooms</th>
              <th>Name</th>
              <th>Phone number</th>
              <th>Check in date</th>
              <th>Check out date</th>
              <th>Total bill (VND)</th>
              <th>Deposit (VND)</th>
            </tr>
          </thead>
          <tbody>
            {listRoomBills?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  {/* <td>{getRoomsTitle(item?.roomBillDetail)}</td> */}
                  <td>
                    {item?.firstName} {item?.lastName}
                  </td>
                  <td>{item?.phoneNumber}</td>
                  <td>{moment(item?.startDate).format("DD/MM/YYYY")}</td>
                  <td>{moment(item?.endDate).format("DD/MM/YYYY")}</td>
                  <td>{fCurrency2VND(item?.totalBill)}</td>
                  <td>{fCurrency2VND(item?.deposit)}</td>
                </tr>
              );
            })}
            {!listRoomBills?.length && (
              <tr>
                <td scope="row" colSpan={5}>
                  <SearchNotFound />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
});

export default HotelStatistic;
function setMessSuccess(arg0: string): any {
  throw new Error("Function not implemented.");
}
