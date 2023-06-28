import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faCaretDown,
  faSearch,
  faPlus,
  faCircleCheck,
  faCircleMinus,
  faHourglass,
  faCircleInfo,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";
import {
  Row,
  Table,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Collapse,
} from "reactstrap";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import PopupAddOrEditHotel from "./PopupAddOrEditHotel";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import PopupAddRoom from "./PopupAddRoom";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { RoomService } from "services/enterprise/room";
import { HotelService } from "services/enterprise/hotel";
import { getAllHotels } from "redux/reducers/Enterprise/actionTypes";
import PopupConfirmWarning from "components/Popup/PopupConfirmWarning";
import { IHotel } from "models/enterprise";
import { getAllHotels as getAllHotelsOfNormal } from "redux/reducers/Normal/actionTypes";
import PopupEditRoomInformation from "./PopupEditRoomInformation";
import PopupEditRoomPrice from "./PopupEditRoomPrice";
import SearchNotFound from "components/SearchNotFound";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PopupAddOrEditRoomOtherPrice from "./PopupAddOrEditRoomOtherPrice";
import { EActiveNav } from "..";

interface SearchData {
  name?: string;
}
interface Props {
  onChangeTabCreate?: (type: EActiveNav) => void;
  handleHotelEdit?: (
    currentTarget: any,
    item: IHotel,
    type: EActiveNav
  ) => void;
}
// eslint-disable-next-line react/display-name
const Hotel = memo(({ onChangeTabCreate, handleHotelEdit }: Props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReducerType) => state.user);
  const { allHotels } = useSelector((state: ReducerType) => state.enterprise);

  const [subTable, setSubTable] = useState([]);
  const [hotelAction, setHotelAction] = useState<IHotel>();
  const [hotelEdit, setHotelEdit] = useState<IHotel>(null);
  const [hotelStop, setHotelStop] = useState<any>(null);
  const [hotelDelete, setHotelDelete] = useState<IHotel>(null);
  const [openPopupCreateHotel, setOpenPopupCreateHotel] = useState(false);
  const [openPopupConfirmStop, setOpenPopupConfirmStop] = useState(false);
  const [editRoomInformation, setEditRoomInformation] = useState(null);
  const [openPopupEditRoomInformation, setOpenPopupEditRoomInformation] =
    useState(null);
  const [editRoomPrice, setEditRoomPrice] = useState(null);
  const [openPopupEditRoomPrice, setOpenPopupEditRoomPrice] = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [openPopupDeleteRoom, setOpenPopupDeleteRoom] = useState(null);
  const [roomStop, setRoomStop] = useState(null);
  const [openPopupConfirmStopRoom, setOpenPopupConfirmStopRoom] =
    useState(false);
  const [listHotels, setListHotels] = useState([]);
  const [modalOthePrice, setModalOtherPrice] = useState({
    isOpen: false,
    roomId: null,
  });

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().notRequired(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, getValues, handleSubmit, reset, watch } =
    useForm<SearchData>({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

  const [modalCreateRoom, setModalCreateRoom] = useState({
    isOpen: false,
    hotelId: null,
  });
  const [isOpenToggleArr, setIsOpenToggleArr] = useState([]);

  const onTogglePopupCreateHotel = () => {
    setOpenPopupCreateHotel(!openPopupCreateHotel);
    setHotelEdit(null);
  };

  useEffect(() => {
    const tempSubTable = [];
    allHotels.map((item) => {
      tempSubTable.push({
        allRooms: [],
        isCallGet: false,
      });
    });
    setSubTable(tempSubTable);
  }, [allHotels, dispatch]);

  const onOpenModalCreateRoom = (hotelId) => {
    setModalCreateRoom({
      isOpen: true,
      hotelId: hotelId,
    });
  };

  const onCloseModalCreateRoom = () => {
    setModalCreateRoom({
      isOpen: false,
      hotelId: null,
    });
  };

  const handleAction = (currentTarget: any, item: IHotel) => {
    setHotelAction(item);
  };
  const onAction = (currentTarget: any, item: IHotel) => {
    onTogglePopupCreateHotel();
    setHotelEdit(item);
  };

  const onShowConfirm = () => {
    if (!hotelAction) return;
    setHotelDelete(hotelAction);
  };

  const onClosePopupConfirmDelete = () => {
    if (!hotelDelete) return;
    setHotelDelete(null);
  };

  const onYesDelete = () => {
    if (!hotelDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    HotelService.deleteHotel(hotelDelete?.id)
      .then(() => {
        dispatch(getAllHotels(user?.id));
        dispatch(getAllHotelsOfNormal());
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const handleToggleSubTable = (hotel, index) => {
    if (subTable[index]?.isCallGet) {
      const newIsOpen = [...isOpenToggleArr];
      newIsOpen[index] = !newIsOpen[index];
      setIsOpenToggleArr(newIsOpen);
    } else {
      dispatch(setLoading(true));
      RoomService.getAllRooms(hotel.id)
        .then((res) => {
          const _tempSubTable = [];
          subTable.map((item, indexSub) => {
            if (index === indexSub) {
              _tempSubTable.push({
                allRooms: res.data,
                isCallGet: true,
              });
            } else {
              _tempSubTable.push(item);
            }
          });
          setSubTable(_tempSubTable);
          const newIsOpen = [...isOpenToggleArr];
          newIsOpen[index] = !newIsOpen[index];
          setIsOpenToggleArr(newIsOpen);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  const onToggleConfirmStop = () => {
    setOpenPopupConfirmStop(!openPopupConfirmStop);
  };

  const onTemporarilyStopWorking = (e, item) => {
    setHotelStop(item);
    onToggleConfirmStop();
  };

  const onYesStopWorking = () => {
    if (!hotelStop) return;
    onToggleConfirmStop();
    dispatch(setLoading(true));
    HotelService.temporarilyStopWorking(hotelStop?.id)
      .then(() => {
        dispatch(getAllHotels(user?.id));
        dispatch(getAllHotelsOfNormal());
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onWorkAgain = (e, item) => {
    dispatch(setLoading(true));
    HotelService.workAgain(item.id)
      .then(() => {
        dispatch(getAllHotels(user?.id));
        dispatch(getAllHotelsOfNormal());
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onTogglePopupEditRoomInformation = () => {
    setOpenPopupEditRoomInformation(!openPopupEditRoomInformation);
  };

  const onEditRoomInformation = (e: any, item: any) => {
    setEditRoomInformation(item);
    onTogglePopupEditRoomInformation();
  };
  const onTogglePopupEditRoomPrice = () => {
    setOpenPopupEditRoomPrice(!openPopupEditRoomPrice);
  };
  const onEditRoomPrice = (e: any, item: any) => {
    setEditRoomPrice(item);
    onTogglePopupEditRoomPrice();
  };

  const onTogglePopupDeleteRoom = () => {
    setOpenPopupDeleteRoom(!openPopupDeleteRoom);
  };

  const onDeleteRoom = (e: any, item: any) => {
    setDeleteRoom(item);
    onTogglePopupDeleteRoom();
  };

  const onOpenModalOtherPrice = (e: any, item: any) => {
    setModalOtherPrice({
      isOpen: true,
      roomId: item?.id,
    });
  };
  const onCloseModalOtherPrice = () => {
    setModalOtherPrice({
      isOpen: false,
      roomId: null,
    });
  };

  const onYesDeleteRoom = () => {
    dispatch(setLoading(true));
    RoomService.deleteRoom(deleteRoom?.id)
      .then((res) => {
        dispatch(setSuccessMess("Delete room successfully"));
        onTogglePopupDeleteRoom();
        dispatch(getAllHotels(user?.id));
        dispatch(getAllHotelsOfNormal());
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const onTogglePopupConfirmStopWorkingRoom = () => {
    setOpenPopupConfirmStopRoom(!openPopupConfirmStopRoom);
  };
  const onTemporarilyStopWorkingRoom = (e: any, item: any) => {
    setRoomStop(item);
    onTogglePopupConfirmStopWorkingRoom();
  };

  const onYesStopWorkingRoom = () => {
    if (!roomStop) return;
    onTogglePopupConfirmStopWorkingRoom();
    dispatch(setLoading(true));
    RoomService.temporarilyStopWorkingRoom(roomStop?.id)
      .then(() => {
        dispatch(getAllHotels(user?.id));
        dispatch(getAllHotelsOfNormal());
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onWorkAgainRoom = (e, item) => {
    dispatch(setLoading(true));
    RoomService.workAgain(item.id)
      .then(() => {
        dispatch(getAllHotels(user?.id));
        dispatch(getAllHotelsOfNormal());
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  const watchSearch = watch("name");

  const handleKeyPress = (e) => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      if (watchSearch === "") {
        setListHotels(allHotels);
      } else {
        handleSearch();
      }
    }
  };

  const handleSearch = () => {
    dispatch(setLoading(true));
    HotelService.searchHotel(user?.id, getValues("name"))
      .then((res) => {
        setListHotels(res?.data);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  // useEffect(() => {
  //     setListHotels(allHotels);
  // },[dispatch, allHotels])

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>Hotels</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <div className={classes.boxInputSearch}>
            <InputTextFieldBorder
              placeholder="Search hotels"
              startIcon={<FontAwesomeIcon icon={faSearch} />}
              className={classes.inputSearch}
              onKeyPress={handleKeyPress}
              inputRef={register("name")}
            />
          </div>
          <Button
            btnType={BtnType.Primary}
            onClick={() => onChangeTabCreate(EActiveNav.Create_Hotel_Active)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create
          </Button>
        </Row>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row">#</th>
              <th>Name</th>
              <th>Check in time</th>
              <th>Check out time</th>
              <th>State</th>
              <th className={classes.colRoom}>Room</th>
              <th className={classes.colActionStop}>Action stop</th>
              <th className={classes.colAction}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listHotels &&
              listHotels?.map((item, index) => {
                return (
                  <>
                    <tr key={item?.id}>
                      <th scope="row">{index}</th>
                      <td>
                        <a
                          href={`/listHotel/:${item?.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className={classes.hotelName}
                        >
                          {item.name}
                        </a>
                      </td>
                      <td>{item.checkInTime}</td>
                      <td>{item.checkOutTime}</td>
                      <td>
                        {!item?.isTemporarilyStopWorking ? (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className={classes.iconActiveTour}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCircleMinus}
                            className={classes.iconStopTour}
                          />
                        )}
                      </td>
                      <td
                        onClick={() => handleToggleSubTable(item, index)}
                        className={clsx("text-center", classes.showRoomBtn)}
                      >
                        Show room {"  "}
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          className={classes.iconAction}
                        />
                      </td>
                      <td className={classes.colActionStop}>
                        {!item?.isTemporarilyStopWorking ? (
                          <Button
                            className="btn-icon"
                            btnType={BtnType.Secondary}
                            size="sm"
                            type="button"
                            onClick={(e) => onTemporarilyStopWorking(e, item)}
                          >
                            <FontAwesomeIcon icon={faHourglass} />
                          </Button>
                        ) : (
                          <Button
                            className="btn-icon"
                            color="info"
                            size="sm"
                            type="button"
                            onClick={(e) => onWorkAgain(e, item)}
                          >
                            <FontAwesomeIcon icon={faHourglass} />
                          </Button>
                        )}
                      </td>
                      <td className="text-center">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            color="default"
                            data-toggle="dropdown"
                            href="#pablo"
                            id="navbarDropdownMenuLink1"
                            nav
                            onClick={(event) => {
                              handleAction(event, item);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faCaretDown}
                              className={classes.iconAction}
                            />
                          </DropdownToggle>
                          <DropdownMenu
                            aria-labelledby="navbarDropdownMenuLink1"
                            className={classes.dropdownMenu}
                          >
                            <DropdownItem
                              className={classes.dropdownItem}
                              onClick={(e) =>
                                handleHotelEdit(
                                  e,
                                  item,
                                  EActiveNav.Create_Tour_Active
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faPen} />
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              className={classes.dropdownItem}
                              onClick={() => onOpenModalCreateRoom(item?.id)}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                              Add room
                            </DropdownItem>
                            <DropdownItem
                              className={clsx(
                                classes.dropdownItem,
                                classes.itemDelete
                              )}
                              onClick={onShowConfirm}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={10} className={classes.subTable}>
                        <Collapse isOpen={isOpenToggleArr[index]}>
                          <Table>
                            <thead className={classes.headerSubTable}>
                              <tr>
                                <th>#</th>
                                <th>Room title</th>
                                <th>Number of bed</th>
                                <th>Number of room</th>
                                <th>State</th>
                                <th className={classes.colActionStop}>
                                  Action stop
                                </th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody className={classes.bodySubTable}>
                              {subTable[index]?.allRooms?.map(
                                (itemSubtable, indexSub) => (
                                  <tr key={indexSub}>
                                    <td>{indexSub}</td>
                                    <td>{itemSubtable?.title}</td>
                                    <td>{itemSubtable?.numberOfBed}</td>
                                    <td>{itemSubtable?.numberOfRoom}</td>
                                    <td>
                                      {!itemSubtable?.isTemporarilyStopWorking ? (
                                        <FontAwesomeIcon
                                          icon={faCircleCheck}
                                          className={classes.iconActiveTour}
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          icon={faCircleMinus}
                                          className={classes.iconStopTour}
                                        />
                                      )}
                                    </td>
                                    <td className={classes.colActionStop}>
                                      {!itemSubtable?.isTemporarilyStopWorking ? (
                                        <Button
                                          className="btn-icon"
                                          btnType={BtnType.Secondary}
                                          size="sm"
                                          type="button"
                                          onClick={(e) =>
                                            onTemporarilyStopWorkingRoom(
                                              e,
                                              itemSubtable
                                            )
                                          }
                                        >
                                          <FontAwesomeIcon icon={faHourglass} />
                                        </Button>
                                      ) : (
                                        <Button
                                          className="btn-icon"
                                          color="info"
                                          size="sm"
                                          type="button"
                                          onClick={(e) =>
                                            onWorkAgainRoom(e, itemSubtable)
                                          }
                                        >
                                          <FontAwesomeIcon icon={faHourglass} />
                                        </Button>
                                      )}
                                    </td>
                                    <td>
                                      <UncontrolledDropdown>
                                        <DropdownToggle
                                          color="default"
                                          data-toggle="dropdown"
                                          href="#pablo"
                                          id="navbarDropdownMenuLink1"
                                          nav
                                          onClick={(e) => e.preventDefault()}
                                        >
                                          <FontAwesomeIcon
                                            icon={faCaretDown}
                                            className={classes.iconAction}
                                          />
                                        </DropdownToggle>
                                        <DropdownMenu
                                          aria-labelledby="navbarDropdownMenuLink1"
                                          className={classes.dropdownMenu}
                                        >
                                          <DropdownItem
                                            className={classes.dropdownItem}
                                            onClick={(e) =>
                                              onEditRoomInformation(
                                                e,
                                                itemSubtable
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faCircleInfo}
                                            />
                                            Edit information
                                          </DropdownItem>
                                          <DropdownItem
                                            className={classes.dropdownItem}
                                            onClick={(e) =>
                                              onEditRoomPrice(e, itemSubtable)
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faMoneyCheckDollar}
                                            />
                                            Edit price
                                          </DropdownItem>
                                          <DropdownItem
                                            className={classes.dropdownItem}
                                            onClick={(e) =>
                                              onOpenModalOtherPrice(
                                                e,
                                                itemSubtable
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faMoneyCheckDollar}
                                            />
                                            Room other price
                                          </DropdownItem>
                                          <DropdownItem
                                            className={clsx(
                                              classes.dropdownItem,
                                              classes.itemDelete
                                            )}
                                            onClick={(e) =>
                                              onDeleteRoom(e, itemSubtable)
                                            }
                                          >
                                            <FontAwesomeIcon icon={faTrash} />
                                            Delete
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </UncontrolledDropdown>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </Collapse>
                      </td>
                    </tr>
                  </>
                );
              })}
            {!listHotels?.length && (
              <tr>
                <td scope="row" colSpan={8}>
                  <SearchNotFound />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <PopupAddOrEditHotel
          isOpen={openPopupCreateHotel}
          onClose={onTogglePopupCreateHotel}
          toggle={onTogglePopupCreateHotel}
          itemEdit={hotelEdit}
        />
        <PopupConfirmDelete
          title="Are you sure delete this hotel ?"
          isOpen={!!hotelDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
        <PopupAddRoom
          hotelId={modalCreateRoom.hotelId}
          isOpen={modalCreateRoom.isOpen}
          onClose={onCloseModalCreateRoom}
        />
        <PopupEditRoomInformation
          isOpen={openPopupEditRoomInformation}
          onClose={onTogglePopupEditRoomInformation}
          itemEdit={editRoomInformation}
        />
        <PopupEditRoomPrice
          isOpen={openPopupEditRoomPrice}
          onClose={onTogglePopupEditRoomPrice}
          itemEdit={editRoomPrice}
        />
        <PopupConfirmDelete
          title="Are you sure delete this room ?"
          isOpen={openPopupDeleteRoom}
          onClose={onTogglePopupDeleteRoom}
          toggle={onTogglePopupDeleteRoom}
          onYes={onYesDeleteRoom}
        />
        <PopupConfirmWarning
          title="Are you sure stop working this hotel ?"
          isOpen={openPopupConfirmStop}
          onClose={onToggleConfirmStop}
          toggle={onToggleConfirmStop}
          onYes={onYesStopWorking}
        />
        <PopupConfirmWarning
          title="Are you sure stop working this room?"
          isOpen={openPopupConfirmStopRoom}
          onClose={onTogglePopupConfirmStopWorkingRoom}
          toggle={onTogglePopupConfirmStopWorkingRoom}
          onYes={onYesStopWorkingRoom}
        />
        <PopupAddOrEditRoomOtherPrice
          isOpen={modalOthePrice?.isOpen}
          onClose={onCloseModalOtherPrice}
          roomId={modalOthePrice?.roomId}
        />
      </div>
    </>
  );
});

export default Hotel;
