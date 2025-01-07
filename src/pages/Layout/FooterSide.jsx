import React from "react";
import {
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const FooterSide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { 
      path: "/dashboard", 
      icon: HiOutlineChartBar,
      label: t('navigation.dashboard'),
      activeGradient: "bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-pink-500",
      hoverGradient: "hover:bg-gradient-to-tr hover:from-violet-500/90 hover:via-fuchsia-500/90 hover:to-pink-500/90"
    },
    { 
      path: "/your-books", 
      icon: HiOutlineDocumentText,
      label: t('navigation.selfRecord'),
      activeGradient: "bg-gradient-to-tr from-blue-500 via-cyan-500 to-teal-500",
      hoverGradient: "hover:bg-gradient-to-tr hover:from-blue-500/90 hover:via-cyan-500/90 hover:to-teal-500/90"
    },
    { 
      path: "/book", 
      icon: HiOutlineBookOpen,
      label: t('navigation.books'),
      activeGradient: "bg-gradient-to-tr from-emerald-500 via-green-500 to-lime-500",
      hoverGradient: "hover:bg-gradient-to-tr hover:from-emerald-500/90 hover:via-green-500/90 hover:to-lime-500/90"
    },
    { 
      path: "/users", 
      icon: HiOutlineUserGroup,
      label: t('navigation.users'),
      activeGradient: "bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-500",
      hoverGradient: "hover:bg-gradient-to-tr hover:from-orange-500/90 hover:via-amber-500/90 hover:to-yellow-500/90"
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" />
      
      {/* Main Content */}
      <div className="relative py-1.5">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex justify-between items-center">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group relative py-1.5 px-2"
                >
                  {/* Active Animation Blob */}
                  {active && (
                    <div 
                      className={`absolute inset-0 ${item.activeGradient} blur-xl opacity-20 animate-pulse rounded-full`}
                    />
                  )}

                  {/* Icon Container */}
                  <div className="relative flex flex-col items-center">
                    <div 
                      className={`
                        relative p-2 rounded-xl
                        transform transition-all duration-500 ease-out
                        ${active 
                          ? `${item.activeGradient} scale-110 shadow-md ring-1 ring-white/50` 
                          : `bg-gray-100/80 ${item.hoverGradient} group-hover:scale-105 group-hover:shadow-sm`
                        }
                      `}
                    >
                      {/* Icon */}
                      <item.icon 
                        className={`
                          w-4.5 h-4.5 transition-all duration-500 stroke-[2]
                          ${active 
                            ? 'text-white transform rotate-12 scale-110' 
                            : 'text-gray-600 group-hover:text-white'
                          }
                        `}
                      />

                      {/* Inner Glow */}
                      {active && (
                        <div className="absolute inset-0 rounded-xl bg-white/20 blur-[2px]" />
                      )}
                    </div>

                    {/* Label */}
                    <span 
                      className={`
                        mt-1 text-[10px] font-medium tracking-wide
                        transition-all duration-500 ease-out
                        ${active 
                          ? 'text-gray-800 scale-105 font-semibold' 
                          : 'text-gray-500 group-hover:text-gray-700'
                        }
                      `}
                    >
                      {item.label}
                    </span>

                    {/* Active Indicator Line */}
                    <div 
                      className={`
                        absolute -top-1.5 left-1/2 -translate-x-1/2
                        w-6 h-0.5 rounded-full
                        transition-all duration-500 ease-out
                        ${active 
                          ? `${item.activeGradient} scale-100 opacity-100` 
                          : 'scale-0 opacity-0'
                        }
                      `}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSide;