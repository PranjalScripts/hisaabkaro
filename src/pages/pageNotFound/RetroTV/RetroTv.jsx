import React from "react";
import { StyledWrapper } from "./styles";
import  Antenna  from "./Antenna";
import Screen  from "./Screen";
import  Controls  from "./Controls";
import  TVBase  from "./TVBase";

 const RetroTV = () => {
  return (
    <StyledWrapper className="flex justify-center mt-24 "  >
      <div className="main_wrapper">
        <div className="main">
          <Antenna />
          <div className="tv">
            <div className="cruve">
              <svg
                xmlSpace="preserve"
                viewBox="0 0 189.929 189.929"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                className="curve_svg"
              >
                <path
                  d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
                  C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
                />
              </svg>
            </div>
            <Screen />
            <Controls />
          </div>
          <TVBase />
        </div>
      </div>
    </StyledWrapper>
  );
};
export default RetroTV;
