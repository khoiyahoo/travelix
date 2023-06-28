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
import { getAllHotels } from "redux/reducers/Enterprise/actionTypes";
import useAuth from "hooks/useAuth";
import InputTags from "components/common/inputs/InputTags";
import { OptionItem } from "models/general";
import { tagsOption } from "configs/constants";
import InputSelect from "components/common/inputs/InputSelects";

const FILE_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const PHOTO_SIZE = 10000000000; // bytes
const MAX_IMAGES = 9;
const MIN_IMAGES = 3;
export interface RoomForm {
  room: {
    title: string;
    description: string;
    imagesRoom: string[];
    tags: OptionItem<string>[];
    discount: number;
    numberOfBed: number;
    numberOfRoom: number;
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
    saturday?: number;
    sunday?: number;
  }[];
}

interface Props extends ModalProps {
  hotelId: number;
  isOpen: boolean;
  onClose: () => void;
}

// eslint-disable-next-line react/display-name
const PopupAddOrEditHotel = memo((props: Props) => {
  const dispatch = useDispatch();
  const { hotelId, isOpen, onClose } = props;
  const [isOpenToggleArr, setIsOpenToggleArr] = useState([true]);
  const { user } = useAuth();
  const schema = useMemo(() => {
    return yup.object().shape({
      room: yup.array(
        yup.object({
          title: yup.string().required("Name is required"),
          description: yup.string().required("Name is required"),
          tags: yup
            .array(
              yup.object({
                id: yup.string().required("Tags is required."),
                name: yup.string().required("Tags is required."),
              })
            )
            .required("Tags is required.")
            .min(1, "Tags is required."),
          discount: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .typeError("Discount must be a number")
            .notRequired(),
          numberOfBed: yup
            .number()
            .typeError("Number of room must be a number")
            .required("Number of room is required"),
          numberOfRoom: yup
            .number()
            .typeError("Number of bed must be a number")
            .required("Number of bed is required"),
          imagesRoom: yup
            .mixed()
            .test("required", "Please select images", (value) => {
              return value && value.length;
            }),
          monday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
          tuesday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
          wednesday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
          thursday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
          friday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
          saturday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
          sunday: yup
            .number()
            .typeError("Price is required.")
            .positive("Price must be than 0")
            .required("Price monday is required"),
        })
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<RoomForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    fields: fieldsRoom,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: "room",
  });

  const handleToggleCollapse = (index) => {
    const newIsOpen = [...isOpenToggleArr];
    newIsOpen[index] = !newIsOpen[index];
    setIsOpenToggleArr(newIsOpen);
  };

  const onAddRoom = () => {
    appendRoom({
      title: "",
      description: "",
      tags: [],
      imagesRoom: [],
      discount: null,
      numberOfBed: null,
      numberOfRoom: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  };

  const onRemoveRoom = (index: number) => {
    removeRoom(index);
  };

  const clearForm = () => {
    reset({
      room: [],
    });
  };

  const _onSubmit = async (data: RoomForm) => {
    dispatch(setLoading(true));
    const arrRequest = [];
    await data?.room.map(async (item) => {
      const uploader = [];
      await item?.imagesRoom?.map(async (file) => {
        const formData: any = new FormData();
        formData.append("file", file);
        formData.append("tags", "codeinfuse, medium, gist");
        formData.append("upload_preset", "my-uploads");
        formData.append("api_key", "859398113752799");
        formData.append("timestamp", Date.now() / 1000 / 0);
        uploader.push(ImageService.uploadImage(formData));
      });

      await Promise.all(uploader).then((images) => {
        const roomData = {
          title: item?.title,
          description: item?.description,
          tags: item.tags.map((it) => it.name),
          images: images,
          hotelId: hotelId,
          discount: item?.discount,
          numberOfBed: item?.numberOfRoom,
          numberOfRoom: item?.numberOfBed,
          mondayPrice: item?.monday,
          tuesdayPrice: item?.tuesday,
          wednesdayPrice: item?.wednesday,
          thursdayPrice: item?.thursday,
          fridayPrice: item?.friday,
          saturdayPrice: item?.saturday,
          sundayPrice: item?.sunday,
        };

        arrRequest.push(RoomService.createRoom(roomData));
      });
    });
    Promise.all(arrRequest)
      .then(() => {
        dispatch(setSuccessMess("Create room(s) successfully"));
        dispatch(getAllHotels(user?.id));
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        onClose();
        clearForm();
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    onAddRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Modal isOpen={isOpen} toggle={onClose} className={classes.root}>
        <ModalHeader toggle={onClose} className={classes.title}>
          Create room
        </ModalHeader>
        <Form
          role="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <ModalBody>
            {fieldsRoom?.map((field, index) => {
              return (
                <>
                  {/* row title */}
                  <Row
                    className={clsx(classes.boxTitleRoomNumber, classes.row)}
                  >
                    <Col>
                      <p>Room {index + 1} :</p>
                    </Col>
                    {fieldsRoom?.length > 1 && (
                      <Col className={classes.boxDeleteRoom}>
                        <div onClick={() => onRemoveRoom(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </div>
                      </Col>
                    )}
                  </Row>
                  {/*row input  */}
                  <Row className={classes.row}>
                    <Col>
                      <InputTextFieldBorder
                        label="Title"
                        className="mr-3"
                        placeholder="Enter title"
                        inputRef={register(`room.${index}.title`)}
                        errorMessage={
                          errors.room && errors.room[index]?.title?.message
                        }
                      />
                    </Col>
                  </Row>
                  <Row className={classes.row}>
                    <Col>
                      <InputTextFieldBorder
                        label="Description"
                        className="mr-3"
                        placeholder="Enter description"
                        inputRef={register(`room.${index}.description`)}
                        errorMessage={
                          errors.room &&
                          errors.room[index]?.description?.message
                        }
                      />
                    </Col>
                  </Row>
                  <Row className={classes.row}>
                    <Col>
                      <InputSelect
                        label="Tags"
                        className={classes.input}
                        placeholder="Please choose the tags your tour"
                        name={`room.${index}.tags`}
                        control={control}
                        options={tagsOption}
                        isMulti
                        errorMessage={
                          errors.room && errors.room[index]?.tags?.message
                        }
                      />
                    </Col>
                  </Row>
                  <Row className={classes.row}>
                    <Col>
                      <InputTextFieldBorder
                        label="Number of bed"
                        className="mr-3"
                        placeholder="Enter number of bed"
                        inputRef={register(`room.${index}.numberOfBed`)}
                        errorMessage={
                          errors.room &&
                          errors.room[index]?.numberOfBed?.message
                        }
                      />
                    </Col>
                  </Row>
                  <Row className={classes.row}>
                    <Col>
                      <InputTextFieldBorder
                        label="Number of room"
                        className="mr-3"
                        placeholder="Enter number of room"
                        inputRef={register(`room.${index}.numberOfRoom`)}
                        errorMessage={
                          errors.room &&
                          errors.room[index]?.numberOfRoom?.message
                        }
                      />
                    </Col>
                  </Row>
                  <Row className={classes.row}>
                    <Col>
                      <InputTextFieldBorder
                        label="Discount"
                        className="mr-3"
                        placeholder="Enter discount"
                        inputRef={register(`room.${index}.discount`)}
                        errorMessage={
                          errors.room && errors.room[index]?.discount?.message
                        }
                      />
                    </Col>
                  </Row>
                  {/* row images */}
                  <Controller
                    name={`room.${index}.imagesRoom`}
                    control={control}
                    render={({ field }) => (
                      <UploadImage
                        title="Upload your hotel images"
                        files={field.value as unknown as File[]}
                        onChange={(value) => field.onChange(value)}
                        errorMessage={
                          errors.room && errors.room[index]?.imagesRoom?.message
                        }
                      />
                    )}
                  />
                  {/* row price table */}
                  <Row className={classes.row}>
                    <Col>
                      <Card className="card-plain mb-0">
                        <CardHeader id="headingOne" role="tab">
                          <a
                            data-parent="#accordion"
                            data-toggle="collapse"
                            href="#pablo"
                            onClick={() => handleToggleCollapse(index)}
                            className={classes.titlePriceTable}
                          >
                            Price table{" "}
                            <i className="now-ui-icons arrows-1_minimal-down"></i>
                          </a>
                        </CardHeader>
                        <Collapse isOpen={isOpenToggleArr[index]}>
                          <CardBody className={classes.cardBody}>
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
                                      inputRef={register(
                                        `room.${index}.monday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.monday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Tuesday</th>
                                  <td className={classes.tdPriceInput}>
                                    <InputTextField
                                      inputRef={register(
                                        `room.${index}.tuesday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.tuesday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Wednesday</th>
                                  <td className={classes.tdPriceInput}>
                                    <InputTextField
                                      inputRef={register(
                                        `room.${index}.wednesday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.wednesday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Thursday</th>
                                  <td className={classes.tdPriceInput}>
                                    <InputTextField
                                      inputRef={register(
                                        `room.${index}.thursday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.thursday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Friday</th>
                                  <td className={classes.tdPriceInput}>
                                    <InputTextField
                                      inputRef={register(
                                        `room.${index}.friday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.friday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Saturday</th>
                                  <td className={classes.tdPriceInput}>
                                    <InputTextField
                                      inputRef={register(
                                        `room.${index}.saturday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.saturday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Sunday</th>
                                  <td className={classes.tdPriceInput}>
                                    <InputTextField
                                      inputRef={register(
                                        `room.${index}.sunday`
                                      )}
                                      errorMessage={
                                        errors.room &&
                                        errors.room[index]?.sunday?.message
                                      }
                                    />
                                    &nbsp;VND
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </CardBody>
                        </Collapse>
                      </Card>
                    </Col>
                  </Row>
                </>
              );
            })}
            <Row className={classes.row}>
              <Col className={classes.boxClickAdd} onClick={onAddRoom}>
                <FontAwesomeIcon icon={faListCheck} />
                Click add to room
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

export default PopupAddOrEditHotel;
