import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'react-feather';
import './NoInternetConnection.css';

const NoInternetConnection = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (!isOnline) {
    return (
      <div className="no-internet-container">
        <div className="content-wrapper">
          <svg
            className="sad-avatar-svg"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id="tearPath1" d="M150 280 Q150 310 150 340" />
              <path id="tearPath2" d="M362 280 Q362 310 362 340" />
              <circle id="tearDrop" r="8" fill="#65B1EF">
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="3s"
                  repeatCount="indefinite"/>
              </circle>
            </defs>

            <circle cx="256" cy="256" r="240" fill="#FFD93D">
              <animate
                attributeName="transform"
                attributeType="XML"
                type="scale"
                values="1;0.98;1"
                dur="3s"
                repeatCount="indefinite"/>
            </circle>
            <circle cx="256" cy="256" r="220" fill="#FFE45C"/>
            
            <g>
              <path d="M150 190C170.987 190 188 207.013 188 228C188 248.987 170.987 266 150 266C129.013 266 112 248.987 112 228C112 207.013 129.013 190 150 190Z" fill="#3E4347"/>
              <path d="M362 190C382.987 190 400 207.013 400 228C400 248.987 382.987 266 362 266C341.013 266 324 248.987 324 228C324 207.013 341.013 190 362 190Z" fill="#3E4347"/>
            </g>
            
            <path d="M150 170C180 140 188 170 188 180" stroke="#3E4347" strokeWidth="12" strokeLinecap="round"/>
            <path d="M362 170C392 140 400 170 400 180" stroke="#3E4347" strokeWidth="12" strokeLinecap="round"/>
            
            <path d="M180 360C256 320 336 360 336 360" stroke="#3E4347" strokeWidth="16" strokeLinecap="round"/>
            
            <g>
              <use href="#tearDrop" x="150" y="280" className="tear-drop">
                <animateMotion 
                  dur="3s"
                  repeatCount="indefinite"
                  path="M0 0 Q0 30 0 60"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  keySplines="0.4 0 0.6 1">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="3s"
                    repeatCount="indefinite"/>
                </animateMotion>
              </use>
              <use href="#tearDrop" x="150" y="280" className="tear-drop">
                <animateMotion 
                  dur="3s"
                  begin="1.5s"
                  repeatCount="indefinite"
                  path="M0 0 Q0 30 0 60"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  keySplines="0.4 0 0.6 1">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="3s"
                    repeatCount="indefinite"/>
                </animateMotion>
              </use>

              <use href="#tearDrop" x="362" y="280" className="tear-drop">
                <animateMotion 
                  dur="3s"
                  repeatCount="indefinite"
                  path="M0 0 Q0 30 0 60"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  keySplines="0.4 0 0.6 1">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="3s"
                    repeatCount="indefinite"/>
                </animateMotion>
              </use>
              <use href="#tearDrop" x="362" y="280" className="tear-drop">
                <animateMotion 
                  dur="3s"
                  begin="1.5s"
                  repeatCount="indefinite"
                  path="M0 0 Q0 30 0 60"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  keySplines="0.4 0 0.6 1">
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur="3s"
                    repeatCount="indefinite"/>
                </animateMotion>
              </use>
            </g>
          </svg>
          
          <h1 className="title">
            Oops! No Internet Connection
          </h1>
          
          <p className="message">
            We can't reach our servers at the moment. Please check your internet connection and try again.
          </p>
          
          <button
            className="retry-button"
            onClick={handleRetry}
          >
            <RefreshCw /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default NoInternetConnection;
