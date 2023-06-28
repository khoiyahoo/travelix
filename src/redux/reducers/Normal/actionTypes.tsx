import { Tour } from "models/tour";

// tour
export const GET_NORMAL_TOURS_REQUEST = "GET_NORMAL_TOURS_REQUEST";
export const SET_NORMAL_TOURS_REDUCER = "SET_NORMAL_TOURS_REDUCER";
// hotel
export const GET_NORMAL_HOTELS_REQUEST = "GET_NORMAL_HOTELS_REQUEST";
export const SET_NORMAL_HOTELS_REDUCER = "SET_NORMAL_HOTELS_REDUCER";
// room bill confirm
export const GET_ROOM_BILL_CONFIRM_REQUEST = "GET_ROOM_BILL_CONFIRM_REQUEST";
export const SET_ROOM_BILL_CONFIRM_REDUCER = "SET_ROOM_BILL_CONFIRM_REDUCER";

//tour bill
export const GET_TOUR_BILLS_REQUEST = "GET_TOUR_BILLS_REQUEST";
export const SET_TOUR_BILLS_REDUCER = "SET_TOUR_BILLS_REDUCER";
//HOTEL BILL
export const GET_ROOM_BILLS_REQUEST = "GET_ROOM_BILLS_REQUEST";
export const SET_ROOM_BILLS_REDUCER = "SET_ROOM_BILLS_REDUCER";
// comment tour
export const GET_TOUR_COMMENT_REQUEST = "GET_TOUR_COMMENT_REQUEST";
export const SET_TOUR_COMMENT_REDUCER = "SET_TOUR_COMMENT_REDUCER";

//CONFIRM BOOK TOUR
export const GET_CONFIRM_BOOK_TOUR_REQUEST = "GET_CONFIRM_BOOK_TOUR_REQUEST";
export const SET_CONFIRM_BOOK_TOUR_REDUCER = "SET_CONFIRM_BOOK_TOUR_REDUCER";
//CONFIRM BOOK TOUR REVIEW
export const GET_CONFIRM_BOOK_TOUR_REVIEW_REQUEST =
  "GET_CONFIRM_BOOK_TOUR_REVIEW_REQUEST";
export const SET_CONFIRM_BOOK_TOUR_REVIEW_REDUCER =
  "SET_CONFIRM_BOOK_TOUR_REVIEW_REDUCER";
//CONFIRM BOOK ROOM
export const GET_CONFIRM_BOOK_ROOM_REQUEST = "GET_CONFIRM_BOOK_ROOM_REQUEST";
export const SET_CONFIRM_BOOK_ROOM_REDUCER = "SET_CONFIRM_BOOK_ROOM_REDUCER";
//GET USER INFORMATION
export const GET_USER_INFORMATION_BOOK_ROOM = "GET_USER_INFORMATION_BOOK_ROOM";
export const SET_USER_INFORMATION_BOOK_ROOM_REDUCER =
  "SET_USER_INFORMATION_BOOK_ROOM_REDUCER";
// ********** tour **********

//GET SELECT CHANGE DATE//
export const GET_SELECT_CHANGE_DATE = "GET_SELECT_CHANGE_DATE";
export const SET_SELECT_CHANGE_DATE_REDUCER = "SET_SELECT_CHANGE_DATE_REDUCER";
export const getAllTours = () => {
  return {
    type: GET_NORMAL_TOURS_REQUEST,
  };
};

export const setAllToursReducer = (data: any) => {
  return {
    type: SET_NORMAL_TOURS_REDUCER,
    data: data,
  };
};

// ********** hotel **********
export const getAllHotels = () => {
  return {
    type: GET_NORMAL_HOTELS_REQUEST,
  };
};

export const setAllHotelsReducer = (data: any) => {
  return {
    type: SET_NORMAL_HOTELS_REDUCER,
    data: data,
  };
};

// ********** room bill confirm **********
export const getRoomBillConfirm = () => {
  return {
    type: GET_ROOM_BILL_CONFIRM_REQUEST,
  };
};

export const setRoomBillConfirmReducer = (data: any) => {
  return {
    type: SET_ROOM_BILL_CONFIRM_REDUCER,
    data: data,
  };
};

// ********** TOUR bill **********
export const getAllTourBills = (userId: number) => {
  return {
    type: GET_TOUR_BILLS_REQUEST,
    userId,
  };
};

export const setAllTourBillsReducer = (data: any) => {
  return {
    type: SET_TOUR_BILLS_REDUCER,
    data: data,
  };
};

// ********** hotel bill **********
export const getAllRoomBills = (userId: number) => {
  return {
    type: GET_ROOM_BILLS_REQUEST,
    userId,
  };
};

export const setAllRoomBillsReducer = (data: any) => {
  return {
    type: SET_ROOM_BILLS_REDUCER,
    data: data,
  };
};
// ********** confirm book tour  **********
export const getConfirmBookTour = () => {
  return {
    type: GET_CONFIRM_BOOK_TOUR_REQUEST,
  };
};

export const setConfirmBookTourReducer = (data: any) => {
  return {
    type: SET_CONFIRM_BOOK_TOUR_REDUCER,
    data: data,
  };
};

//****** confirm book tour reivew */
export const getConfirmBookTourReview = () => {
  return {
    type: GET_CONFIRM_BOOK_TOUR_REVIEW_REQUEST,
  };
};

export const setConfirmBookTourReviewReducer = (data: any) => {
  return {
    type: SET_CONFIRM_BOOK_TOUR_REVIEW_REDUCER,
    data: data,
  };
};

// ********** confirm book room **********
export const getConfirmBookRoom = () => {
  return {
    type: GET_CONFIRM_BOOK_ROOM_REQUEST,
  };
};

export const setConfirmBookRoomReducer = (data: any) => {
  return {
    type: SET_CONFIRM_BOOK_ROOM_REDUCER,
    data: data,
  };
};

//****** get information user */
export const getUserInformationBookRoom = () => {
  return {
    type: GET_USER_INFORMATION_BOOK_ROOM,
  };
};

export const setUserInformationBookRoomReducer = (data: any) => {
  return {
    type: SET_USER_INFORMATION_BOOK_ROOM_REDUCER,
    data: data,
  };
};

//****** get change date */
export const getSelectChangeDate = (data: any) => {
  return {
    type: GET_SELECT_CHANGE_DATE,
    data: data,
  };
};

export const setSelectChangeDateReducer = (data: any) => {
  return {
    type: SET_SELECT_CHANGE_DATE_REDUCER,
    data: data,
  };
};
