import { createContext, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdLogOut, IoMdTime } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { BsFillPeopleFill } from "react-icons/bs";
import SnackbarAlert from "../../components/customAlert";

const SidebarContext = createContext();

function AdminSidebar({ children }) {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 0);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const currentPath = location.pathname; // Get the current path

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Sidebar items with route and text information
  const [sidebarItems, setSidebarItems] = useState([
    {
      icon: (
        <div className="py-1 px-2 my-2">
          <IoMdTime size={25} />
        </div>
      ),
      text: "Timesheet",
      route: "/admin-Timesheets",
      alert: true,
    },
    {
      icon: (
        <div className="py-1 px-2 my-2">
          <BsFillPeopleFill size={25} />
        </div>
      ),
      text: "Teams",
      route: "/admin-Teams",
      alert: true,
    },
    {
      icon: (
        <div className="py-1 px-2 my-2">
          <IoMdLogOut size={25} />
        </div>
      ),
      text: "Logout",
      route: "/admin",
      alert: false,
    },
  ]);

  // Determine which item should be active based on the current path
  const getActiveIndex = () => {
    const currentIndex = sidebarItems.findIndex(
      (item) => item.route === currentPath
    );
    return currentIndex !== -1 ? currentIndex : 0; // Default to the first item if no match
  };

  const [activeIndex, setActiveIndex] = useState(getActiveIndex);

  useEffect(() => {
    setActiveIndex(getActiveIndex());
  }, [currentPath]); // Update active index when the path changes

  const handleItemClick = (index) => {
    if (index === 2) {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        handleLogout();
      }
    } else {
      setActiveIndex(index);
      setSidebarItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { ...item, alert: false } : item
        )
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setSnackbarMessage("Admin Dashboard is logout successfully.");
    setSnackbarSeverity("warning");
    setSnackbarOpen(true);
    setTimeout(() => {
      navigate("/admin");
    }, 500);
  };

  return (
    <>
      <aside className={`relative ${collapsed ? "collapsed" : ""}`}>
        <nav
          className="h-full flex flex-col shadow-lg"
          style={{
            top: "30px",
            boxShadow: "0 4px 6px black, 0 10px 20px black",
          }}
        >
          <div className="p-4 mt-9 pb-3 flex justify-between items-center">
            <Link to="/">
              <h2
                className={`overflow-hidden first-letter:size-1 transition-all ${
                  collapsed ? "text-3xl flex justify-center px-4" : "w-0"
                } transition-all duration-300`}
              >
                Soft Mania
              </h2>
            </Link>
            <button onClick={() => setCollapsed((col) => !col)}>
              {collapsed ? (
                <button className="hover:bg-gradient-to-tr from-green-600 to-green-700 text-white p-2 font-medium rounded-md cursor-pointer">
                  <FaArrowLeft />
                </button>
              ) : (
                <button className=" hover:bg-gradient-to-tr from-green-700 to-green-600 text-white p-2 font-medium rounded-md cursor-pointer">
                  <FaArrowRight />
                </button>
              )}
            </button>
          </div>
          <SidebarContext.Provider value={{ collapsed }}>
            <ul className="flex-1 mt-2 px-3">
              {sidebarItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(index)}
                  className={`relative flex mt-2 mb-2 items-center font-medium rounded-md cursor-pointer transition-colors group ${
                    activeIndex === index
                      ? "bg-gradient-to-tr from-green-400 to-green-600 text-white"
                      : "hover:bg-gradient-to-tr from-green-700/20 to-green-800 text-gray-800"
                  } transition-all duration-300`}
                >
                  <Link
                    to={item.route}
                    className="flex items-center w-full text-white"
                  >
                    {item.icon}
                    <span
                      className={`overflow-hidden transition-all text-white ${
                        collapsed ? "w-52 ml-3" : "w-0"
                      }`}
                    >
                      {item.text}
                    </span>
                    {item.alert && (
                      <div
                        className={`absolute right-2 w-2 h-2 rounded bg-green-400 ${
                          collapsed ? "" : "top-2"
                        }`}
                      ></div>
                    )}
                  </Link>

                  {!collapsed && (
                    <div
                      className={`absolute left-full rounded-md px-2 z-10 py-1 ml-6 bg-green-100 text-black text-sm invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                    >
                      {item.text}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
      {children}

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
      />
    </>
  );
}

export default AdminSidebar;
