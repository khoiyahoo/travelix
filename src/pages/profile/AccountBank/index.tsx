/* eslint-disable react/display-name */
import React, { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Row, Container, Col, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION } from "configs/constants";
import UseAuth from "hooks/useAuth";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { UserService } from "services/user";
import UploadAvatar from "components/UploadAvatar";
import { ImageService } from "services/image";
import { EUserType } from "models/user";
import { useTranslation } from "react-i18next";
import InputTextfield from "components/common/inputs/InputTextfield";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import { VietQR } from "vietqr";
import { BankService } from "services/bank";
import InputSelect from "components/common/inputs/InputSelect";
import { EBankType, OptionItem, bankInternational } from "models/general";
import { ProvinceService } from "services/address";
import { Grid } from "@mui/material";

interface FormUser {
  bankType: {
    id?: number;
    name?: string;
    value?: number;
  };
  bankCode: {
    id?: number;
    name?: string;
    value?: number;
  };
  bankName: {
    id?: number;
    name?: string;
    value?: number;
  };
  bankCardNumber: string;
  bankUserName: string;
  releaseDate: Date;
  expirationDate: Date;
  cvcOrCvv: string;
  bankEmail: string;
  bankCountry: OptionItem;
  bankProvinceOrCity: string;
  bankUserAddress: string;
}
interface Props {}

const UserProfile = memo((props: Props) => {
  const { t, i18n } = useTranslation("common");
  const { user } = UseAuth();
  const dispatch = useDispatch();

  const bankType = [
    { id: 1, name: t("common_bank_type_internal"), value: EBankType.INTERNAL },
    {
      id: 2,
      name: t("common_bank_type_international"),
      value: EBankType.INTERNATIONAL,
    },
  ];

  const getBankType = (type: number) => {
    switch (type) {
      case EBankType.INTERNAL:
        return {
          id: 1,
          name: t("common_bank_type_internal"),
          value: EBankType.INTERNAL,
        };
      case EBankType.INTERNATIONAL:
        return {
          id: 2,
          name: t("common_bank_type_international"),
          value: EBankType.INTERNATIONAL,
        };
    }
  };

  const [bankInternal, setBankInternal] = useState(null);
  const [country, setCountry] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      bankType: yup
        .object()
        .typeError(t("common_validate_field"))
        .shape({
          id: yup.number().required(t("common_validate_field")),
          name: yup.string().required(t("common_validate_field")),
        })
        .required(t("common_validate_field")),
      bankName: yup.object().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNAL,
        then: yup
          .object()
          .typeError(t("common_validate_field"))
          .shape({
            id: yup.number().required(t("common_validate_field")),
            name: yup.string().required(t("common_validate_field")),
          })
          .required(),
        otherwise: yup
          .object()
          .typeError(t("common_validate_field"))
          .nullable()
          .notRequired(),
      }),
      bankCode: yup
        .object()
        .typeError(t("common_validate_field"))
        .shape({
          id: yup.number().required(t("common_validate_field")),
          name: yup.string().required(t("common_validate_field")),
        })
        .required(),
      bankCardNumber: yup.string().required(t("common_validate_field")),
      bankUserName: yup.string().required(),
      releaseDate: yup.date().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNAL,
        then: yup.date().required(t("common_validate_field")),
        otherwise: yup.date().nullable().notRequired(),
      }),
      expirationDate: yup.date().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNATIONAL,
        then: yup.date().required(t("common_validate_field")),
        otherwise: yup.date().nullable().notRequired(),
      }),
      cvcOrCvv: yup.string().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNATIONAL,
        then: yup.string().required(t("common_validate_field")),
        otherwise: yup.string().nullable().notRequired(),
      }),
      bankEmail: yup.string().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNATIONAL,
        then: yup.string().required(t("common_validate_field")),
        otherwise: yup.string().nullable().notRequired(),
      }),
      bankCountry: yup.object().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNATIONAL,
        then: yup
          .object()
          .typeError(t("common_validate_field"))
          .shape({
            id: yup.number().required(t("common_validate_field")),
            name: yup.string().required(t("common_validate_field")),
          })
          .required(),
        otherwise: yup
          .object()
          .typeError(t("common_validate_field"))
          .nullable()
          .notRequired(),
      }),
      bankProvinceOrCity: yup.string().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNATIONAL,
        then: yup.string().required(t("common_validate_field")),
        otherwise: yup.string().nullable().notRequired(),
      }),
      bankUserAddress: yup.string().when("bankType", {
        is: (type: OptionItem) => type?.id === EBankType.INTERNATIONAL,
        then: yup.string().required(t("common_validate_field")),
        otherwise: yup.string().nullable().notRequired(),
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<FormUser>({
    resolver: yupResolver(schema),
    mode: "onChange",

    defaultValues: {
      bankType: bankType[0],
    },
  });

  useEffect(() => {
    BankService.getBanks()
      .then((banks) => {
        setBankInternal(banks?.data?.data);
        console.log(banks);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    ProvinceService.getCountry()
      .then((res) => {
        // setBankInternal(banks?.data?.data);
        console.log(res);
        setCountry(res?.data);
      })
      .catch((err) => {});
  }, []);

  const fetchNameBankInternal = () => {
    const _banks = bankInternal?.map((item) => {
      return {
        id: item?.id,
        name: item?.name,
      };
    });
    return _banks;
  };
  const fetchCodeBankInternal = () => {
    const _banks = bankInternal?.map((item) => {
      return {
        id: item?.id,
        name: item?.code,
      };
    });
    return _banks;
  };

  const fetchCountry = () => {
    const _country = country?.map((item, index) => {
      return {
        id: index,
        name: item?.name?.common,
      };
    });
    return _country;
  };

  const _onSubmit = async (data: FormUser) => {
    dispatch(setLoading(true));
    if (user) {
      UserService.updateBank(user.id, {
        bankType: data?.bankType?.value,
        bankCode: { id: data?.bankCode?.id, name: data?.bankCode?.name },
        bankName: { id: data?.bankName?.id, name: data?.bankName?.name },
        bankCardNumber: data?.bankCardNumber,
        bankUserName: data?.bankUserName,
        releaseDate: data?.releaseDate,
        expirationDate: data?.expirationDate,
        cvcOrCvv: data?.cvcOrCvv,
        bankEmail: data?.bankEmail,
        bankCountry: data?.bankCountry?.name,
        bankProvinceOrCity: data?.bankProvinceOrCity,
        bankUserAddress: data?.bankUserAddress,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
        })
        .catch((err) => dispatch(setErrorMess(err)))
        .finally(() => dispatch(setLoading(false)));
    }
  };

  useEffect(() => {
    if (user) {
      UserService.getUserProfile(user?.id)
        .then((res) => {
          reset({
            bankType: getBankType(res?.bankType),
            bankCode: res?.bankCode,
            bankName: res?.bankName,
            bankCardNumber: res?.bankCardNumber,
            bankUserName: res?.bankUserName,
            releaseDate: new Date(res?.releaseDate),
            expirationDate: new Date(res?.expirationDate),
            cvcOrCvv: res?.cvcOrCvv,
            bankEmail: res?.bankEmail,
            bankCountry: res?.bankCountry?.name,
            bankProvinceOrCity: res?.bankProvinceOrCity,
            bankUserAddress: res?.bankUserAddress,
          });
        })
        .catch((err) => dispatch(setErrorMess(err)))
        .finally(() => dispatch(setLoading(false)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  return (
    <>
      <Container className={`px-lg-5 ${classes.containerForm}`}>
        <Form role="form" onSubmit={handleSubmit(_onSubmit)}>
          <InputSelect
            fullWidth
            title={t("auth_account_bank_type")}
            name="bankType"
            control={control}
            className="mb-4"
            selectProps={{
              options: bankType,
              placeholder: `-- ${t("auth_account_bank_type")} --`,
            }}
            errorMessage={(errors.bankType as any)?.message}
          />
          {watch("bankType")?.value === EBankType.INTERNAL && (
            <InputSelect
              fullWidth
              title={t("auth_account_bank_name")}
              name="bankName"
              control={control}
              className="mb-4"
              selectProps={{
                options: fetchNameBankInternal(),
                placeholder: `-- ${t("auth_account_bank_name")} --`,
              }}
              errorMessage={(errors.bankName as any)?.message}
            />
          )}
          <InputSelect
            fullWidth
            title={t("auth_account_bank_code")}
            name="bankCode"
            control={control}
            className="mb-4"
            selectProps={{
              options:
                watch("bankType")?.value === EBankType.INTERNAL
                  ? fetchCodeBankInternal()
                  : bankInternational,
              placeholder: `-- ${t("auth_account_bank_code")} --`,
            }}
            errorMessage={(errors.bankCode as any)?.message}
          />

          <InputTextfield
            className="mb-4"
            title={t("auth_account_bank_card_number")}
            name="bankCardNumber"
            placeholder={t("auth_account_bank_card_number")}
            type="text"
            inputRef={register("bankCardNumber")}
            errorMessage={errors.bankCardNumber?.message}
          />
          <InputTextfield
            className="mb-4"
            title={t("auth_account_bank_user_name")}
            name="bankUserName"
            placeholder={t("auth_account_bank_user_name")}
            type="text"
            inputRef={register("bankUserName")}
            errorMessage={errors.bankUserName?.message}
          />

          {watch("bankType")?.value === EBankType.INTERNAL && (
            <InputDatePicker
              control={control}
              name="releaseDate"
              label={t("auth_account_bank_release")}
              placeholder={t("auth_account_bank_release")}
              closeOnSelect={true}
              timeFormat={false}
              dateFormat="DD/YY"
              className="mb-4"
              inputRef={register("releaseDate")}
              errorMessage={errors.releaseDate?.message}
            />
          )}

          {watch("bankType")?.value === EBankType.INTERNATIONAL && (
            <Grid sx={{ marginBottom: "1.5rem" }}>
              <InputDatePicker
                control={control}
                label={t("auth_account_bank_expiration")}
                name="expirationDate"
                placeholder={t("auth_account_bank_expiration")}
                closeOnSelect={true}
                timeFormat={false}
                dateFormat="DD/YY"
                className="mb-4"
                inputRef={register("expirationDate")}
                errorMessage={errors.expirationDate?.message}
              />
            </Grid>
          )}
          {watch("bankType")?.value === EBankType.INTERNATIONAL && (
            <InputTextfield
              className="mb-4"
              title={t("auth_account_bank_CVC")}
              name="cvcOrCvv"
              placeholder={t("auth_account_bank_CVC")}
              type="text"
              inputRef={register("cvcOrCvv")}
              errorMessage={errors.cvcOrCvv?.message}
            />
          )}
          {watch("bankType")?.value === EBankType.INTERNATIONAL && (
            <InputTextfield
              className="mb-4"
              title={t("auth_account_bank_email")}
              name="bankEmail"
              placeholder={t("auth_account_bank_email")}
              type="text"
              inputRef={register("bankEmail")}
              errorMessage={errors.bankEmail?.message}
            />
          )}
          {watch("bankType")?.value === EBankType.INTERNATIONAL && (
            <InputSelect
              fullWidth
              title={t("auth_account_bank_country")}
              name="bankCountry"
              control={control}
              className="mb-4"
              selectProps={{
                options: fetchCountry(),
                placeholder: `-- ${t("auth_account_bank_country")} --`,
              }}
              errorMessage={(errors.bankCountry as any)?.message}
            />
          )}
          {watch("bankType")?.value === EBankType.INTERNATIONAL && (
            <InputTextfield
              className="mb-4"
              title={t("auth_account_bank_province")}
              name="bankProvinceOrCity"
              placeholder={t("auth_account_bank_province")}
              type="text"
              inputRef={register("bankProvinceOrCity")}
              errorMessage={errors.bankProvinceOrCity?.message}
            />
          )}
          {watch("bankType")?.value === EBankType.INTERNATIONAL && (
            <InputTextfield
              className="mb-4"
              title={t("auth_account_bank_user_address")}
              name="bankUserAddress"
              placeholder={t("auth_account_bank_user_address")}
              type="text"
              inputRef={register("bankUserAddress")}
              errorMessage={errors.bankUserAddress?.message}
            />
          )}
          <Button
            btnType={BtnType.Primary}
            type="submit"
            className={classes.btnSave}
          >
            {t("common_save")}
          </Button>
        </Form>
      </Container>
    </>
  );
});

export default UserProfile;
