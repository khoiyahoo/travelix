import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export const API = {
  CONFIG: {
    DEFAULT: "/v1.0/config",
  },
  TRANSLATION: {
    DEFAULT: "/v1.0/translation/{{lng}}/{{ns}}",
  },
  AUTH: {
    ME: "/v1.0/user/me",
    LOGIN: "/v1.0/user/login",
    LOGIN_SOCIAL: "/v1.0/user/login/social",
    SEND_VERIFY_SIGNUP: "/v1.0/user/verify-signup",
    RESEND_VERIFY_SIGNUP: "/v1.0/user/re-send-email-verify-signup",
    REGISTER: "/v1.0/user/register",
    PROFILE: "/v1.0/user/profile/:id",
    ACTIVE: "/v1.0/user/active",
    SEND_EMAIL_FORGOT_PASSWORD: "/v1.0/user/send-email-forgot-password",
    FORGOT_PASSWORD: "/v1.0/user/change-forgot-password",
    CHECK_ISVALID_CODE: "/v1.0/user/check-isvalid-code",
    CHECK_EMPTY_PASSWORD: "/v1.0/user/check-empty-password",
    CHANGE_LANGUAGE: "/v1.0/user/change-language",
  },
  USER: {
    DEFAULT: "/v1.0/user",
    PAYMENT_INFO: "/v1.0/user/payment-info",
    UPDATE_PAYMENT_INFO: "/v1.0/user/update-payment-info",
    UPDATE_PROFILE: "/v1.0/user/update-profile/:id",
    CHANGE_PASSWORD: "/v1.0/user/change-password",
    UPDATE_AVATAR: "/v1.0/user/update-avatar",
    UPDATE_BANK: "/v1.0/user/bank/:id",
  },
  NORMAL: {
    TOUR: {
      DEFAULT: "/v1.0/tour",
      DETAIL_TOUR: "/v1.0/tour/:id",
    },
    STAY: {
      DEFAULT: "/v1.0/stay",
      DETAIL_STAY: "/v1.0/stay/:id",
    },
    TOUR_SCHEDULE: {
      DEFAULT: "/v1.0/tour-schedule",
      GET_TOUR_SCHEDULE: "/v1.0/tour-schedule/:tourId",
    },
    EVENT: {
      DEFAULT: "/v1.0/event",
      DETAIL_EVENT: "/v1.0/event/:id",
      FIND_CODE: "/v1.0/event/match/:code",
    },
    VOUCHER: {
      DEFAULT: "/v1.0/voucher",
      DETAIL_VOUCHER: "/v1.0/voucher/:id",
    },
    COMMENT: {
      TOUR_COMMENT: {
        GET_COMMENT: "/v1.0/tour-comment/get-tours-comment/:id",
        CREATE: "/v1.0/tour-comment/create",
        UPDATE: "/v1.0/tour-comment/update/:id",
        DELETE: "/v1.0/tour-comment/delete/:id",
        REPLY: "/v1.0/tour-comment/reply/:id",
      },
      HOTEL_COMMENT: {
        GET_COMMENT: "/v1.0/hotel-comment/get-hotels-comment/:id",
        CREATE: "/v1.0/hotel-comment/create",
        UPDATE: "/v1.0/hotel-comment/update/:id",
        DELETE: "/v1.0/hotel-comment/delete/:id",
        REPLY: "/v1.0/hotel-comment/reply/:id",
      },
      DEFAULT: "/v1.0/comment",
      UPDATE_COMMENT: "/v1.0/comment/:id",
      DELETE_COMMENT: "/v1.0/comment/:id",
      REPLY: "/v1.0/comment/reply",
      UPDATE_REPLY: "/v1.0/comment/reply/:id",
    },
    ROOMBILL: {
      DEFAULT: "/v1.0/room-bill",
      CREATE: "/v1.0/room-bill/",
      UPDATE: "/v1.0/room-bill/:id",
      GET_LASTED_ROOM_BILL: "/v1.0/room-bill/latest/:id",
      RESCHEDULE: "/v1.0/room-bill/re-schedule/:id",
      CANCEL_BOOK_ROOM: "/v1.0/room-bill/cancel/:id",

      GET_ALL_ROOMBILL: "/v1.0/room-bill/get-all-user-room-bills/:id",
      VERIFY_BOOKROOM: "/v1.0/room-bill/verify-book-room",
    },
    TOUR_BILL: {
      DEFAULT: "/v1.0/tour-bill/",
      CREATE: "/v1.0/tour-bill/",
      GET_TOUR_BILL: "/v1.0/tour-bill/:id",
      GET_LASTED_TOUR_BILL: "/v1.0/tour-bill/latest/:id",
      UPDATE_TOUR_BILL: "/v1.0/tour-bill/:id",
      PAY_AGAIN: "/v1.0/tour-bill/pay-again/:id",
      RESCHEDULE: "/v1.0/tour-bill/re-schedule/:id",
      CANCEL_BOOK_TOUR: "/v1.0/tour-bill/cancel/:id",
    },
    HOTEL: {
      ALL_HOTELS: "/v1.0/hotel/get-all-hotels",
      DETAIL_HOTEL: "/v1.0/hotel/get-hotel/:id",
      SEARCH_HOTELS: "/v1.0/hotel/search-hotels/:name",
      SEARCH_LOCATION_HOTELS: "/v1.0/hotel/search-by-location/:location",
      GET_ALL_HOTELS_BY_PAGE: "/v1.0/hotel/get-all-hotels-by-page/:page",
    },
    ROOM: {
      DEFAULT: "/v1.0/room/",

      GET_ROOM: "/v1.0/room/get-room/:id",
      GET_ROOMS: "/v1.0/room/get-all-rooms/:id",
      GET_ROOMS_AVAILABLE: "/v1.0/room/get-rooms-available",
      GET_PRICE: "/v1.0/room-other-price/get-price",
    },
  },
  ENTERPRISE: {
    COMMENT: {
      TOUR_COMMENT: {
        DEFAULT: "/v1.0/enterprise/comment",
        DELETE_REPLY: "/v1.0/enterprise/comment/:id",

        GET_All_COMMENTS: "/v1.0/tour-comment/get-all-tour-comments",
        REPLY: "/v1.0/tour-comment/reply/:id",
        REQUEST_DELETE: "/v1.0/tour-comment/request-delete/:id",
        DELETE: "/v1.0/tour-comment/delete/:id",
      },
      HOTEL_COMMENT: {
        GET_All_COMMENTS: "/v1.0/hotel-comment/get-all-hotel-comments",
        REPLY: "/v1.0/hotel-comment/reply/:id",
        REQUEST_DELETE: "/v1.0/hotel-comment/request-delete/:id",
        DELETE: "/v1.0/hotel-comment/delete/:id",
      },
    },
    TOUR: {
      DEFAULT: "/v1.0/enterprise/tour",
      CREATE_TOUR: "/v1.0/enterprise/tour",
      GET_ONE_TOUR: "/v1.0/enterprise/tour/:id",
      UPDATE_TOUR: "/v1.0/enterprise/tour/:id",
      DELETE_TOUR: "/v1.0/enterprise/tour/:id",
      GET_TOURS: "/v1.0/tour/get-tours/:id",
      STOP_WORKING: "/v1.0/tour/temporarily-stop-working/:id",
      WORK_AGAIN: "/v1.0/tour/work-again/:id",
      SEARCH_TOUR: "/v1.0/tour/enterprise-search-tours/user/:userId/tour/:name",
    },
    TOUR_SCHEDULE: {
      DEFAULT: "/v1.0/enterprise/tour-schedule",
      DELETE_SCHEDULE: "/v1.0/enterprise/tour-schedule//multi/:tourId/:day",
      DELETE_SCHEDULE_ITEM: "/v1.0/enterprise/tour-schedule/:id",
    },
    TOUR_ON_SALE: {
      DEFAULT: "/v1.0/enterprise/tour-on-sale",
      UPDATE_TOUR_PRICE: "/v1.0/enterprise/tour-on-sale/:id",
      DELETE_TOUR_PRICE: "/v1.0/enterprise/tour-on-sale/:id",
      FIND_TOUR_ON_SALE: "/v1.0/enterprise/tour-on-sale/:id",
    },
    VOUCHER: {
      DEFAULT: "/v1.0/enterprise/voucher",
      DELETE_VOUCHER: "/v1.0/enterprise/voucher/:id",
    },
    POLICY: {
      DEFAULT: "/v1.0/enterprise/policy",
      GET_ALL_POLICY: "/v1.0/enterprise/policy",
      DELETE_POLICY: "/v1.0/enterprise/policy/:id",
    },
    STAFF: {
      DEFAULT: "/v1.0/enterprise/staff",
      SEND_OFFER: "/v1.0/enterprise/staff/send-offer",
      ACCEPT_OFFER: "/v1.0/enterprise/staff/accept-offer/:id",
      CANCEL_OFFER: "/v1.0/enterprise/staff/cancel-offer/:id",
      GET_OFFERS: "/v1.0/enterprise/staff/get-offers",
      DELETE_STAFF: "/v1.0/enterprise/staff/delete/:id",
      STATISTIC_TOUR: "/v1.0/enterprise/staff/statistic/tour-bill",
      STATISTIC_ROOM: "/v1.0/enterprise/staff/statistic/room-bill",
    },
    COMMISSION: {
      DEFAULT: "/v1.0/enterprise/commission",
      GET_ID: "/v1.0/enterprise/commission/:id",
    },
    HOTEL: {
      CREATE_HOTEL: "/v1.0/hotel/create",
      UPDATE_HOTEL: "/v1.0/hotel/update/:id",
      DELETE_HOTEL: "/v1.0/hotel/delete/:id",
      GET_HOTELS: "/v1.0/hotel/get-hotels/:id",
      STOP_WORKING: "/v1.0/hotel/temporarily-stop-working/:id",
      WORK_AGAIN: "/v1.0/hotel/work-again/:id",
    },
    STAY: {
      DEFAULT: "/v1.0/enterprise/stay",
      GET_STAY: "/v1.0/enterprise/stay/:id",
      DELETE_STAY: "/v1.0/enterprise/stay/:id",
    },
    ROOM: {
      DEFAULT: "/v1.0/enterprise/room/",
      GET_ROOM: "/v1.0/enterprise/room/:id",
      CHECK_ROOM: "/v1.0/enterprise/room/check-room",

      CREATE_ROOM: "/v1.0/enterprise/room/",
      GET_ALL_ROOM: "/v1.0/room/get-all-rooms/:id",
      UPDATE_INFORMATION: "/v1.0/room/update-information/:id",
      UPDATE_PRICE: "/v1.0/room/update-price/:id",
      DELETE: "/v1.0/room/delete/:id",
      STOP_WORKING: "/v1.0/room/temporarily-stop-working/:id",
      WORK_AGAIN: "/v1.0/room/work-again/:id",
      GET_ROOM_OTHER_PRICE: "/v1.0/room-other-price/get-all-prices/:id",
      CREATE_ROOM_OTHER_PRICE: "/v1.0/room-other-price/create",
      UPDATE_ROOM_OTHER_PRICE: "/v1.0/room-other-price/update/:id",
      DELETE_ROOM_OTHER_PRICE: "/v1.0/room-other-price/delete/:id",
      GET_ROOMS_AVAILABLE: "/v1.0/room/get-rooms-available",
    },
    ROOM_OTHER_PRICE: {
      DEFAULT: "/v1.0/enterprise/room-other-price/",
      GET_ROOM_OTHER_PRICE: "/v1.0/enterprise/room-other-price/:id",
    },
    TOUR_BILL: {
      DEFAULT: "/v1.0/enterprise/tour-bill",
      GET_ONE: "/v1.0/enterprise/tour-bill/:id",
      UPDATE_STATUS: "/v1.0/enterprise/tour-bill/:id",
      STATISTIC: "/v1.0/enterprise/tour-bill/statistic",
      GET_ALL_BILL_STATISTICS:
        "/v1.0/enterprise/tour-bill/statistic/tour-on-sales",
      FILTER: "/v1.0/enterprise/tour-bill/filter",
      STATISTIC_STAFF_TOUR: "/v1.0/enterprise/tour-bill/statistic/staff/:id",
      GET_TOURS_REVENUE_BY_MONTH: "/v1.0/tour-bill/get-tours-revenue-by-month",
      GET_TOURS_REVENUE_BY_YEAR: "/v1.0/tour-bill/get-tours-revenue-by-year",
      GET_ALL_BILLS_OF_ANY_TOUR: "/v1.0/tour-bill/get-all-tour-bills/:id",
      GET_BILLS_ANY_DATE: "/v1.0/tour-bill/get-tour-bills-any-date",
    },
    ROOM_BILL: {
      DEFAULT: "/v1.0/enterprise/room-bill",
      FILTER: "/v1.0/enterprise/room-bill/filter",
      STATISTIC: "/v1.0/enterprise/room-bill/statistic",
      STATISTIC_ROOM: "/v1.0/enterprise/room-bill/statistic/room/:id",
      STATISTIC_ONE: "/v1.0/enterprise/room-bill/statistic/:id",
      GET_ONE: "/v1.0/enterprise/room-bill/:id",
      STATISTIC_STAFF_ROOM: "/v1.0/enterprise/room-bill/statistic/staff/:id",
    },
    ROOMBILL: {
      GET_HOTELS_REVENUE_BY_MONTH:
        "/v1.0/room-bill/get-hotels-revenue-by-month",
      GET_HOTELS_REVENUE_BY_YEAR: "/v1.0/room-bill/get-hotels-revenue-by-year",
      GET_ALL_BILLS_OF_ANY_ROOM: "/v1.0/room-bill/get-all-room-bills/:id",
      GET_BILLS_ANY_DATE: "/v1.0/room-bill/get-room-bills-any-date",
    },
  },
  ADMIN: {
    USER: {
      DEFAULT: "/v1.0/admin/user",
      CHANGE_ROLE: "/v1.0/admin/user/change-role",
      DELETE: "/v1.0/admin/user/delete/:id",
    },
    EVENT: {
      DEFAULT: "/v1.0/admin/event",
      DELETE_EVENT: "/v1.0/admin/event/:id",
    },
    COMMISSION: {
      DEFAULT: "/v1.0/admin/commission",
      GET_ID: "/v1.0/admin/commission/:id",
    },
    TOUR_ON_SALE: {
      DEFAULT: "/v1.0/admin/tour-on-sale",
      GET_ID: "/v1.0/admin/tour-on-sale/:id",
    },
    STATISTIC: {
      TOUR: {
        DEFAULT: "/v1.0/admin/tour-bill/statistic",
        GET_TOUR: "/v1.0/admin/tour-bill/statistic/tour/:id",
        GET_TOUR_ON_SALE_BILL:
          "/v1.0/admin/tour-bill/statistic/tour-on-sale/get-bills/:id",
        TOUR_ON_SALE: "/v1.0/admin/tour-bill/statistic/tour-on-sale",
        GET_TOUR_ON_SALE: "/v1.0/admin/tour-bill/statistic/tour-on-sale/:id",
        ORDER_REFUND: "/v1.0/admin/tour-bill/order-refund",
        ORDER_REFUND_ONE: "/v1.0/admin/tour-bill/order-refund/:id",
      },
      STAY: {
        DEFAULT: "/v1.0/admin/room-bill",
        FILTER: "/v1.0/admin/room-bill/filter/:id",
        STATISTIC: "/v1.0/admin/room-bill/statistic",
        STATISTIC_ROOM: "/v1.0/admin/room-bill/statistic/room/:id",
        STATISTIC_STAY: "/v1.0/admin/room-bill/statistic/stay/:id",
        FIND_ALL_REVENUE: "/v1.0/admin/room-bill/statistic/stay/",
        STATISTIC_USER: "/v1.0/admin/room-bill/statistic/user/:id",
        ORDER_REFUND: "/v1.0/admin/room-bill/order-refund",
        ORDER_REFUND_ONE: "/v1.0/admin/room-bill/order-refund/:id",
      },
    },
    COMMENT: {
      HOTEL_COMMENT: {
        GET_COMMENT_NEED_DELETE:
          "/v1.0/hotel-comment/get-hotel-comments-need-delete",
        DECLINE_DELETE_COMMENT: "/v1.0/hotel-comment/decline-delete/:id",
        DELETE: "/v1.0/hotel-comment/delete/:id",
      },
      TOUR_COMMENT: {
        GET_COMMENT_NEED_DELETE:
          "/v1.0/tour-comment/get-tour-comments-need-delete",
        DECLINE_DELETE_COMMENT: "/v1.0/tour-comment/decline-delete/:id",
        DELETE: "/v1.0/tour-comment/delete/:id",
      },
    },
  },
};

export const VALIDATION = {
  password:
    /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/,
  phone: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
};

export const ratingList = [
  {
    id: 1,
    value: "1",
    // label: '🌟',
    label: 1,
  },
  {
    id: 2,
    value: "2",
    // label: '🌟🌟',
    label: 2,
  },
  {
    id: 3,
    value: "3",
    // label: '🌟🌟🌟',
    label: 3,
  },
  {
    id: 4,
    value: "4",
    // label: '🌟🌟🌟🌟',
    label: 4,
  },
  {
    id: 5,
    value: "5",
    // label: '🌟🌟🌟🌟🌟',
    label: 5,
  },
];

export const tagsOption = [
  { id: 1, name: "Shopping", value: "Shopping" },
  { id: 2, name: "Sea", value: "Sea" },
  { id: 3, name: "Family", value: "Family" },
  { id: 4, name: "Mountain", value: "Mountain" },
  { id: 5, name: "Trekking", value: "Trekking" },
  { id: 6, name: "Chill", value: "Chill" },
  { id: 7, name: "Music", value: "Music" },
  { id: 8, name: "Eat", value: "Eat" },
];
