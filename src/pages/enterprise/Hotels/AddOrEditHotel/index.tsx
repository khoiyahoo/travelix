import React, { useMemo, memo, useEffect } from "react";
import {
  Row,
  Form,
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import InputTextArea from "components/common/inputs/InputTextArea";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import InputTags from "components/common/inputs/InputTags";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UploadImage from "components/UploadImage";
import { HotelService } from "services/enterprise/hotel";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { ImageService } from "services/image";
import { ReducerType } from "redux/reducers";
import { IHotel } from "models/enterprise";
import { getAllHotels as getAllHotelsOfNormal } from "redux/reducers/Normal/actionTypes";
import { getAllHotels } from "redux/reducers/Enterprise/actionTypes";
import InputSelect from "components/common/inputs/InputSelects";
import { tagsOption } from "configs/constants";
import { OptionItem } from "models/general";
import clsx from "clsx";
import CustomSelect from "components/common/CustomSelect";

export interface HotelForm {
  name: string;
  description: string;
  location: string;
  contact: string;
  checkInTime: string;
  checkOutTime: string;
  tags: OptionItem<string>[];
  isTemporarilyStopWorking: boolean;
  imagesHotel: string[];
  creator: number;
}

interface Props {
  itemEdit: IHotel;
}

// eslint-disable-next-line react/display-name
const PopupAddOrEditHotel = memo((props: Props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReducerType) => state.user);
  const { itemEdit } = props;

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required"),
      description: yup.string().required("Description is required"),
      location: yup.string().required("Location is required"),
      contact: yup.string().required("Contact is required"),
      checkInTime: yup.string().required("Check in time is required"),
      checkOutTime: yup.string().required("Check out time is required"),
      tags: yup
        .array(
          yup.object({
            name: yup.string().required("Tags is required."),
          })
        )
        .required("Tags is required.")
        .min(1, "Tags is required."),
      // imagesHotel: yup.mixed().test("required", "Please select images", (value) => {
      //   return value && value.length;
      // }),
      imagesRoom: yup.array().notRequired(),
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<HotelForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      isTemporarilyStopWorking: false,
    },
  });

  const clearForm = () => {
    reset({
      name: "",
      description: "",
      location: "",
      contact: "",
      checkInTime: "",
      checkOutTime: "",
      tags: [],
      isTemporarilyStopWorking: false,
      imagesHotel: [],
    });
  };

  const _onSubmit = async (data: HotelForm) => {
    dispatch(setLoading(true));
    const uploader = [];
    data?.imagesHotel?.map((file) => {
      const formData: any = new FormData();
      formData.append("file", file);
      formData.append("tags", "codeinfuse, medium, gist");
      formData.append("upload_preset", "my-uploads");
      formData.append("api_key", "859398113752799");
      formData.append("timestamp", Date.now() / 1000 / 0);
      uploader.push(ImageService.uploadImage(formData));
    });
    await Promise.all(uploader)
      .then((res) => {
        if (user) {
          if (itemEdit) {
            HotelService.updateHotel(itemEdit?.id, {
              name: data.name,
              description: data.description,
              checkInTime: data.checkInTime,
              checkOutTime: data.checkOutTime,
              location: data.location,
              contact: data.contact,
              tags: data.tags.map((it) => it.name),
              images: res,
            })
              .then(() => {
                dispatch(getAllHotelsOfNormal());
                dispatch(getAllHotels(user?.id));
                dispatch(setSuccessMess("Update hotel successfully"));
              })
              .catch((e) => {
                dispatch(setErrorMess(e));
              });
          } else {
            HotelService.createHotel({
              name: data.name,
              description: data.description,
              checkInTime: data.checkInTime,
              checkOutTime: data.checkOutTime,
              location: data.location,
              contact: data.contact,
              tags: data.tags.map((it) => it.name),
              images: res,
              creator: user?.id,
            })
              .then(() => {
                dispatch(getAllHotelsOfNormal());
                dispatch(getAllHotels(user?.id));
                dispatch(setSuccessMess("Create hotel successfully"));
              })
              .catch((e) => {
                dispatch(setErrorMess(e));
              });
          }
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit.name,
        description: itemEdit.description,
        checkInTime: itemEdit.checkInTime,
        checkOutTime: itemEdit.checkOutTime,
        location: itemEdit.location,
        contact: itemEdit.contact,
        tags: itemEdit.tags.map((it) => ({ name: it })),
        imagesHotel: itemEdit.images,
      });
    }
  }, [reset, itemEdit]);

  useEffect(() => {
    if (!itemEdit) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit]);
  return (
    <>
      <div className={classes.root}>
        <Form
          role="form"
          onSubmit={handleSubmit(_onSubmit)}
          className={classes.form}
        >
          <Row className={clsx(classes.rowHeaderBox, classes.title)}>
            {!itemEdit ? <h3>Create hotel</h3> : <h3>Edit hotel</h3>}
          </Row>
          <Row xs={6} className={classes.row}>
            <Col>
              <InputTextFieldBorder
                label="Name"
                className="mr-3"
                placeholder="Enter name"
                inputRef={register("name")}
                errorMessage={errors.name?.message}
              />
            </Col>
            <Col>
              <InputTextFieldBorder
                label="Location"
                placeholder="Enter location"
                inputRef={register("location")}
                errorMessage={errors.location?.message}
              />
            </Col>
          </Row>
          <Row xs={6} className={classes.row}>
            <Col>
              <InputTextFieldBorder
                label="Check In Time"
                className="mr-3"
                placeholder="Enter check in"
                inputRef={register("checkInTime")}
                errorMessage={errors.checkInTime?.message}
              />
            </Col>
            <Col>
              <InputTextFieldBorder
                label="Check Out Time"
                placeholder="Enter check out"
                inputRef={register("checkOutTime")}
                errorMessage={errors.checkOutTime?.message}
              />
            </Col>
          </Row>
          <Row xs={6} className={classes.row}>
            <Col>
              <InputTextFieldBorder
                label="Contact"
                placeholder="Enter contact"
                inputRef={register("contact")}
                errorMessage={errors.contact?.message}
              />
            </Col>
            <Col>
              <CustomSelect
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
          <Col>
            <InputTextArea
              label="Description"
              placeholder="Enter description"
              inputRef={register("description")}
              errorMessage={errors.description?.message}
            />
          </Col>
          <Controller
            name="imagesHotel"
            control={control}
            render={({ field }) => (
              <UploadImage
                title="Upload your hotel images"
                files={field.value as unknown as File[]}
                onChange={(value) => field.onChange(value)}
                errorMessage={errors.imagesHotel?.message}
              />
            )}
          />
        </Form>
      </div>
    </>
  );
});

export default PopupAddOrEditHotel;
