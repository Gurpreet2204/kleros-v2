import React from "react";
import { useTheme } from "styled-components";
import { useMeasure } from "react-use";
import { BREAKPOINT_SMALL_SCREEN } from "styles/smallScreenStyle";
import HeaderLightMobile from "tsx:svgs/header/header-lightmode-mobile.svg";
import HeaderDarkMobile from "tsx:svgs/header/header-darkmode-mobile.svg";
import HeaderLightDesktop from "tsx:svgs/header/header-lightmode-desktop.svg";
import HeaderDarkDesktop from "tsx:svgs/header/header-darkmode-desktop.svg";

const Header = () => {
  const [ref, { width }] = useMeasure();
  const theme = useTheme();
  const themeIsLight = theme.name === "light";
  const screenIsBig = width > BREAKPOINT_SMALL_SCREEN;
  return (
    <div ref={ref}>
      {screenIsBig ? <HeaderDesktop {...{ themeIsLight }} /> : <HeaderMobile {...{ themeIsLight }} />}
    </div>
  );
};

const HeaderDesktop: React.FC<{ themeIsLight: boolean }> = ({ themeIsLight }) => {
  return themeIsLight ? <HeaderLightDesktop /> : <HeaderDarkDesktop />;
};

const HeaderMobile: React.FC<{ themeIsLight: boolean }> = ({ themeIsLight }) => {
  return themeIsLight ? <HeaderLightMobile /> : <HeaderDarkMobile />;
};

export default Header;
