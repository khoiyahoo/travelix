import { put, takeLatest, call } from "redux-saga/effects";
import {
  GET_TOURS_REQUEST,
  setAllToursReducer,
} from "redux/reducers/Enterprise/actionTypes";
import { setLoading } from "redux/reducers/Status/actionTypes";
import { TourService } from "services/enterprise/tour";

function* requestGetAllTours(data: { type: string; userId: number }) {
  try {
    yield put(setLoading(true));
    // const tours = yield call(TourService.getTours, data.userId);
    // yield put(setAllToursReducer(tours.data));
  } catch (e: any) {
    console.log(e);
  } finally {
    yield put(setLoading(false));
  }
}

function* getAllHotels() {
  yield takeLatest(GET_TOURS_REQUEST, requestGetAllTours);
}

export default getAllHotels;
