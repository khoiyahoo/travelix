import React, { useMemo, memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";

import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";

import "react-quill/dist/quill.snow.css";
import { Grid } from "@mui/material";

import Button, { BtnType } from "components/common/buttons/Button";

import InputTextfield from "components/common/inputs/InputTextfield";

import InputSelect from "components/common/inputs/InputSelect";
import { serviceType } from "models/general";

import { getServiceType } from "utils/getOption";

import { useRouter } from "next/router";
import { Container } from "reactstrap";
import clsx from "clsx";
import { CommissionService } from "services/admin/commission";
import { Commission } from "models/admin/commission";
import { useTranslation } from "react-i18next";
// import { getPolicyType } from "utils/getOption";

export interface CommissionForm {
  serviceType: { id: number; name: string; value: number };
  minPrice: number;
  maxPrice: number;
  rate: number;
}

interface Props {
  commissionId?: number;
}

// eslint-disable-next-line react/display-name
const AddOrEditCommission = memo((props: Props) => {
  const { commissionId } = props;
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();
  const router = useRouter();

  const [commission, setCommission] = useState<Commission>(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      policy: yup.array(
        yup.object({
          serviceType: yup
            .object()
            .shape({
              id: yup
                .number()
                .required(
                  t(
                    "admin_management_section_commission_add_or_edit_service_type_validate"
                  )
                ),
              name: yup
                .string()
                .required(
                  t(
                    "admin_management_section_commission_add_or_edit_service_type_validate"
                  )
                ),
              value: yup
                .number()
                .required(
                  t(
                    "admin_management_section_commission_add_or_edit_service_type_validate"
                  )
                ),
            })
            .required(
              t(
                "admin_management_section_commission_add_or_edit_service_type_validate"
              )
            ),
          minPrice: yup
            .number()
            .typeError(
              t(
                "admin_management_section_commission_add_or_edit_min_price_validate"
              )
            )
            .positive(
              t(
                "admin_management_section_commission_add_or_edit_min_price_validate_error"
              )
            )
            .required(
              t(
                "admin_management_section_commission_add_or_edit_min_price_validate"
              )
            ),
          maxPrice: yup
            .number()
            .integer()
            .typeError(
              t(
                "admin_management_section_commission_add_or_edit_max_price_validate"
              )
            )
            .positive(
              t(
                "admin_management_section_commission_add_or_edit_max_price_validate_error"
              )
            )
            .min(
              yup.ref("minPrice"),
              t(
                "admin_management_section_commission_add_or_edit_max_price_validate_min"
              )
            )
            .nullable(),
          rate: yup
            .number()
            .integer()
            .typeError(
              t(
                "admin_management_section_commission_add_or_edit_rate_validate_error"
              )
            )
            .required(
              t("admin_management_section_commission_add_or_edit_rate_validate")
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
  } = useForm<CommissionForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      serviceType: serviceType[0],
    },
  });

  const clearForm = () => {
    reset({
      serviceType: serviceType[0],
      maxPrice: null,
      minPrice: null,
      rate: null,
    });
  };

  const _onSubmit = (data: CommissionForm) => {
    dispatch(setLoading(true));
    if (commission) {
      CommissionService.update(commission?.id, {
        minPrice: data?.minPrice,
        maxPrice: data?.maxPrice || null,
        rate: data?.rate,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          router.push("/admin/commissions");
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      CommissionService.create({
        minPrice: data?.minPrice,
        maxPrice: data?.maxPrice || null,
        rate: data?.rate,
        serviceType: data?.serviceType.value,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_create_success")));
          router.push("/admin/commissions");
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  const onBack = () => {
    router.push("/admin/commissions");
    clearForm();
  };

  useEffect(() => {
    if (commissionId) {
      dispatch(setLoading(true));
      CommissionService.findOne(commissionId)
        .then((res) => {
          setCommission(res?.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  }, [commissionId]);

  useEffect(() => {
    reset({
      minPrice: commission?.minPrice,
      maxPrice: commission?.maxPrice,
      rate: commission?.rate,
      serviceType: getServiceType(commission?.serviceType),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commission]);

  return (
    <Grid className={classes.root}>
      <Container className={clsx(classes.rowHeaderBox, classes.title)}>
        {!commissionId ? (
          <h3>{t("common_create")}</h3>
        ) : (
          <h3>{t("common_edit")}</h3>
        )}
        <Button onClick={onBack} btnType={BtnType.Primary}>
          {t("common_back")}
        </Button>
      </Container>
      <Container>
        <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
          <Grid sx={{ paddingTop: "32px" }}>
            <Grid
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              container
            >
              <Grid item xs={6}>
                <InputTextfield
                  title={t(
                    "admin_management_section_commission_add_or_edit_min_price_title"
                  )}
                  placeholder={t(
                    "admin_management_section_commission_add_or_edit_min_price_placeholder"
                  )}
                  autoComplete="off"
                  type="float"
                  inputRef={register("minPrice")}
                  errorMessage={errors.minPrice?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputTextfield
                  title={t(
                    "admin_management_section_commission_add_or_edit_max_rate_title"
                  )}
                  placeholder={t(
                    "admin_management_section_commission_add_or_edit_max_rate_placeholder"
                  )}
                  autoComplete="off"
                  type="float"
                  inputRef={register("maxPrice")}
                  errorMessage={errors.maxPrice?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputTextfield
                  title={t(
                    "admin_management_section_commission_add_or_edit_rate_title"
                  )}
                  placeholder={t(
                    "admin_management_section_commission_add_or_edit_rate_placeholder"
                  )}
                  autoComplete="off"
                  type="float"
                  inputRef={register("rate")}
                  errorMessage={errors.rate?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputSelect
                  fullWidth
                  title={t(
                    "admin_management_section_commission_add_or_edit_service_type_title"
                  )}
                  name={`serviceType`}
                  control={control}
                  selectProps={{
                    options: serviceType,
                    placeholder: t(
                      "admin_management_section_commission_add_or_edit_service_type_placeholder"
                    ),
                  }}
                  errorMessage={errors.serviceType?.message}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.footer}>
            <Button
              btnType={BtnType.Primary}
              type="submit"
              className={classes.btnSave}
            >
              {t("common_save")}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
});

export default AddOrEditCommission;
