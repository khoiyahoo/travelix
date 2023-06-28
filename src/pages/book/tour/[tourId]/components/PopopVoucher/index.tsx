import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classes from "./styles.module.scss";
import { GetVoucherValue, Voucher } from "models/voucher";
import { Grid } from "@mui/material";
import { EDiscountType } from "models/general";
import { fCurrency2VND, fPercent, fShortenNumber } from "utils/formatNumber";
import moment from "moment";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { BtnType } from "components/common/buttons/Button";
import clsx from "clsx";
import ErrorMessage from "components/common/texts/ErrorMessage";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen?: boolean;
  toggle?: () => void;
  voucher: Voucher[];
  totalBill?: number;
  onGetVoucher?: (data: GetVoucherValue) => void;
}

interface VoucherForm {
  voucherValue: number;
  discountType: number;
  minOrder: number;
}

// eslint-disable-next-line react/display-name
const PopupVoucher = memo((props: Props) => {
  const { isOpen, toggle, voucher, totalBill, onGetVoucher } = props;
  const { t, i18n } = useTranslation("common");

  const [isError, setIsError] = useState(false);
  const [dataError, setDataError] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      voucherValue: yup.number().required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const { control, setValue, handleSubmit } = useForm<VoucherForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data: VoucherForm) => {
    if (totalBill < data?.minOrder) {
      setIsError(true);
      setDataError(data?.minOrder);
    } else {
      onGetVoucher(data);
      toggle();
    }
  };

  const handleValidVoucher = (startTime) => {
    var bookDate = new Date();
    let isValid = false;
    if (bookDate < new Date(startTime)) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid;
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle}>
        <Grid component={"form"} onSubmit={handleSubmit(_onSubmit)}>
          <ModalHeader toggle={toggle} className={classes.titleHeader}>
            <p>{t("popup_choose_voucher_title")}</p>
          </ModalHeader>
          <ModalBody className={classes.body}>
            <span>{t("popup_choose_voucher_sub_title")}</span>
            <Grid className={classes.boxVoucher}>
              {voucher?.length ? (
                voucher?.map((item, index) => (
                  <>
                    {item?.discountType === EDiscountType.PERCENT ? (
                      <Grid
                        className={clsx(classes.boxVoucherItem, {
                          [classes.boxVoucherItemInValid]: handleValidVoucher(
                            item?.startTime
                          ),
                        })}
                      >
                        <Grid sx={{ display: "flex", flexDirection: "column" }}>
                          <span>
                            {t("voucher_title_deal")}{" "}
                            {fPercent(item?.discountValue)}
                          </span>
                          {item?.maxDiscount !== 0 && (
                            <span>
                              {t("voucher_title_max")}:{" "}
                              {fCurrency2VND(item?.maxDiscount)} VND
                            </span>
                          )}
                          {item?.minOrder && (
                            <span>
                              {t("popup_choose_voucher_apply_order_minimum")}:{" "}
                              {fCurrency2VND(item?.minOrder)} VND
                            </span>
                          )}
                          <span>
                            {t("popup_choose_voucher_period")}:{" "}
                            {moment(item?.startTime).format("DD/MM/YYYY")} -{" "}
                            {moment(item?.endTime).format("DD/MM/YYYY")}
                          </span>
                        </Grid>
                        <Controller
                          name="voucherValue"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Grid sx={{ paddingRight: "14px" }}>
                                <InputCheckbox
                                  checked={
                                    item?.maxDiscount === 0
                                      ? field.value === item?.discountValue
                                      : field.value === item?.maxDiscount
                                  }
                                  onChange={() => {
                                    item?.maxDiscount === 0
                                      ? setValue(
                                          "voucherValue",
                                          item?.discountValue
                                        )
                                      : setValue(
                                          "voucherValue",
                                          item?.maxDiscount
                                        );
                                    setValue(
                                      "discountType",
                                      item?.discountType
                                    );
                                    item?.minOrder !== 0
                                      ? setValue("minOrder", item?.minOrder)
                                      : setValue("minOrder", 0);
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid
                        className={clsx(classes.boxVoucherItem, {
                          [classes.boxVoucherItemInValid]: handleValidVoucher(
                            item?.startTime
                          ),
                        })}
                      >
                        <Grid
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            fontWeight: "500px",
                          }}
                        >
                          <span>
                            {t("voucher_title_deal")}{" "}
                            {fShortenNumber(item?.discountValue)} VND
                          </span>
                          {item?.maxDiscount !== 0 && (
                            <span>
                              {t("voucher_title_max")}:{" "}
                              {fCurrency2VND(item?.maxDiscount)} VND
                            </span>
                          )}
                          {item?.minOrder && (
                            <span>
                              {t("popup_choose_voucher_apply_order_minimum")}:{" "}
                              {fCurrency2VND(item?.minOrder)} VND
                            </span>
                          )}
                          <span>
                            {t("popup_choose_voucher_period")}:{" "}
                            {moment(item?.startTime).format("DD/MM/YYYY")} -{" "}
                            {moment(item?.endTime).format("DD/MM/YYYY")}
                          </span>
                        </Grid>
                        <Controller
                          name="voucherValue"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Grid sx={{ paddingRight: "14px" }}>
                                <InputCheckbox
                                  checked={
                                    item?.maxDiscount === 0
                                      ? field.value === item?.discountValue
                                      : field.value === item?.maxDiscount
                                  }
                                  onChange={() => {
                                    item?.maxDiscount === 0
                                      ? setValue(
                                          "voucherValue",
                                          item?.discountValue
                                        )
                                      : setValue(
                                          "voucherValue",
                                          item?.maxDiscount
                                        );
                                    setValue(
                                      "discountType",
                                      item?.discountType
                                    );
                                    item?.minOrder !== 0
                                      ? setValue("minOrder", item?.minOrder)
                                      : setValue("minOrder", 0);
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                        />
                      </Grid>
                    )}
                  </>
                ))
              ) : (
                <p style={{ fontWeight: "600" }}>
                  {t("popup_choose_voucher_no_voucher")}
                </p>
              )}
            </Grid>
            {isError && (
              <ErrorMessage>
                {t("book_page_section_price_detail_use_coupon_error")}{" "}
                {fCurrency2VND(dataError)} VND
              </ErrorMessage>
            )}
          </ModalBody>
          <ModalFooter className={classes.footer}>
            <Button
              btnType={BtnType.Primary}
              type="submit"
              className={classes.btnDone}
            >
              {t("common_apply")}
            </Button>
          </ModalFooter>
        </Grid>
      </Modal>
    </>
  );
});

export default PopupVoucher;
