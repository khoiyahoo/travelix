import { put, takeLatest, call } from "redux-saga/effects";
import {
  GET_HOTELS_REQUEST,
  setAllHotelsReducer,
} from "redux/reducers/Enterprise/actionTypes";
import { setLoading } from "redux/reducers/Status/actionTypes";
import { HotelService } from "services/enterprise/hotel";

function* requestGetAllHotels(data: { type: string; userId: number }) {
  try {
    yield put(setLoading(true));
    // const hotels = yield call(HotelService.getHotels, data.userId);
    // yield put(setAllHotelsReducer(hotels.data));
  } catch (e: any) {
    console.log(e);
  } finally {
    yield put(setLoading(false));
  }
}

function* getAllHotels() {
  yield takeLatest(GET_HOTELS_REQUEST, requestGetAllHotels);
}

export default getAllHotels;
