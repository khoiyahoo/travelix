import LandingPage from "pages/landingPage";
import Login from "pages/auth/login";
import Signup from "pages/auth/signup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowsRotate, faCreditCard, faArrowRightFromBracket,
faPlaneDeparture, faBuilding
} from '@fortawesome/free-solid-svg-icons';
import Profile from "pages/profile";
import Hotels from "pages/enterprise/Hotels"

export interface Item {
    id: string;
    path: string;
    name: string;
    icon?: any;
    component?: any;
    layout?: string; 
  }

 export const userProfileRoutes: Item[] = [
    {id: "1", path: '/profile/UserProfile', name: 'User Profile', icon: faUser},
    {id: "2", path: '/profile/changePassword', name: 'Change password', icon: faArrowsRotate},
    {id: "3", path: '/profile/PaymentDetail', name: 'Payment detail', icon: faCreditCard},
    {id: "4", path: '/profile/', name: 'Payment detail', icon: faArrowRightFromBracket}
]; 

export const enterpriseRoutes: Item[] = [
  {id: "2", path: '/enterprise/Hotels', name: 'Hotels', icon: faBuilding, component: Hotels},
]; 