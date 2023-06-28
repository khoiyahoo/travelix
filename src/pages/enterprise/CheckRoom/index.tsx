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
import { RoomService } from "services/enterprise/room";

interface ICheckRoom {
  hotel: any;
  startDate: Date;
  endDate: Date;
}

// eslint-disable-next-line react/display-name
const CheckRoom = memo(() => {
  const dispatch = useDispatch();
  const { allHotels } = useSelector((state: ReducerType) => state.enterprise);
  const [listRooms, setListRooms] = useState([]);
  const [listHotels, setListHotels] = useState([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      hotel: yup.object().required("This field is required"),
      startDate: yup
        .date()
        .max(yup.ref("endDate"), "Start date can't be after end date")
        .required("Start date is required"),
      endDate: yup
        .date()
        .min(yup.ref("endDate"), "End date can't be before start date")
        .required("End date is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    watch,
  } = useForm<ICheckRoom>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600 * 1000 * 24),
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

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const watchStartDate = watch("startDate");
  const disableEndDt = (current) => {
    return current.isAfter(watchStartDate);
  };

  const _onSubmit = (data: ICheckRoom) => {
    Promise.all([
      RoomService.getAllRooms(data?.hotel?.id),
      RoomService.getAllRoomsAvailable({
        hotelId: data?.hotel?.id,
        startDate: data?.startDate,
        endDate: data?.endDate,
      }),
    ]).then((res) => {
      const [rooms, roomsAvailable] = res;
      let _listRooms = [];
      roomsAvailable?.data.map((item) => {
        const roomInfo = rooms?.data?.filter((room) => room?.id === item?.id);
        if (roomInfo.length > 0) {
          _listRooms.push({
            ...item,
            totalRooms: roomInfo[0]?.numberOfRoom,
          });
        }
      });
      setListRooms(_listRooms);
    });
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>Check rooms</h3>
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
                name="startDate"
                dateFormat="DD/MM/YYYY"
                minDate={moment().toDate()}
                maxDate={watch("endDate")}
                timeFormat={false}
                labelIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                inputRef={register("startDate")}
                errorMessage={errors.startDate?.message}
                isValidDate={disablePastDt}
              />
              <InputDatePicker
                className={classes.inputSearchDate}
                label="End date"
                placeholder="End date"
                control={control}
                name="endDate"
                dateFormat="DD/MM/YYYY"
                minDate={watch("startDate") || moment().toDate()}
                timeFormat={false}
                labelIcon={<FontAwesomeIcon icon={faCalendarDays} />}
                inputRef={register("endDate")}
                errorMessage={errors.endDate?.message}
                isValidDate={disableEndDt}
              />
            </div>
            <Button className={classes.btnPrimary}>Check</Button>
          </Row>
        </Form>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row">Id</th>
              <th>Name</th>
              <th>Number of rooms available</th>
              <th>Total number of rooms</th>
            </tr>
          </thead>
          <tbody>
            {listRooms?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{item?.title}</td>
                  <td>{item?.numberOfRoom}</td>
                  <td>{item?.totalRooms}</td>
                </tr>
              );
            })}
            {!listRooms?.length && (
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

export default CheckRoom;
