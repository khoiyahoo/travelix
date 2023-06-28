import React, { useMemo, memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "hooks/useAuth";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
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
import {
  EServicePolicyType,
  EServiceType,
  OptionItem,
  policyType,
} from "models/general";
import { ReducerType } from "redux/reducers";
import { PolicyService } from "services/enterprise/policy";
import { getPolicyType } from "utils/getOption";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
// import { getPolicyType } from "utils/getOption";

export interface PolicyForm {
  policy: {
    id?: number;
    serviceType: number;
    policyType: { id: number; name: string; value: number };
    dayRange: number;
    moneyRate: number;
  }[];
}

interface Props {
  value?: number;
  index?: number;
  tour?: ETour;
}

// eslint-disable-next-line react/display-name
const PolicyComponent = memo((props: Props) => {
  const { value, index, tour } = props;
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();
  const router = useRouter();
  const { tourInformation } = useSelector(
    (state: ReducerType) => state.enterprise
  );

  const [policyItemDelete, setPolicyItemDelete] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      policy: yup.array(
        yup.object({
          id: yup.number().empty().notRequired(),
          serviceType: yup
            .number()
            .typeError(
              t(
                "enterprise_management_section_tour_tab_policy_service_type_validate"
              )
            )
            .notRequired(),
          dayRange: yup
            .number()
            .typeError(
              t(
                "enterprise_management_section_tour_tab_policy_day_range_validate"
              )
            )
            .positive(
              t(
                "enterprise_management_section_tour_tab_policy_day_range_validate_error"
              )
            )
            .required(
              t(
                "enterprise_management_section_tour_tab_policy_day_range_validate"
              )
            ),
          moneyRate: yup
            .number()
            .typeError(
              t(
                "enterprise_management_section_tour_tab_policy_money_rate_validate"
              )
            )
            .positive(
              t(
                "enterprise_management_section_tour_tab_policy_money_rate_validate_error"
              )
            )
            .min(
              0,
              t(
                "enterprise_management_section_tour_tab_policy_money_rate_validate_error_min"
              )
            )
            .max(
              100,
              t(
                "enterprise_management_section_tour_tab_policy_money_rate_validate_error_max"
              )
            )
            .required(
              t(
                "enterprise_management_section_tour_tab_policy_money_rate_validate"
              )
            ),
          policyType: yup
            .object()
            .shape({
              id: yup
                .number()
                .required(
                  t(
                    "enterprise_management_section_tour_tab_policy_policy_type_validate"
                  )
                ),
              name: yup
                .string()
                .required(
                  t(
                    "enterprise_management_section_tour_tab_policy_policy_type_validate"
                  )
                ),
              value: yup
                .number()
                .required(
                  t(
                    "enterprise_management_section_tour_tab_policy_policy_type_validate"
                  )
                ),
            })
            .required(
              t(
                "enterprise_management_section_tour_tab_policy_policy_type_validate"
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
  } = useForm<PolicyForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    fields: fieldsPolicy,
    append: appendPolicy,
    remove: removePolicy,
  } = useFieldArray({
    control,
    name: "policy",
    keyName: "fieldID",
  });

  const initPolicy = () => {
    appendPolicy({
      serviceType: EServiceType.TOUR,
      dayRange: null,
      moneyRate: null,
      policyType: policyType[0],
    });
  };
  const clearForm = () => {
    reset({
      policy: [],
    });
    initPolicy();
  };
  const onAddPolicy = () => {
    appendPolicy({
      serviceType: EServiceType.TOUR,
      dayRange: null,
      moneyRate: null,
      policyType: policyType[0],
    });
  };

  const onDeletePolicy = (policy, index) => () => {
    if (policy?.id) {
      onOpenPopupConfirmDeletePolicy(index, policy);
    } else {
      removePolicy(index);
    }
  };

  const onOpenPopupConfirmDeletePolicy = (e, itemAction) => {
    setPolicyItemDelete(itemAction);
  };

  const onClosePopupConfirmDeletePolicy = () => {
    if (!policyItemDelete) return;
    setPolicyItemDelete(null);
  };

  const onYesDeletePolicy = () => {
    if (!policyItemDelete) return;
    onClosePopupConfirmDeletePolicy();
    dispatch(setLoading(true));
    PolicyService.deletePolicy(policyItemDelete?.id)
      .then(() => {
        onGetAllPolicy();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onGetAllPolicy = () => {
    PolicyService.getAllPolicy({
      serviceType: EServiceType.TOUR,
      serviceId: tour?.id,
    })
      .then((res) => {
        if (res?.success) {
          reset({
            policy: res?.data?.map((item) => ({
              id: item?.id,
              serviceType: item?.serviceType,
              dayRange: item?.dayRange,
              moneyRate: item?.moneyRate,
              policyType: getPolicyType(item?.policyType),
            })),
          });
        }
      })
      .catch((err) => setErrorMess(err))
      .finally(() => dispatch(setLoading(false)));
  };

  const _onSubmit = (data: PolicyForm) => {
    dispatch(setLoading(true));
    PolicyService.createOrUpdatePolicy(
      data.policy.map((item) => ({
        id: item?.id,
        serviceId: tourInformation?.id ? tourInformation?.id : tour?.id,
        serviceType: EServiceType.TOUR,
        dayRange: item?.dayRange,
        moneyRate: item?.moneyRate,
        policyType: item?.policyType?.id,
      }))
    )
      .then(() => {
        dispatch(setSuccessMess(t("common_create_success")));
        router.push("/enterprises/tours");
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
      PolicyService.getAllPolicy({
        serviceType: EServiceType.TOUR,
        serviceId: tour?.id,
      })
        .then((res) => {
          if (res?.success) {
            reset({
              policy: res?.data?.map((item) => ({
                id: item?.id,
                serviceType: item?.serviceType,
                dayRange: item?.dayRange,
                moneyRate: item?.moneyRate,
                policyType: getPolicyType(item?.policyType),
              })),
            });
          }
        })
        .catch((err) => setErrorMess(err))
        .finally(() => dispatch(setLoading(false)));
    }
  }, [tour, reset]);

  useEffect(() => {
    if (!tour) {
      onAddPolicy();
    }
  }, [appendPolicy]);

  useEffect(() => {
    if (!tour) {
      clearForm();
    }
  }, [tour]);

  return (
    <Grid
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      component="form"
      onSubmit={handleSubmit(_onSubmit)}
    >
      {value === index && (
        <Grid className={classes.root}>
          <h3 className={classes.title}>
            {t("enterprise_management_section_tour_tab_policy_title_setup")}
          </h3>
          {!!fieldsPolicy?.length &&
            fieldsPolicy?.map((field, index) => (
              <Grid key={index} sx={{ paddingTop: "32px" }}>
                <Grid className={classes.boxTitleItem}>
                  <Grid className={classes.titleItem}>
                    <p>
                      {t("enterprise_management_section_tour_tab_policy_title")}{" "}
                      {index + 1}
                    </p>
                  </Grid>

                  <IconButton
                    sx={{ marginLeft: "24px" }}
                    onClick={onDeletePolicy(field, index)}
                    disabled={fieldsPolicy?.length !== 1 ? false : true}
                  >
                    <DeleteOutlineOutlined
                      sx={{ marginRight: "0.25rem" }}
                      className={classes.iconDelete}
                      color={fieldsPolicy?.length !== 1 ? "error" : "disabled"}
                      fontSize="small"
                    />
                  </IconButton>
                </Grid>
                <Grid
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  container
                >
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t(
                        "enterprise_management_section_tour_tab_policy_day_range_title"
                      )}
                      placeholder={t(
                        "enterprise_management_section_tour_tab_policy_day_range_placeholder"
                      )}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`policy.${index}.dayRange`)}
                      errorMessage={errors.policy?.[index]?.dayRange?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputTextfield
                      title={t(
                        "enterprise_management_section_tour_tab_policy_money_rate_title"
                      )}
                      placeholder={t(
                        "enterprise_management_section_tour_tab_policy_money_rate_placeholder"
                      )}
                      autoComplete="off"
                      type="number"
                      inputRef={register(`policy.${index}.moneyRate`)}
                      errorMessage={errors.policy?.[index]?.moneyRate?.message}
                    />
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <InputSelect
                      fullWidth
                      title={t(
                        "enterprise_management_section_tour_tab_policy_policy_type_title"
                      )}
                      name={`policy.${index}.policyType`}
                      control={control}
                      selectProps={{
                        options: policyType,
                        placeholder: t(
                          "enterprise_management_section_tour_tab_policy_policy_type_placeholder"
                        ),
                      }}
                      errorMessage={errors.policy?.[index]?.policyType?.message}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}
          <Grid className={classes.boxAddDay}>
            <Button btnType={BtnType.Outlined} onClick={onAddPolicy}>
              <AddCircleIcon />
              {t("enterprise_management_section_tour_tab_policy_add_policy")}
            </Button>
          </Grid>
          <Grid className={classes.boxNextBtn}>
            <Button btnType={BtnType.Primary} type="submit">
              {t("enterprise_management_section_tour_tab_policy_done")}
              <ArrowRightAltIcon />
            </Button>
          </Grid>
        </Grid>
      )}
      <PopupConfirmDelete
        title={t(
          "enterprise_management_section_tour_tab_policy_confirm_delete_policy"
        )}
        isOpen={!!policyItemDelete}
        onClose={onClosePopupConfirmDeletePolicy}
        toggle={onClosePopupConfirmDeletePolicy}
        onYes={onYesDeletePolicy}
      />
    </Grid>
  );
});

export default PolicyComponent;
