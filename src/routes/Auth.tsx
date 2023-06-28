import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faLocationDot, faPlane, faHotel, 
  faAddressCard,
  faCalendarCheck, 
  faLandmarkDome,
  faEarthAsia, faE, faV } from '@fortawesome/free-solid-svg-icons';

var routes = [
    {
      path: "/profileDetail",
      name: "Profile detail",
      icon: "faUser",
      layout: "/",
    },
    {
      path: "/icons",
      name: "Icons",
      icon: "ni ni-planet text-blue",
      layout: "/admin",
    },
    {
      path: "/maps",
      name: "Maps",
      icon: "ni ni-pin-3 text-orange",
      layout: "/admin",
    },
    {
      path: "/profile",
      name: "User Profile",
      icon: "ni ni-single-02 text-yellow",
      layout: "/admin",
    },
    {
      path: "/tables",
      name: "Tables",
      icon: "ni ni-bullet-list-67 text-red",
      layout: "/admin",
    },
    {
      path: "/login",
      name: "Login",
      icon: "ni ni-key-25 text-info",
      layout: "/auth",
    },
    {
      path: "/register",
      name: "Register",
      icon: "ni ni-circle-08 text-pink",
      layout: "/auth",
    },
    {
      path: "/verify-signup",
      name: "VerifySignup",
      icon: "ni ni-circle-08 text-pink",
      layout: "/auth",
    },
  ];
  export default routes;
  