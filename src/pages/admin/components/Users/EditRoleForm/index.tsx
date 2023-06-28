import React, { useMemo, memo, useState, useEffect } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import clsx from "clsx";
import "react-quill/dist/quill.snow.css";
import { Box, Grid, Menu, MenuItem, Radio, RadioGroup } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import { User } from "models/admin/user";
import { EUserType } from "models/user";
import { UserService } from "services/admin/user";
import UseAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";

export interface RoleForm {
  role: number;
}

interface Props {
  userEdit: User;
  fetchData: () => void;
  onCloseEditUser: () => void;
}

// eslint-disable-next-line react/display-name
const EditRole = memo((props: Props) => {
  const { userEdit, fetchData, onCloseEditUser } = props;
  const dispatch = useDispatch();
  const { user } = UseAuth();

  const { t, i18n } = useTranslation("common");

  const [anchorElMenuChangeRole, setAnchorElMenuChangeRole] =
    useState<null | HTMLElement>(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      role: yup
        .number()
        .typeError(t("admin_management_tab_user_role_validate"))
        .required(t("admin_management_tab_user_role_validate")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const { handleSubmit, reset, control, setValue } = useForm<RoleForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleClickMenuChangeRole = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElMenuChangeRole(event.currentTarget);
  };

  const handleCloseMenuChangeRole = () => {
    setAnchorElMenuChangeRole(null);
    onCloseEditUser();
  };

  const _onSubmit = (data) => {
    dispatch(setLoading(true));
    UserService.changeRole({
      userId: userEdit?.id,
      role: data?.role,
    })
      .then(() => {
        dispatch(setSuccessMess(t("common_update_success")));
        fetchData();
        handleCloseMenuChangeRole();
        onCloseEditUser();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    reset({
      role: userEdit?.role,
    });
  }, [userEdit]);

  return (
    <Grid>
      <Button
        sx={{
          width: { xs: "100%", sm: "auto" },
          maxHeight: "36px",
        }}
        className={classes.selectTourBtn}
        btnType={BtnType.Outlined}
        onClick={handleClickMenuChangeRole}
      >
        Select role
        <KeyboardArrowDown
          sx={{
            color: "var(--gray-80)",
            marginRight: "0px !important",
          }}
        />
      </Button>
      <Menu
        anchorEl={anchorElMenuChangeRole}
        open={Boolean(anchorElMenuChangeRole)}
        onClose={handleCloseMenuChangeRole}
        sx={{ mt: 1 }}
      >
        <Grid
          className={classes.menuChooseTour}
          component="form"
          onSubmit={handleSubmit(_onSubmit)}
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <>
                {user?.role === EUserType.SUPER_ADMIN && (
                  <>
                    <MenuItem
                      classes={{
                        root: clsx(classes.rootMenuItemChooseTour),
                      }}
                      onClick={() => setValue("role", EUserType.SUPER_ADMIN)}
                    >
                      <Grid className={clsx(classes.menuItemFlex)}>
                        <Grid>
                          <>
                            <Grid sx={{ paddingRight: "14px" }}>
                              <InputCheckbox
                                content={t(
                                  "admin_management_tab_user_edit_role_super_admin"
                                )}
                                checked={field.value === EUserType.SUPER_ADMIN}
                                onChange={() => {
                                  setValue("role", EUserType.SUPER_ADMIN);
                                }}
                              />{" "}
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: clsx(classes.rootMenuItemChooseTour),
                      }}
                      onClick={() => setValue("role", EUserType.ADMIN)}
                    >
                      <Grid className={clsx(classes.menuItemFlex)}>
                        <Grid>
                          <>
                            <Grid sx={{ paddingRight: "14px" }}>
                              <InputCheckbox
                                content={t(
                                  "admin_management_tab_user_edit_role_admin"
                                )}
                                checked={field.value === EUserType.ADMIN}
                                onChange={() => {
                                  setValue("role", EUserType.ADMIN);
                                }}
                              />{" "}
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  classes={{
                    root: clsx(classes.rootMenuItemChooseTour),
                  }}
                  onClick={() => setValue("role", EUserType.ENTERPRISE)}
                >
                  <Grid className={clsx(classes.menuItemFlex)}>
                    <Grid>
                      <>
                        <Grid sx={{ paddingRight: "14px" }}>
                          <InputCheckbox
                            content={t(
                              "admin_management_tab_user_edit_role_enterprise"
                            )}
                            checked={field.value === EUserType.ENTERPRISE}
                            onChange={() => {
                              setValue("role", EUserType.ENTERPRISE);
                            }}
                          />{" "}
                        </Grid>
                      </>
                    </Grid>
                  </Grid>
                </MenuItem>
                <MenuItem
                  classes={{
                    root: clsx(classes.rootMenuItemChooseTour),
                  }}
                  onClick={() => setValue("role", EUserType.STAFF)}
                >
                  <Grid className={clsx(classes.menuItemFlex)}>
                    <Grid>
                      <>
                        <Grid sx={{ paddingRight: "14px" }}>
                          <InputCheckbox
                            content={t(
                              "admin_management_tab_user_edit_role_staff"
                            )}
                            checked={field.value === EUserType.STAFF}
                            onChange={() => {
                              setValue("role", EUserType.STAFF);
                            }}
                          />
                        </Grid>
                      </>
                    </Grid>
                  </Grid>
                </MenuItem>
                <MenuItem
                  classes={{
                    root: clsx(classes.rootMenuItemChooseTour),
                  }}
                  onClick={() => setValue("role", EUserType.USER)}
                >
                  <Grid className={clsx(classes.menuItemFlex)}>
                    <Grid>
                      <>
                        <Grid sx={{ paddingRight: "14px" }}>
                          <InputCheckbox
                            content={t(
                              "admin_management_tab_user_edit_role_user"
                            )}
                            checked={field.value === EUserType.USER}
                            onChange={() => {
                              setValue("role", EUserType.USER);
                            }}
                          />
                        </Grid>
                      </>
                    </Grid>
                  </Grid>
                </MenuItem>
              </>
            )}
          />
          <Grid className={classes.menuChooseTourAction}>
            <Button
              btnType={BtnType.Outlined}
              translation-key="common_cancel"
              onClick={handleCloseMenuChangeRole}
            >
              {t("common_cancel")}
            </Button>
            <Button
              btnType={BtnType.Primary}
              translation-key="common_done"
              className={classes.btnSave}
              type="submit"
            >
              {t("common_done")}
            </Button>
          </Grid>
        </Grid>
      </Menu>
    </Grid>
  );
});

export default EditRole;
