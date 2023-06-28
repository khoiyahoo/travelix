import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Button, Row, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import moment from "moment";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "components/common/CustomSelect";
import { RoomBillService } from "services/enterprise/roomBill";
import DownloadRevenue from "./DownloadRevenue";

interface IHotelSelection {
  revenueType?: any;
  monthValue?: Date;
  yearValue?: Date;
}

// eslint-disable-next-line react/display-name
const HotelsRevenue = memo(() => {
  const dispatch = useDispatch();
  const { allHotels } = useSelector((state: ReducerType) => state.enterprise);
  const [hotelIds, setHotelIds] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [modalDownloadRevenue, setModalDownloadRevenue] = useState({
    isOpenModal: false,
    revenue: [],
    revenueType: null,
    monthOrYearValue: null,
  });

  const revenueType = [
    { id: 1, name: "Revenue of a month", value: "Revenue of a month" },
    { id: 2, name: "Revenue of a year", value: "Revenue of a year" },
  ];

  const schema = useMemo(() => {
    return yup.object().shape({
      revenueType: yup.object().required("This field is required"),
      monthValue: yup.date().notRequired(),
      yearValue: yup.date().notRequired(),
    });
  }, []);

  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IHotelSelection>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      monthValue: new Date(),
      revenueType: revenueType[0],
    },
  });

  const watchMonthValue = watch("monthValue");
  const watchYearValue = watch("yearValue");
  const watchRevenueType = watch("revenueType");

  // useEffect(() => {
  //   if (allHotels) {
  //     const tempHotelIds = allHotels.map((hotel) => hotel?.id);
  //     setHotelIds(tempHotelIds);
  //     setValue("monthValue", new Date());
  //   }
  // }, [allHotels]);

  // useEffect(() => {
  //   if (watchMonthValue) {
  //     const month = new Date(watchMonthValue).getMonth();
  //     const year = new Date(watchMonthValue).getFullYear();
  //     RoomBillService.getRevenueOfHotelsByMonth({
  //       hotelIds: hotelIds,
  //       month: month,
  //       year: year,
  //     }).then((revenue) => {
  //       const numberDaysOfMonth = get_day_of_month(year, month + 1);
  //       const temprevenueData = [];
  //       revenue?.data?.forEach((element) => {
  //         const costArr = [];
  //         for (let i = 1; i <= numberDaysOfMonth; i++) {
  //           const cost = element?.filter((item) => item?.date === i);
  //           if (cost.length > 0) {
  //             costArr.push(cost[0]?.cost);
  //           } else {
  //             costArr.push(0);
  //           }
  //         }
  //         temprevenueData.push(costArr);
  //       });
  //       setRevenueData(temprevenueData);
  //     });
  //   }
  // }, [watchMonthValue]);

  // useEffect(() => {
  //   if (watchYearValue) {
  //     const year = new Date(watchYearValue).getFullYear();
  //     RoomBillService.getRevenueOfHotelsByYear({
  //       hotelIds: hotelIds,
  //       year: year,
  //     }).then((revenue) => {
  //       const temprevenueData = [];
  //       revenue?.data?.forEach((element) => {
  //         const costArr = [];
  //         for (let i = 0; i < 12; i++) {
  //           const cost = element?.filter((item) => item?.month === i);
  //           if (cost.length > 0) {
  //             costArr.push(cost[0]?.cost);
  //           } else {
  //             costArr.push(0);
  //           }
  //         }
  //         temprevenueData.push(costArr);
  //       });
  //       setRevenueData(temprevenueData);
  //     });
  //   }
  // }, [watchYearValue]);

  // useEffect(() => {
  //   if (watchRevenueType) {
  //     if (watchRevenueType?.id == 1) {
  //       setValue("monthValue", new Date());
  //     } else {
  //       setValue("yearValue", new Date());
  //     }
  //   }
  // }, [watchRevenueType]);

  // Calculate number of days in month
  const get_day_of_month = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const handleSumArray = (array) => {
    let result = 0;
    array.forEach((item) => {
      result += item;
    });
    return result;
  };

  const handleDownloadRevenue = () => {
    let _revenueData = [];
    if (watchRevenueType?.id === 1) {
      revenueData.map((itemRevenue) => {
        const week1 = itemRevenue.slice(0, 7);
        const week2 = itemRevenue.slice(7, 14);
        const week3 = itemRevenue.slice(14, 21);
        const week4 = itemRevenue.slice(21, 28);
        let tempRevenue = [
          {
            date: "1 - 7",
            revenue: handleSumArray(week1),
          },
          {
            date: "8 - 14",
            revenue: handleSumArray(week2),
          },
          {
            date: "15 - 21",
            revenue: handleSumArray(week3),
          },
          {
            date: "22 - 28",
            revenue: handleSumArray(week4),
          },
        ];

        if (itemRevenue.length > 28) {
          const week5 = itemRevenue.slice(28);
          tempRevenue.push({
            date: `28 - ${itemRevenue.length}`,
            revenue: handleSumArray(week5),
          });
        }
        _revenueData.push(tempRevenue);
      });
    }
    setModalDownloadRevenue({
      isOpenModal: true,
      revenue: watchRevenueType?.id === 1 ? _revenueData : revenueData,
      revenueType: watchRevenueType?.id,
      monthOrYearValue:
        watchRevenueType?.id === 1
          ? new Date(watchMonthValue)?.getMonth()
          : new Date(watchYearValue)?.getFullYear(),
    });
  };

  const onCloseModalDownloadRevenue = () => {
    setModalDownloadRevenue({
      isOpenModal: false,
      revenue: [],
      revenueType: null,
      monthOrYearValue: null,
    });
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>Revenue of hotels</h3>
        </Row>
        <Row className="mb-3">
          <div className={classes.inputContainer}>
            <p className={classes.inputTitle}>Type of revenue:</p>
            <CustomSelect
              className={classes.input}
              placeholder="Please choose the type of revenue"
              name="revenueType"
              control={control}
              options={revenueType}
              errorMessage={errors.revenueType?.message}
            />
            <p className={classes.inputTitle}>Unit: VND</p>
          </div>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          {watchRevenueType?.id === 1 && (
            <InputDatePicker
              className={classes.inputSearchDate}
              label="Month"
              placeholder="Month"
              control={control}
              name="monthValue"
              minDate={moment().toDate()}
              dateFormat="YYYY-MM"
              timeFormat={false}
              labelIcon={<FontAwesomeIcon icon={faCalendarDays} />}
              inputRef={register("monthValue")}
              errorMessage={errors.monthValue?.message}
            />
          )}
          {watchRevenueType?.id === 2 && (
            <InputDatePicker
              className={classes.inputSearchDate}
              label="Year"
              placeholder="Year"
              control={control}
              name="yearValue"
              minDate={moment().toDate()}
              dateFormat="YYYY"
              timeFormat={false}
              labelIcon={<FontAwesomeIcon icon={faCalendarDays} />}
              inputRef={register("yearValue")}
              errorMessage={errors.yearValue?.message}
            />
          )}
          <Button
            className="m-0"
            color="primary"
            onClick={() => handleDownloadRevenue()}
          >
            Download revenue
          </Button>
        </Row>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row">#</th>
              <th>Name</th>
              {revenueData.length > 0 &&
                revenueData[0]?.map((item, index) => (
                  <th key={index} className="text-center">
                    {index + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {allHotels?.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>{item?.name}</td>
                  {revenueData[index]?.map((item) => (
                    <th key={index} className="text-center">
                      {Math.floor(item)}
                    </th>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <DownloadRevenue
        onClose={onCloseModalDownloadRevenue}
        isOpen={modalDownloadRevenue.isOpenModal}
        revenue={modalDownloadRevenue.revenue}
        revenueType={modalDownloadRevenue.revenueType}
        monthOrYearValue={modalDownloadRevenue.monthOrYearValue}
      />
    </>
  );
});

export default HotelsRevenue;
function setMessSuccess(arg0: string): any {
  throw new Error("Function not implemented.");
}
