import React, { useMemo, memo, useCallback, useState, useEffect } from "react";
import {
  Row,
  Form,
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Table,
  Card,
  CardBody,
  CardHeader,
  Collapse,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import InputTextArea from "components/common/inputs/InputTextArea";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import * as yup from "yup";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "components/common/texts/ErrorMessage";
import { fData } from "utils/formatNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faListCheck,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import { clsx } from "clsx";
import InputTextField from "components/common/inputs/InputTextfield";
import UploadImage from "components/UploadImage";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { ImageService } from "services/image";
import { RoomService } from "services/enterprise/room";
import { EditRoomPrice } from "models/room";

const FILE_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const PHOTO_SIZE = 10000000000; // bytes
const MAX_IMAGES = 9;
const MIN_IMAGES = 3;
export interface RoomForm {
  discount?: number;
  monday?: number;
  tuesday?: number;
  wednesday?: number;
  thursday?: number;
  friday?: number;
  saturday?: number;
  sunday?: number;
}

interface Props extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemEdit: EditRoomPrice;
}

// eslint-disable-next-line react/display-name
const PopupEditRoomPrice = memo((props: Props) => {
  const dispatch = useDispatch();
  const { isOpen, onClose, itemEdit } = props;

  const schema = useMemo(() => {
    return yup.object().shape({
      discount: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError("Discount must be a number")
        .notRequired(),
      monday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
      tuesday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
      wednesday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
      thursday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
      friday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
      saturday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
      sunday: yup
        .number()
        .typeError("Price is must be number")
        .positive("Price must be than 0")
        .required("Price monday is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoomForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = () => {
    dispatch(setLoading(true));
    RoomService.updatePrice(itemEdit?.id, {
      discount: itemEdit?.discount,
      mondayPrice: itemEdit.mondayPrice,
      tuesdayPrice: itemEdit.tuesdayPrice,
      wednesdayPrice: itemEdit.wednesdayPrice,
      thursdayPrice: itemEdit.thursdayPrice,
      fridayPrice: itemEdit.fridayPrice,
      saturdayPrice: itemEdit.saturdayPrice,
      sundayPrice: itemEdit.sundayPrice,
    })
      .then((res) => {
        dispatch(setSuccessMess("Update room price successfully"));
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      })
      .finally(() => {
        dispatch(setLoading(false));
        onClose();
      });
  };

  useEffect(() => {
    if (itemEdit) {
      reset({
        discount: itemEdit.discount,
        monday: itemEdit.mondayPrice,
        tuesday: itemEdit.tuesdayPrice,
        wednesday: itemEdit.wednesdayPrice,
        thursday: itemEdit.thursdayPrice,
        friday: itemEdit.fridayPrice,
        saturday: itemEdit.saturdayPrice,
        sunday: itemEdit.sundayPrice,
      });
    }
  }, [reset, itemEdit]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} className={classes.root}>
        <ModalHeader toggle={onClose} className={classes.title}>
          Edit room
        </ModalHeader>
        <Form
          role="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <ModalBody>
            <Row className={classes.row}>
              <Col>
                <InputTextFieldBorder
                  label="Discount"
                  className="mr-3"
                  placeholder="Enter discount"
                  inputRef={register("discount")}
                  errorMessage={errors.discount?.message}
                />
              </Col>
            </Row>
            <Row className={classes.row}>
              <Col>
                <Table bordered className={classes.table}>
                  <thead>
                    <tr>
                      <th scope="row">Days</th>
                      <th>Price (unit VND)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Monday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("monday")}
                          errorMessage={errors.monday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Tuesday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("tuesday")}
                          errorMessage={errors.tuesday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Wednesday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("wednesday")}
                          errorMessage={errors.wednesday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Thursday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("thursday")}
                          errorMessage={errors.thursday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Friday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("friday")}
                          errorMessage={errors.friday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Saturday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("saturday")}
                          errorMessage={errors.saturday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Sunday</th>
                      <td className={classes.tdPriceInput}>
                        <InputTextField
                          inputRef={register("sunday")}
                          errorMessage={errors.sunday?.message}
                        />
                        &nbsp;VND
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className={classes.footer}>
            <Button btnType={BtnType.Primary} type="submit">
              Save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
});

export default PopupEditRoomPrice;
