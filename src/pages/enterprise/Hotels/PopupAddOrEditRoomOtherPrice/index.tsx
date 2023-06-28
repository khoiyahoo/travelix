import React, { useMemo, memo, useState, useEffect } from "react";
import {
  Row,
  Form,
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { clsx } from "clsx";
import InputTextField from "components/common/inputs/InputTextfield";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { RoomService } from "services/enterprise/room";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import moment from "moment";
export interface RoomForm {
  otherPriceList: {
    id: number;
    date: Date;
    price: number;
  }[];
}

interface Props extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
}

// eslint-disable-next-line react/display-name
const PopupAddOrEditRoomOtherPrice = memo((props: Props) => {
  const { isOpen, onClose, roomId } = props;

  const dispatch = useDispatch();

  const [deleteItems, setDeleteItems] = useState([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      otherPriceList: yup.array().of(
        yup.object().shape({
          id: yup.number(),
          date: yup.date().typeError("Please enter a valid date"),
          price: yup.number().typeError("Please enter a valid number"),
        })
      ),
    });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<RoomForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "otherPriceList",
    keyName: "fieldID",
  });

  useEffect(() => {
    if (isOpen && roomId) {
      RoomService.getRoomOtherPrice(roomId).then((res) => {
        if (res?.data?.length > 0) {
          res?.data?.map((item) => {
            append({
              id: item?.id,
              date: new Date(item?.date),
              price: item?.price,
            });
          });
        } else {
          append({
            id: -1,
            date: null,
            price: null,
          });
        }
      });
    } else {
      remove();
    }
    setDeleteItems([]);
  }, [isOpen, roomId]);

  const handleDeleteItem = (id: number, index: number) => {
    remove(index);
    if (id !== -1) {
      setDeleteItems([...deleteItems, id]);
    }
  };

  const _onSubmit = (data) => {
    let arrCreate = [];
    let arrUpdate = [];
    let arrDelete = [];
    data?.otherPriceList?.map((itemPrice) => {
      if (itemPrice?.id === -1) {
        arrCreate.push(
          RoomService.createRoomOtherPrice({
            date: itemPrice?.date,
            price: itemPrice?.price,
            roomId: roomId,
          })
        );
      } else {
        arrUpdate.push(
          RoomService.updateRoomOtherPrice(itemPrice?.id, {
            date: itemPrice?.date,
            price: itemPrice?.price,
            roomId: roomId,
          })
        );
      }
    });
    if (deleteItems.length > 0) {
      deleteItems.map((itemId) => {
        if (itemId !== -1) {
          arrDelete.push(RoomService.deleteRoomOtherPrice(itemId));
        }
      });
    }
    dispatch(setLoading(true));
    Promise.all([...arrCreate, ...arrUpdate, ...deleteItems])
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

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} className={classes.root}>
        <ModalHeader toggle={onClose} className={classes.title}>
          Price of the special day
        </ModalHeader>
        <Form
          role="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <ModalBody>
            {fields?.map((field: any, index) => {
              return (
                <Row key={field?.fieldID} className={classes.row}>
                  <div className={classes.itemWrapper}>
                    <InputDatePicker
                      className={classes.datePicker}
                      name={`otherPriceList.${index}.date`}
                      control={control}
                      placeholder="Date"
                      dateFormat="DD/MM/YYYY"
                      minDate
                      timeFormat={false}
                      errorMessage={
                        errors.otherPriceList &&
                        errors.otherPriceList[index]?.date?.message
                      }
                      isValidDate={disablePastDt}
                    />
                    <div className="d-flex align-items-center">
                      <InputTextField
                        className="mb-0 mr-1"
                        placeholder="Price"
                        type="text"
                        autoComplete="off"
                        inputRef={register(`otherPriceList.${index}.price`)}
                        errorMessage={
                          errors.otherPriceList &&
                          errors.otherPriceList[index]?.price?.message
                        }
                      />
                      <span>VND</span>
                    </div>
                    <InputTextField
                      className="d-none"
                      placeholder="id"
                      type="text"
                      autoComplete="off"
                      inputRef={register(`otherPriceList.${index}.id`)}
                      errorMessage={
                        errors.otherPriceList &&
                        errors.otherPriceList[index]?.id?.message
                      }
                    />
                    {fields?.length > 1 && (
                      <div className={classes.btnDelete}>
                        <Button
                          onClick={() => handleDeleteItem(field?.id, index)}
                          color="danger"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    )}
                  </div>
                </Row>
              );
            })}
          </ModalBody>

          <div className={classes.btnAddMore}>
            <Button
              type="button"
              onClick={() =>
                append({
                  id: -1,
                  date: null,
                  price: null,
                })
              }
              color="warning"
            >
              Add more
            </Button>
          </div>
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

export default PopupAddOrEditRoomOtherPrice;
