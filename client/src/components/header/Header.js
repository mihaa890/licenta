import { ButtonWrapper, HeaderWrapper, LogoImage, LogoWrapper } from "./Header.style";
import { Web3Button } from "@web3modal/react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"
import { Web3NetworkSwitch } from '@web3modal/react'



const Header = () => {
    const navigate = useNavigate();

    return (
        <HeaderWrapper>
            <LogoWrapper>
                <LogoImage onClick={() => navigate("/")} src={logo} alt="logo" />
            </LogoWrapper>
            <ButtonWrapper>
                <Web3Button
                    style={{ fontSize: "20px" }}
                    icon="show"
                    balance="show"

                />
                {/* <Web3NetworkSwitch /> */}
            </ButtonWrapper>
        </HeaderWrapper>
    );
}

export default Header;