"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons/index";
// Lucide React icons for subItems
import {  BarChart2,  Users,  LayoutDashboard, FolderOpen, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Search, ChevronLeft, X } from "lucide-react";


// Define the type for navigation items
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon?: React.ReactNode }[];
};

const adminNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    name: "Dashboard",
    path: "/dashboard/admin",
  },
  {
    icon: <FolderOpen className="w-6 h-6" />,
    name: "Content Management",
    path: "/dashboard/admin/content",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    name: "Statistics & Analytics",
    path: "/dashboard/admin/statistics",
  },
  {
    icon: <Users className="w-6 h-6" />,
    name: "Users",
    path: "/dashboard/admin/users",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    name: "Monetization",
    path: "/dashboard/admin/monetization",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    name: "Community",
    path: "/dashboard/admin/community",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    name: "Admin Controls",
    path: "/dashboard/admin/settings",
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } = useSidebar();
  useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNavItems = searchQuery.trim()
    ? navItems.filter((nav) =>
        nav.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navItems;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredNavItems.length > 0) {
      const first = filteredNavItems[0];
      if (first.path) {
        router.push(first.path);
        setSearchQuery("");
      }
    }
    if (e.key === "Escape") setSearchQuery("");
  };

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
              className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
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
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
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
                className={`menu-item group ${isActive(nav.path) ? "bg-[#9810FA] text-white shadow-md shadow-purple-500/20" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "text-white"
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
                      className={`menu-dropdown-item flex items-center ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      <span className="mr-2 flex-shrink-0">{subItem.icon}</span>
                      <span className="flex-1 text-left">{subItem.name}</span>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
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
        ${isExpanded || isMobileOpen
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
      <div className={`py-6 flex flex-col ${!isExpanded && !isHovered ? 'items-center justify-center' : 'w-full'}`}>
        <div className={`flex items-center justify-between ${!isExpanded && !isHovered ? 'w-auto' : 'w-full px-6'}`}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-inherit flex items-center justify-center">
              {/* Simple approximation of the logo icon - Grid of dots */}
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              </div>
            </div>
            {(isExpanded || isHovered || isMobileOpen) && <span
              className="text-2xl font-bold tracking-wide text-purple-700 dark:text-purple-300 select-none whitespace-nowrap"
            >
              Mind Player
            </span>}
          </Link>



          {(isExpanded || isHovered || isMobileOpen) && (
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapsed State Controls */}
        {!isExpanded && !isHovered && !isMobileOpen && (
          <div className="flex flex-col items-center gap-6 mt-8 w-full">
            <button
              onClick={toggleSidebar}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[#9810FA] hover:bg-gray-50 transition-transform hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Expanded State Search Bar */}
        {/* Expanded State Toggle & Search */}
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="flex flex-col gap-4 mt-8 w-full px-5">


            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-4 pr-10 py-2.5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 focus:outline-none focus:border-purple-500 transition-all font-light"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start px-5 text-transparent h-0 mb-0" // Hide "Menu" text in expanded mode as per design
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
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
        {isExpanded || isHovered || isMobileOpen ? <div className="mt-auto p-4">
          <Link href="/signin" className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div> : <div className="mt-auto p-4 flex justify-center">
          <Link href="/signin" className="text-red-500 hover:text-red-700 transition-colors">
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
        }
      </div>
    </aside>
  );
};

export default AppSidebar;
