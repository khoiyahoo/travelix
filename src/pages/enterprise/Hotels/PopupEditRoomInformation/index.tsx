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
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { ImageService } from "services/image";
import { RoomService } from "services/enterprise/room";
import { EditRoomInformation } from "models/room";
import { OptionItem } from "models/general";
import InputSelect from "components/common/inputs/InputSelects";
import { tagsOption } from "configs/constants";
import { getAllHotels as getAllHotelsOfNormal } from "redux/reducers/Normal/actionTypes";
import { getAllHotels } from "redux/reducers/Enterprise/actionTypes";
import { ReducerType } from "redux/reducers";

const FILE_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const PHOTO_SIZE = 10000000000; // bytes
const MAX_IMAGES = 9;
const MIN_IMAGES = 3;
export interface RoomForm {
  title: string;
  description: string;
  imagesRoom: string[];
  tags: OptionItem<string>[];
  numberOfBed: number;
  numberOfRoom: number;
}

interface Props extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemEdit: EditRoomInformation;
}

// eslint-disable-next-line react/display-name
const PopupEditRoomInformation = memo((props: Props) => {
  const dispatch = useDispatch();
  const { isOpen, onClose, itemEdit } = props;
  const { user } = useSelector((state: ReducerType) => state.user);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required("Title is required"),
      description: yup.string().required("Description is required"),
      tags: yup
        .array(
          yup.object({
            name: yup.string().required("Tags is required."),
          })
        )
        .required("Tags is required.")
        .min(1, "Tags is required."),
      numberOfBed: yup
        .number()
        .typeError("Number of bed must be a number")
        .required("Number of bed is required"),
      numberOfRoom: yup
        .number()
        .typeError("Number of room must be a number")
        .required("Number of room is required"),
      // imagesRoom: yup.mixed().test("required", "Please select images", (value) => {
      //   return value && value.length;
      // }),
      imagesRoom: yup.array().notRequired(),
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

  const clearForm = () => {
    reset({
      title: "",
      description: "",
      tags: [],
      numberOfBed: null,
      numberOfRoom: null,
      imagesRoom: [],
    });
  };
  const _onSubmit = async (data: RoomForm) => {
    dispatch(setLoading(true));
    const uploader = [];
    await data?.imagesRoom?.map(async (file) => {
      const formData: any = new FormData();
      formData.append("file", file);
      formData.append("tags", "codeinfuse, medium, gist");
      formData.append("upload_preset", "my-uploads");
      formData.append("api_key", "859398113752799");
      formData.append("timestamp", Date.now() / 1000 / 0);
      uploader.push(ImageService.uploadImage(formData));
    });

    await Promise.all(uploader)
      .then((images) => {
        if (itemEdit) {
          RoomService.updateInformation(itemEdit?.id, {
            title: data?.title,
            description: data?.description,
            tags: data.tags.map((it) => it.name),
            images: images,
            numberOfBed: data?.numberOfBed,
            numberOfRoom: data?.numberOfRoom,
          })
            .then(() => {
              dispatch(getAllHotelsOfNormal());
              dispatch(getAllHotels(user?.id));
              dispatch(setSuccessMess("Update hotel successfully"));
            })
            .catch((e) => {
              dispatch(setErrorMess(e));
            });
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        onClose();
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    if (itemEdit) {
      reset({
        title: itemEdit.title,
        description: itemEdit.description,
        tags: itemEdit.tags.map((it) => ({ name: it })),
        numberOfBed: itemEdit.numberOfBed,
        numberOfRoom: itemEdit.numberOfRoom,
        imagesRoom: itemEdit.images,
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
                  label="Title"
                  className="mr-3"
                  placeholder="Enter title"
                  inputRef={register("title")}
                  errorMessage={errors.title?.message}
                />
              </Col>
            </Row>
            <Row className={classes.row}>
              <Col>
                <InputTextFieldBorder
                  label="Description"
                  className="mr-3"
                  placeholder="Enter description"
                  inputRef={register("description")}
                  errorMessage={errors.description?.message}
                />
              </Col>
            </Row>
            <Row className={classes.row}>
              <Col>
                <InputSelect
                  label="Tags"
                  className={classes.input}
                  placeholder="Please choose the tags your tour"
                  name="tags"
                  control={control}
                  options={tagsOption}
                  isMulti
                  errorMessage={errors.tags?.message}
                />
              </Col>
            </Row>
            <Row className={classes.row}>
              <Col>
                <InputTextFieldBorder
                  label="Number of bed"
                  className="mr-3"
                  placeholder="Enter number of bed"
                  inputRef={register("numberOfBed")}
                  errorMessage={errors.numberOfBed?.message}
                />
              </Col>
            </Row>
            <Row className={classes.row}>
              <Col>
                <InputTextFieldBorder
                  label="Number of room"
                  className="mr-3"
                  placeholder="Enter number of room"
                  inputRef={register("numberOfRoom")}
                  errorMessage={errors.numberOfRoom?.message}
                />
              </Col>
            </Row>
            {/* row images */}
            <Controller
              name={"imagesRoom"}
              control={control}
              render={({ field }) => (
                <UploadImage
                  title="Upload your hotel images"
                  files={field.value as unknown as File[]}
                  onChange={(value) => field.onChange(value)}
                  errorMessage={errors.imagesRoom?.message}
                />
              )}
            />
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

export default PopupEditRoomInformation;
