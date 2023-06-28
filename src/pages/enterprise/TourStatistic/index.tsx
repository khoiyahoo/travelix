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
import CustomSelect from "components/common/CustomSelect";
import { fCurrency2VND } from "utils/formatNumber";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { TourBillService } from "services/enterprise/tourBill";

interface ITourStatistic {
  date: Date;
  tours?: any;
}

// eslint-disable-next-line react/display-name
const TourStatistic = memo(() => {
  const dispatch = useDispatch();
  const { allTours } = useSelector((state: ReducerType) => state.enterprise);
  const [allRoomBills, setAllRoomBills] = useState([]);
  const [listRoomBills, setListRoomBills] = useState([]);
  const [tourIds, setTourIds] = useState([]);
  const [tours, setTours] = useState([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      tours: yup.object().notRequired(),
      date: yup.date().required("This field is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ITourStatistic>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      tours: tours[0],
      date: new Date(),
    },
  });

  const watchTourValue = watch("tours");

  // useEffect(() => {
  //   if (allTours) {
  //     setTourIds(
  //       allTours.map((item) => item?.id)
  //     );

  //     const newTours = [{id: 0, name: "All", value: "All"}];
  //     allTours?.map((item, index) => {newTours.push({
  //       id: item?.id,
  //       name: item?.title,
  //       value: item?.title,
  //     })
  //     })

  //     setTours(newTours);
  //     setValue("tours", tours[0]);
  //   }
  // }, [dispatch, allTours]);

  // useEffect(() => {
  //   if(watchTourValue) {
  //     if(watchTourValue.id === 0){
  //       setListRoomBills(allRoomBills);
  //     }
  //     else {
  //       const filterTour = allRoomBills.filter(item => item.tourId  === watchTourValue.id)
  //       setListRoomBills(filterTour);
  //     }
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watchTourValue])

  const _onSubmit = (data: ITourStatistic) => {
    dispatch(setLoading(true));
    TourBillService.getAllTourBillsAnyDate({
      tourIds: tourIds,
      date: data?.date,
    })
      .then((res) => {
        setListRoomBills(res?.data);
        setAllRoomBills(res?.data);
        setValue("tours", tours[0]);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>Tour booking statistics</h3>
        </Row>
        <Form
          role="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <Row className={classes.formWrapper}>
            <div className={classes.formInputWrapper}>
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
          <Row className={classes.rowSelectTour}>
            <p>Tour:</p>
            <CustomSelect
              className={classes.input}
              placeholder="Please choose tour"
              name="tours"
              control={control}
              options={tours}
              errorMessage={errors.tours?.message}
            />
          </Row>
        </Form>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row">#</th>
              <th>Tour</th>
              <th>Name</th>
              <th>Phone number</th>
              <th>Price (VND)</th>
              <th>Amout</th>
              <th>Discount</th>
              <th>Total bill (VND)</th>
              <th>Deposit (VND)</th>
            </tr>
          </thead>
          <tbody>
            {listRoomBills?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{item?.tourInfo?.title}</td>
                  <td>
                    {item?.firstName} {item?.lastName}
                  </td>
                  <td>{item?.phoneNumber}</td>
                  <td>{item?.price}</td>
                  <td>{item?.amount}</td>
                  <td>{item?.discount}%</td>
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

export default TourStatistic;
function setMessSuccess(arg0: string): any {
  throw new Error("Function not implemented.");
}
