import { memo, useMemo } from "react";
import { Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import Button, { BtnType } from "components/common/buttons/Button";
import QRCode from "react-qr-code";
import { EBillStatus } from "models/general";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RoomBillService } from "services/enterprise/roomBill";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  billId: number;
  fetchData: () => void;
}

interface ChangeStatus {
  status: number;
}

const PopupChangeStatus = memo(
  ({ billId, onClose, isOpen, fetchData }: Props) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation("common");

    const schema = useMemo(() => {
      return yup.object().shape({
        status: yup.number().required(""),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const {
      handleSubmit,
      formState: { errors },
      control,
      setValue,
    } = useForm<ChangeStatus>({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

    const _onSubmit = (data: ChangeStatus) => {
      dispatch(setLoading(true));
      RoomBillService?.changeStatus(billId, { status: data?.status })
        .then(() => {
          dispatch(
            setSuccessMess(
              t(
                "enterprise_management_section_tour_bill_action_change_status_success"
              )
            )
          );
          fetchData();
          onClose();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    };

    return (
      <Modal
        isOpen={isOpen}
        toggle={onClose}
        centered
        scrollable
        className={classes.modal}
      >
        <ModalHeader isOpen={isOpen} toggle={onClose} className={classes.title}>
          {t(
            "enterprise_management_section_tour_bill_popup_change_status_title"
          )}
        </ModalHeader>
        <Grid component={"form"} onSubmit={handleSubmit(_onSubmit)}>
          <ModalBody>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <Grid sx={{ paddingRight: "14px" }}>
                    <InputCheckbox
                      content={t(
                        "enterprise_management_section_tour_bill_action_change_status_not_contact"
                      )}
                      checked={field.value === EBillStatus.NOT_CONTACTED_YET}
                      onChange={() => {
                        setValue("status", EBillStatus.NOT_CONTACTED_YET);
                      }}
                    />
                  </Grid>
                  <Grid sx={{ paddingRight: "14px" }}>
                    <InputCheckbox
                      content={t(
                        "enterprise_management_section_tour_bill_action_change_status_contacted"
                      )}
                      checked={field.value === EBillStatus.CONTACTED}
                      onChange={() => {
                        setValue("status", EBillStatus.CONTACTED);
                      }}
                    />
                  </Grid>
                  <Grid sx={{ paddingRight: "14px" }}>
                    <InputCheckbox
                      content={t(
                        "enterprise_management_section_tour_bill_action_change_status_used"
                      )}
                      checked={field.value === EBillStatus.USED}
                      onChange={() => {
                        setValue("status", EBillStatus.USED);
                      }}
                    />
                  </Grid>
                  <Grid sx={{ paddingRight: "14px" }}>
                    <InputCheckbox
                      content={t(
                        "enterprise_management_section_tour_bill_action_change_status_not_used"
                      )}
                      checked={field.value === EBillStatus.NOT_USE}
                      onChange={() => {
                        setValue("status", EBillStatus.NOT_USE);
                      }}
                    />
                  </Grid>
                </>
              )}
            />
          </ModalBody>
          <ModalFooter className={classes.btn}>
            <Button
              onClick={onClose}
              btnType={BtnType.Secondary}
              className="mr-2"
            >
              {t("common_cancel")}
            </Button>
            <Button btnType={BtnType.Primary} type="submit">
              {t("common_save")}
            </Button>
          </ModalFooter>
        </Grid>
      </Modal>
    );
  }
);

export default PopupChangeStatus;
