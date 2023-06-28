import React, {memo} from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import {Row} from "reactstrap";
import FeatureSaleInformation from "../../../components/FeatureSaleInformation";
import Chart from "../../../components/Charts";

export const productData = [
    {
      name: "Jan",
      "Sales": 4000,
    },
    {
      name: "Feb",
      "Sales": 3000,
    },
    {
      name: "Mar",
      "Sales": 5000,
    },
  ];
// eslint-disable-next-line react/display-name
const Sales = memo(()=> {
   return (
    <>
       <div className={classes.root}>
            <Row className={clsx(classes.rowHeaderBox, classes.title)}>
                 <h3>Sales</h3>
            </Row>
            <FeatureSaleInformation/>
            <Chart data={productData} dataKey="Sales" title="Sales Performance"/>
       </div>
    </>
  );
})

export default Sales
;
