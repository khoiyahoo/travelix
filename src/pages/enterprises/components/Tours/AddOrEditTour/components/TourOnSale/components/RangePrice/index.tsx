import React, { useMemo, memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { ETour } from "models/enterprise";
import "react-quill/dist/quill.snow.css";
import { Grid, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button, { BtnType } from "components/common/buttons/Button";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import moment from "moment";
import InputTextfield from "components/common/inputs/InputTextfield";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InputSelect from "components/common/inputs/InputSelect";
import { currencyType } from "models/general";

import { ReducerType } from "redux/reducers";
import { TourOnSaleService } from "services/enterprise/tourOnSale";
import { getCurrency } from "utils/getOption";
import { useTranslation } from "react-i18next";

export interface SaleForm {
  sale: {
    id?: number;
    startDate: Date;
    quantity: number;
    quantityOrdered: number;
    discount?: number;
    childrenAgeMin: number;
    childrenAgeMax: number;
    childrenPrice: number;
    adultPrice: number;
    currency?: {
      id?: number;
      name?: string;
      value?: string;
    };
  }[];
}

interface Props {
  tour?: ETour;
  lang?: string;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const RangePriceComponent = memo((props: Props) => {
  const { tour, lang, handleNextStep } = props;
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();
  const { tourInformation } = useSelector((state: ReducerType) => state.enterprise);

  const schema = useMemo(() => {
    return yup.object().shape({
      sale: yup.array(
        yup.object({
          id: yup.number().empty().notRequired(),
          startDate: yup.date().required(t("enterprise_management_section_tour_tab_range_price_start_date_validate")),
          quantity: yup
            .number()
            .typeError(t("enterprise_management_section_tour_tab_range_price_quantity_validate"))
            .positive(t("enterprise_management_section_tour_tab_range_price_quantity_validate_error"))
            .min(yup.ref("quantityOrdered"), t("enterprise_management_section_tour_tab_range_price_quantity_validate_error_min"))
            .required(t("enterprise_management_section_tour_tab_range_price_quantity_validate")),
          discount: yup
            .number()
            .positive(t("enterprise_management_section_tour_tab_range_price_discount_validate"))
            .transform((value) => (isNaN(value) ? undefined : value))
            .notRequired(),
          childrenAgeMin: yup
            .number()
            .typeError(t("enterprise_management_section_tour_tab_range_price_children_age_min_validate"))
            .positive(t("enterprise_management_section_tour_tab_range_price_children_age_min_validate_error"))
            .required(t("enterprise_management_section_tour_tab_range_price_children_age_min_validate")),
          childrenAgeMax: yup
            .number()
            .typeError(t("enterprise_management_section_tour_tab_range_price_children_age_max_validate"))
            .positive(t("enterprise_management_section_tour_tab_range_price_children_age_max_validate_error"))
            .min(yup.ref("childrenAgeMin"), t("enterprise_management_section_tour_tab_range_price_children_age_max_validate_error_max"))
            .required(t("enterprise_management_section_tour_tab_range_price_children_age_max_validate")),
          childrenPrice: yup
            .number()
            .typeError(t("enterprise_management_section_tour_tab_range_price_children_price"))
            .positive(t("enterprise_management_section_tour_tab_range_price_children_price_error"))
            .required(t("enterprise_management_section_tour_tab_range_price_children_price")),
          adultPrice: yup
            .number()
            .typeError(t("enterprise_management_section_tour_tab_range_price_adult_price"))
            .positive(t("enterprise_management_section_tour_tab_range_price_adult_price_error"))
            .required(t("enterprise_management_section_tour_tab_range_price_adult_price")),
          currency: yup
            .object()
            .shape({
              id: yup.number().required(t("enterprise_management_section_tour_tab_range_price_currency")),
              name: yup.string().required(t("enterprise_management_section_tour_tab_range_price_currency")),
              value: yup.string().required(t("enterprise_management_section_tour_tab_range_price_currency")),
            })
            .required(),
        })
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<SaleForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };
  const {
    fields: fieldsSale,
    append: appendSale,
    remove: removeSale,
  } = useFieldArray({
    control,
    name: "sale",
    keyName: "fieldID",
  });

  const initSale = () => {
    appendSale({
      startDate: null,
      quantity: null,
      quantityOrdered: null,
      discount: null,
      childrenAgeMin: null,
      childrenAgeMax: null,
      childrenPrice: null,
      adultPrice: null,
      currency: { id: 1, name: "VND", value: "vi" },
    });
  };
  const clearForm = () => {
    reset({
      sale: [],
    });
    initSale();
  };
  const onAddSale = () => {
    appendSale({
      startDate: null,
      quantity: null,
      quantityOrdered: null,
      discount: null,
      childrenAgeMin: null,
      childrenAgeMax: null,
      childrenPrice: null,
      adultPrice: null,
      currency: { id: 1, name: "VND", value: "vi" },
    });
  };
  const onDeleteSale = (index) => () => {
    removeSale(index);
  };

  const _onSubmit = (data: SaleForm) => {
    dispatch(setLoading(true));
    TourOnSaleService.createOrUpdatePriceTour(
      data.sale.map((item) => ({
        tourId: tourInformation?.id ? tourInformation?.id : tour?.id,
        id: item?.id,
        discount: item?.discount === undefined ? 0 : item?.discount,
        quantity: item?.quantity,
        startDate: item?.startDate,
        childrenAgeMin: item?.childrenAgeMin,
        childrenAgeMax: item?.childrenAgeMax,
        childrenPrice: item?.childrenPrice,
        adultPrice: item?.adultPrice,
        currency: item?.currency?.value,
      }))
    )
      .then(() => {
        dispatch(setSuccessMess(t("common_create_success")));
        handleNextStep();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    if (tour) {
      TourOnSaleService.findAll(tour?.id)
        .then((res) => {
          if (res.success) {
            reset({
              sale: res.data?.map((item) => ({
                id: item.id,
                discount: item.discount,
                quantity: item.quantity,
                quantityOrdered: item.quantityOrdered,
                startDate: new Date(item.startDate),
                childrenAgeMin: item.childrenAgeMin,
                childrenAgeMax: item.childrenAgeMax,
                childrenPrice: item.childrenPrice,
                adultPrice: item.adultPrice,
                currency: getCurrency(item?.currency),
              })),
            });
          }
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => dispatch(setLoading(false)));
    }
  }, [tour]);

  useEffect(() => {
    if (!tour) {
      onAddSale();
    }
  }, [appendSale]);

  useEffect(() => {
    if (!tour) {
      clearForm();
    }
  }, [tour]);

  return (
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
      <Grid className={classes.root}>
        {!!fieldsSale?.length &&
          fieldsSale?.map((field, index) => {
            return (
              <Grid key={index} sx={{ paddingTop: "32px" }}>
                <Grid className={classes.boxTitleItem}>
                  <Grid className={classes.titleItem}>
                    <p>
                      {t("enterprise_management_section_tour_tab_range_price_available")} {index + 1}
                    </p>
                  </Grid>

                  <IconButton sx={{ marginLeft: "24px" }} onClick={onDeleteSale(index)} disabled={fieldsSale?.length !== 1 ? false : true}>
                    <DeleteOutlineOutlined
                      sx={{ marginRight: "0.25rem" }}
                      className={classes.iconDelete}
                      color={fieldsSale?.length !== 1 ? "error" : "disabled"}
                      fontSize="small"
                    />
                  </IconButton>
                </Grid>
                {!!field.quantityOrdered && (
                  <Grid>
                    <p style={{ fontWeight: 700, marginBottom: "8px" }}>
                      {t("enterprise_management_section_tour_tab_range_price_not_edit_title")}
                    </p>
                  </Grid>
                )}
                <Grid spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} container>
                  <Grid xs={2} sm={4} md={4} item>
                    <InputDatePicker
                      name={`sale.${index}.startDate`}
                      control={control}
                      label={t("enterprise_management_section_tour_tab_range_price_date_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_date_title")}
                      closeOnSelect={true}
                      timeFormat={false}
                      errorMessage={errors.sale?.[index]?.startDate?.message}
                      isValidDate={field.quantityOrdered ? () => moment() === moment(field.startDate) : disablePastDt}
                    />
                  </Grid>
                  <Grid xs={2} sm={4} md={4} item className="d-flex align-items-end">
                    <p style={{ fontWeight: 700, marginBottom: "8px" }}>
                      {t("enterprise_management_section_tour_tab_range_price_quantity_ordered_title")}: {field.quantityOrdered || 0}
                    </p>
                  </Grid>
                  <Grid xs={2} sm={4} md={4} item sx={{ visibility: "hidden" }}>
                    <InputSelect
                      fullWidth
                      title={t("enterprise_management_section_tour_tab_range_price_currency_title")}
                      name={`sale.${index}.currency`}
                      control={control}
                      selectProps={{
                        options: currencyType,
                        placeholder: t("enterprise_management_section_tour_tab_range_price_currency_placeholder"),
                      }}
                      errorMessage={errors.sale?.[index]?.currency?.message}
                    />
                  </Grid>
                  {/* <Grid item xs={2} sm={4} md={4}></Grid> */}
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t("enterprise_management_section_tour_tab_range_price_quantity_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_quantity_title")}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`sale.${index}.quantity`)}
                      errorMessage={errors.sale?.[index]?.quantity?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t("enterprise_management_section_tour_tab_range_price_discount_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_discount_placeholder")}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`sale.${index}.discount`)}
                      errorMessage={errors.sale?.[index]?.discount?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t("enterprise_management_section_tour_tab_range_price_price_of_adult_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_price_of_adult_title")}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`sale.${index}.adultPrice`)}
                      errorMessage={errors.sale?.[index]?.adultPrice?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t("enterprise_management_section_tour_tab_range_price_children_age_min_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_children_age_min_title")}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`sale.${index}.childrenAgeMin`)}
                      errorMessage={errors.sale?.[index]?.childrenAgeMin?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t("enterprise_management_section_tour_tab_range_price_children_age_max_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_children_age_max_title")}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`sale.${index}.childrenAgeMax`)}
                      errorMessage={errors.sale?.[index]?.childrenAgeMax?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t("enterprise_management_section_tour_tab_range_price_price_of_children_title")}
                      placeholder={t("enterprise_management_section_tour_tab_range_price_price_of_children_title")}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`sale.${index}.childrenPrice`)}
                      errorMessage={errors.sale?.[index]?.childrenPrice?.message}
                    />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        <Grid className={classes.boxAddDay}>
          <Button btnType={BtnType.Outlined} onClick={onAddSale}>
            <AddCircleIcon /> {t("enterprise_management_section_tour_tab_range_price_add")}
          </Button>
        </Grid>
        <Grid className={classes.boxNextBtn}>
          <Button btnType={BtnType.Primary} type="submit">
            {t("enterprise_management_section_tour_tab_range_price_next")}
            <ArrowRightAltIcon />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default RangePriceComponent;
