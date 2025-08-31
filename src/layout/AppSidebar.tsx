"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";
// Lucide React icons for subItems
import { Music,Volume, Brain, Globe, ListMusic, UploadCloud, Star, CalendarClock, BarChart2, Clock, Repeat, TrendingUp, Smartphone, Users, UserCog, UserCheck, Globe2, UserPlus, DollarSign, CreditCard, ShoppingCart, Building2, TrendingDown, Activity, Shield, ToggleRight, FileText, Bell, MessageCircle } from "lucide-react";

import SidebarWidget from "./SidebarWidget";

// Define the type for navigation items
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

// Common navigation items for all roles
const commonNavItems: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];

// Add a default icon for subItems (you can customize per subItem if desired)
// Add a default icon for subItems (for fallback, not used below)
const DefaultSubIcon = React.createElement(ChevronDownIcon, { className: "w-4 h-4 text-gray-400 mr-2" });

const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />, 
    name: "Content Management",
    path: "/dashboard/admin/content",
    // subItems: [
    //   { name: "Music", path: "/dashboard/admin/content/music", icon: React.createElement(Music, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "Sounds", path: "/dashboard/admin/content/sounds", icon: React.createElement(Volume, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "Mind Sessions", path: "/dashboard/admin/content/sessions", icon: React.createElement(Brain, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "VR Environments", path: "/dashboard/admin/content/vr", icon: React.createElement(Globe, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "Subliminal Messages", path: "/dashboard/admin/content/environments/sounds", icon: <MessageCircle className="w-5 h-5" /> },
    //   { name: "Playlists", path: "/dashboard/admin/content/playlists", icon: React.createElement(ListMusic, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "Publish/Unpublish", path: "/dashboard/admin/content/publish", icon: React.createElement(UploadCloud, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "Premium/Free", path: "/dashboard/admin/content/premium", icon: React.createElement(Star, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    //   { name: "Schedule Release", path: "/dashboard/admin/content/schedule", icon: React.createElement(CalendarClock, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    // ],
  },
  {
    icon: <GridIcon />, 
    name: "Statistics & Analytics",
    path:"/dashboard/admin/statistics",
  //   subItems: [
  // { name: "Plays by Content", path: "/dashboard/admin/analytics/plays", icon: React.createElement(BarChart2, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  // { name: "Listening Time", path: "/dashboard/admin/analytics/time", icon: React.createElement(Clock, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  // { name: "Retention Rate", path: "/dashboard/admin/analytics/retention", icon: React.createElement(Repeat, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  // { name: "Repetition Rate", path: "/dashboard/admin/analytics/repetition", icon: React.createElement(Repeat, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  // { name: "Top 10 Contents", path: "/dashboard/admin/analytics/top10", icon: React.createElement(TrendingUp, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  // { name: "Trends", path: "/dashboard/admin/analytics/trends", icon: React.createElement(TrendingUp, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  // { name: "VR vs Mobile", path: "/dashboard/admin/analytics/vr-vs-mobile", icon: React.createElement(Smartphone, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  //   ],
  },
  {
    icon: <UserCircleIcon />, 
    name: "Users",
    subItems: [
  { name: "User Stats", path: "/dashboard/admin/users/stats", icon: React.createElement(Users, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Segmentation", path: "/dashboard/admin/users/segmentation", icon: React.createElement(UserCog, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Premium vs Free", path: "/dashboard/admin/users/premium", icon: React.createElement(UserCheck, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "VR vs Mobile", path: "/dashboard/admin/users/vr-vs-mobile", icon: React.createElement(Smartphone, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Top Countries", path: "/dashboard/admin/users/countries", icon: React.createElement(Globe2, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Switch to Mind Expert", path: "/dashboard/admin/users/switch-expert", icon: React.createElement(UserPlus, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    ],
  },
  {
    icon: <PageIcon />, 
    name: "Monetization",
    subItems: [
  { name: "Revenue Overview", path: "/dashboard/admin/monetization/revenue", icon: React.createElement(DollarSign, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "By Subscription Type", path: "/dashboard/admin/monetization/subscription", icon: React.createElement(CreditCard, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "By Market", path: "/dashboard/admin/monetization/market", icon: React.createElement(ShoppingCart, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "B2B Revenue", path: "/dashboard/admin/monetization/b2b", icon: React.createElement(Building2, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Churn Rate", path: "/dashboard/admin/monetization/churn", icon: React.createElement(TrendingDown, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "LTV", path: "/dashboard/admin/monetization/ltv", icon: React.createElement(Activity, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "CAC", path: "/dashboard/admin/monetization/cac", icon: React.createElement(Activity, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    ],
  },
  {
    icon: <ListIcon />, 
    name: "Community Management",
    subItems: [
  { name: "Active Groups", path: "/dashboard/admin/community/groups", icon: React.createElement(Users, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Group Sessions", path: "/dashboard/admin/community/sessions", icon: React.createElement(UserCog, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Participants", path: "/dashboard/admin/community/participants", icon: React.createElement(UserCheck, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Active Groups Ranking", path: "/dashboard/admin/community/ranking", icon: React.createElement(TrendingUp, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Chat Volume", path: "/dashboard/admin/community/chat", icon: React.createElement(Users, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    ],
  },
  {
    icon: <TableIcon />, 
    name: "Admin Controls",
    subItems: [
  { name: "Permissions", path: "/dashboard/admin/controls/permissions", icon: React.createElement(Shield, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Feature Toggles", path: "/dashboard/admin/controls/features", icon: React.createElement(ToggleRight, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Change Logs", path: "/dashboard/admin/controls/logs", icon: React.createElement(FileText, { className: "w-4 h-4 text-gray-400 mr-2" }) },
  { name: "Push Notifications", path: "/dashboard/admin/controls/notifications", icon: React.createElement(Bell, { className: "w-4 h-4 text-gray-400 mr-2" }) },
    ],
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  // Determine which navigation items to show based on user role
  useEffect(() => {
    // Only show admin sidebar
    setNavItems(adminNavItems);
  }, []);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-4">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item flex items-center ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <span className="mr-2 flex-shrink-0">{subItem.icon}</span>
                      <span className="flex-1 text-left">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
  <div className="py-8 flex justify-start">
        <Link href="/">
          <span
            className="text-2xl font-bold tracking-wide text-purple-700 dark:text-purple-300 select-none"
            style={{ letterSpacing: '2px' }}
          >
            Mind Player
          </span>
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Commented out Others section
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
            */}
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
