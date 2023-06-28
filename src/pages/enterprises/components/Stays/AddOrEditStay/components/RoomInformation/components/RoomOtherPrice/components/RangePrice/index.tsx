import React, { useMemo, memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { Grid, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button, { BtnType } from "components/common/buttons/Button";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import moment from "moment";
import InputTextfield from "components/common/inputs/InputTextfield";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { ReducerType } from "redux/reducers";
import { useTranslation } from "react-i18next";
import { RoomOtherPriceService } from "services/enterprise/roomOtherPrice";
import { Room } from "models/enterprise/room";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";

export interface SaleForm {
  sale: {
    id?: number;
    date: Date;
    price: number;
  }[];
}

interface Props {
  room?: Room;
  lang?: string;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const RangePriceComponent = memo((props: Props) => {
  const { room, lang, handleNextStep } = props;
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();
  const { stayInformation } = useSelector(
    (state: ReducerType) => state.enterprise
  );

  const [priceItemDelete, setPriceItemDelete] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      sale: yup.array(
        yup.object({
          id: yup.number().empty().notRequired(),
          date: yup
            .date()
            .required(
              t(
                "enterprise_management_section_tour_tab_range_price_start_date_validate"
              )
            ),
          price: yup
            .number()
            .typeError(
              t(
                "enterprise_management_section_tour_tab_range_price_quantity_validate"
              )
            )
            .positive(
              t(
                "enterprise_management_section_tour_tab_range_price_quantity_validate_error"
              )
            )
            .required(
              t(
                "enterprise_management_section_tour_tab_range_price_quantity_validate"
              )
            ),
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
      date: null,
      price: null,
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
      date: null,
      price: null,
    });
  };

  const _onSubmit = (data: SaleForm) => {
    dispatch(setLoading(true));
    RoomOtherPriceService.createOrUpdate(
      data.sale.map((item) => ({
        roomId: room?.id,
        id: item?.id,
        date: item?.date,
        price: item?.price,
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

  const onDelete = (item, index) => () => {
    if (item?.id) {
      onOpenPopupConfirmDelete(index, item);
    } else {
      removeSale(index);
    }
  };

  const onClosePopupConfirmDelete = () => {
    if (!priceItemDelete) return;
    setPriceItemDelete(null);
  };

  const onYesDeletePrice = () => {
    if (!priceItemDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    RoomOtherPriceService.delete(priceItemDelete?.id)
      .then(() => {
        dispatch(setSuccessMess(t("common_delete_success")));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onOpenPopupConfirmDelete = (e, itemAction) => {
    setPriceItemDelete(itemAction);
  };

  useEffect(() => {
    if (room) {
      RoomOtherPriceService.findAll(room?.id)
        .then((res) => {
          if (res.success) {
            reset({
              sale: res.data?.map((item) => ({
                id: item.id,
                price: item.price,
                date: new Date(item.date),
              })),
            });
          }
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => dispatch(setLoading(false)));
    }
  }, [room]);

  useEffect(() => {
    if (!room) {
      onAddSale();
    }
  }, [appendSale]);

  useEffect(() => {
    if (!room) {
      clearForm();
    }
  }, [room]);

  return (
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
      <Grid className={classes.root}>
        {!!fieldsSale?.length &&
          fieldsSale?.map((field, index) => (
            <Grid key={index} sx={{ paddingTop: "32px" }}>
              <Grid className={classes.boxTitleItem}>
                <Grid className={classes.titleItem}>
                  <p>
                    {t(
                      "enterprise_management_section_tour_tab_range_price_available"
                    )}{" "}
                    {index + 1}
                  </p>
                </Grid>

                <IconButton
                  sx={{ marginLeft: "24px" }}
                  onClick={onDelete(field, index)}
                  disabled={fieldsSale?.length !== 1 ? false : true}
                >
                  <DeleteOutlineOutlined
                    sx={{ marginRight: "0.25rem" }}
                    className={classes.iconDelete}
                    color={fieldsSale?.length !== 1 ? "error" : "disabled"}
                    fontSize="small"
                  />
                </IconButton>
              </Grid>
              <Grid
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                container
              >
                <Grid xs={2} sm={4} md={4} item>
                  <InputDatePicker
                    name={`sale.${index}.date`}
                    control={control}
                    label={t(
                      "enterprise_management_section_tour_tab_range_price_date_title"
                    )}
                    placeholder={t(
                      "enterprise_management_section_tour_tab_range_price_date_title"
                    )}
                    closeOnSelect={true}
                    timeFormat={false}
                    errorMessage={errors.sale?.[index]?.date?.message}
                    isValidDate={disablePastDt}
                  />
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                  <InputTextfield
                    title={t(
                      "enterprise_management_section_stay_header_table_room_other_price_price"
                    )}
                    placeholder={t(
                      "enterprise_management_section_stay_header_table_room_other_price_price"
                    )}
                    autoComplete="off"
                    type="number"
                    inputRef={register(`sale.${index}.price`)}
                    errorMessage={errors.sale?.[index]?.price?.message}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
        <Grid className={classes.boxAddDay}>
          <Button btnType={BtnType.Outlined} onClick={onAddSale}>
            <AddCircleIcon />{" "}
            {t("enterprise_management_section_tour_tab_range_price_add")}
          </Button>
        </Grid>
        <Grid className={classes.boxNextBtn}>
          <Button btnType={BtnType.Primary} type="submit">
            {t("enterprise_management_section_tour_tab_range_price_next")}
            <ArrowRightAltIcon />
          </Button>
        </Grid>
      </Grid>
      <PopupConfirmDelete
        title={"Are you sure delete this price"}
        isOpen={!!priceItemDelete}
        onClose={onClosePopupConfirmDelete}
        toggle={onClosePopupConfirmDelete}
        onYes={onYesDeletePrice}
      />
    </Grid>
  );
});

export default RangePriceComponent;
