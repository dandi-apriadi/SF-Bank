import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { setMicroPage } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export function SidebarLinks(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { routes } = props;
  const { user } = useSelector((state) => state.auth);

  // Fungsi untuk memeriksa apakah rute aktif berdasarkan path
  const activeRoute = (routeName) => {
    const currentPath = location.pathname.split("?")[0];
    if (routeName.includes(":")) {
      const routeBase = routeName.split("/:")[0];
      return currentPath.startsWith(routeBase);
    }
    return currentPath === routeName || currentPath.startsWith(routeName + "/");
  };

  // Menangani rute dengan makro = true
  useEffect(() => {
    const activeMacroRoute = routes.find(
      (route) => route.makro && activeRoute(`${route.layout}/${route.path}`)
    );

    if (activeMacroRoute) {
      dispatch(setMicroPage(activeMacroRoute.name)); // Set makro page jika rute makro aktif
    } else {
      dispatch(setMicroPage("unset")); // Set unset jika tidak ada rute makro yang aktif
    }
  }, [routes, location.pathname, dispatch]);

  // Get color scheme based on user role
  const getRoleColors = () => {
    if (user?.role === 'user') {
      return {
        activeText: 'text-green-700 dark:text-green-400',
        activeBg: 'bg-green-50 dark:bg-navy-700',
        activeIndicator: 'bg-green-500 dark:bg-green-400'
      };
    }
    // Default - admin
    return {
      activeText: 'text-blue-700 dark:text-blue-400',
      activeBg: 'bg-blue-50 dark:bg-navy-700',
      activeIndicator: 'bg-blue-500 dark:bg-blue-400'
    };
  };

  const createLinks = (routes) => {
    const roleColors = getRoleColors();

    // Group routes by parent path
    const mainRoutes = routes.filter(route =>
      route.layout !== "auth" && !route.parentPath
    );

    const subRoutesByParent = {};
    routes.filter(route => route.parentPath).forEach(subRoute => {
      if (!subRoutesByParent[subRoute.parentPath]) {
        subRoutesByParent[subRoute.parentPath] = [];
      }
      subRoutesByParent[subRoute.parentPath].push(subRoute);
    });

    // Function to check if any subpage of a main route is active
    const isAnySubRouteActive = (parentPath) => {
      const subRoutes = subRoutesByParent[parentPath] || [];
      return subRoutes.some(subRoute =>
        activeRoute(`${subRoute.layout}/${subRoute.path}`)
      );
    };

    // Render main routes with their subpages
    return mainRoutes.flatMap((mainRoute, mainIndex) => {
      const mainPath = `${mainRoute.layout}/${mainRoute.path}`;
      const isMainActive = activeRoute(mainPath);
      const hasActiveSubRoute = isAnySubRouteActive(mainRoute.path);
      const shouldShowSubRoutes = isMainActive || hasActiveSubRoute;

      const elements = [
        // Main route
        <Link key={`main-${mainIndex}`} to={mainPath}>
          <div className={`relative mb-3 flex hover:cursor-pointer ${isMainActive ? roleColors.activeBg : 'hover:bg-gray-100 dark:hover:bg-navy-700'} transition-colors rounded-lg`}>
            <li className="my-[3px] flex cursor-pointer items-center px-4 py-2.5 w-full">
              <span
                className={`${isMainActive
                  ? `font-bold ${roleColors.activeText}`
                  : "font-medium text-gray-600 dark:text-gray-400"
                  }`}
              >
                {mainRoute.icon ? mainRoute.icon : <DashIcon />}
              </span>
              <p
                className={`leading-1 ml-4 flex ${isMainActive
                  ? `font-bold ${roleColors.activeText}`
                  : "font-medium text-gray-600 dark:text-gray-400"
                  }`}
              >
                {mainRoute.name}
              </p>
            </li>
            {isMainActive ? (
              <div className={`absolute right-0 top-0 h-full w-1 rounded-r-lg ${roleColors.activeIndicator}`} />
            ) : null}
          </div>
        </Link>
      ];

      // Add subpages if parent is active or any subpage is active
      if (shouldShowSubRoutes && subRoutesByParent[mainRoute.path]) {
        const subElements = subRoutesByParent[mainRoute.path].map((subRoute, subIndex) => {
          const subPath = `${subRoute.layout}/${subRoute.path}`;
          const isSubActive = activeRoute(subPath);

          return (
            <Link key={`sub-${mainIndex}-${subIndex}`} to={subPath}>
              <div className={`relative mb-2 flex hover:cursor-pointer ${isSubActive ? roleColors.activeBg : 'hover:bg-gray-100 dark:hover:bg-navy-700'} transition-colors rounded-lg ml-6`}>
                <li className="my-[3px] flex cursor-pointer items-center px-4 py-2 w-full">
                  <span
                    className={`${isSubActive
                      ? `font-bold ${roleColors.activeText}`
                      : "font-medium text-gray-500 dark:text-gray-500"
                      }`}
                  >
                    {subRoute.icon ? subRoute.icon : <DashIcon className="h-4 w-4" />}
                  </span>
                  <p
                    className={`leading-1 ml-3 flex ${isSubActive
                      ? `font-bold ${roleColors.activeText}`
                      : "font-medium text-gray-500 dark:text-gray-500 text-sm"
                      }`}
                  >
                    {subRoute.name}
                  </p>
                </li>
                {isSubActive ? (
                  <div className={`absolute right-0 top-0 h-full w-1 rounded-r-lg ${roleColors.activeIndicator}`} />
                ) : null}
              </div>
            </Link>
          );
        });

        elements.push(...subElements);
      }

      return elements;
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;

