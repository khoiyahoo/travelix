import React from "react";
import VioletNavbar from "components/Navbars/VioletNavbar";
import Footer from "components/Footer";
interface Props { 
    children: React.ReactNode;
}

const LayoutAuth = ({children}: Props) => {
    return (
        <>
            <div>
                {children}
            </div>
        </>
    )
}

export default LayoutAuth;