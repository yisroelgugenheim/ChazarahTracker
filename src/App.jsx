import { useEffect, useState } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import CreateIcon from "@mui/icons-material/Create";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimerIcon from "@mui/icons-material/Timer";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import AdminPanel from "./AdminPanel";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UpdateEmail from "./UpdateEmail";
import PageNotFound from "./utils/PageNotFound";
import ChazaraGraph from "./ChazaraGraph";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import supabase from "./utils/supabase";
import { useTheme } from "@mui/material/styles";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction";
import "./App.css";
import { getUserId } from "./utils/getUserId";
import Status from "./Status";
import Manual from "./Manual";
import Alert from "@mui/material/Alert";
import DrawerAppBar from "./DrawerAppBar.jsx";
import StopwatchAlerts from "./StopwatchAlerts.jsx";
import usePersistedState from "./utils/usePersistedState.js";
import toggleWithDelay from "./utils/toggleWithDelay.js";


export default function App() {
  const [activeComponent, setActiveComponent] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [adminClicked, setAdminClicked] = useState(false);


  /**
   * Seconds timed before the timer was unpaused
   */
  const [previousElapsed, setPreviousElapsed] = usePersistedState(() => "stopwatchTime", 0);
  /**
   * Epoch milliseconds (`Date.now()`) timestamp when the timer began running or was unpaused;
   * `null` if the timer is not running or is paused.
   */
  const [unpauseInstant, setUnpauseInstant] = usePersistedState(() => "stopwatchUnpausedInstant", null);
  /**
   * Seconds timed since the timer began running or was unpaused
   */
  const [currentElapsed, setCurrentElapsed] = useState(0)
  const [showSuccMsg, setShowSuccMsg] = useState(false);
  const [error, setError] = useState("");
  const [clickedDownload, setClickedDownload] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const placement = isSmallScreen ? "right" : "bottom";

  const totalElapsed = previousElapsed + currentElapsed;
  const isRunning = unpauseInstant !== null;

  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (isAdmin && location.pathname === "/admin-panel") {
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, [isAdmin, location.pathname]);

  function handleNavClick(path) {
    navigate(path);
  }

  const adminNavItems = [
    { buttonLabel: "View Obligations", componentName: "getAllOwed" },
    { buttonLabel: "Insert Payment Record", componentName: "insertPayRecord" },
    { buttonLabel: "Edit Session", componentName: "getUpdateSessions" },
    { buttonLabel: "Edit Pledge", componentName: "updatePledge" },
    { buttonLabel: "User Weeks", componentName: "getWeeks" },
    { buttonLabel: "Graph", componentName: "chazaraGraph" },
    { buttonLabel: "Add Session", componentName: "addSessions" },
    { buttonLabel: "Add User", componentName: "addUser" },
    { buttonLabel: "Add Admin", componentName: "makeAdmin" },
    { buttonLabel: "Delete User", componentName: "deleteUser" },
    { buttonLabel: "Get All Sessions", componentName: "getAllSessions" },
  ].map(({ buttonLabel, componentName }) => ({
    buttonLabel,
    onClick: () => setActiveComponent(componentName),
    adminOnly: true,
  }));

  const userNavItems = [
    {
      buttonLabel: (
        <Tooltip title="stopwatch" placement={placement}>
          <TimerIcon/>
        </Tooltip>
      ),
      path: "/",
    },
    {
      buttonLabel: (
        <Tooltip title="add session manually" placement={placement}>
          <CreateIcon/>
        </Tooltip>
      ),
      path: "manual",
    },
    {
      buttonLabel: (
        <Tooltip title="status" placement={placement}>
          <QueryStatsIcon/>
        </Tooltip>
      ),
      path: "status",
    },
    {
      buttonLabel: (
        <Tooltip title="graph" placement={placement}>
          <BarChartIcon/>
        </Tooltip>
      ),
      path: "graph",
    },
  ].map(({ buttonLabel, path }) => ({
    buttonLabel,
    onClick: () => handleNavClick(path),
  }));

  function getNavItems(path) {
    switch (path) {
      case "/":
        return userNavItems;
      case "/manual":
        return userNavItems;
      case "/status":
        return userNavItems;
      case "/graph":
        return userNavItems;
      case "/admin-panel":
        return adminNavItems;
      default:
        return [];
    }
  }

  useEffect(() => {
    async function getAdminStat() {
      const id = await getUserId();
      if (!id) return;
      else setUserId(id);
      const { data, error } = await supabase
        .from("users")
        .select("admin")
        .eq("user_id", id);
      if (error) return null;
      if (data && data.length) setIsAdmin(data[0].admin);
    }

    getAdminStat();
  }, []);

  useEffect(() => {
    const imagePages = ["/"];
    if (imagePages.includes(location.pathname)) {
      document.body.classList.add("app");
    } else {
      document.body.classList.remove("app");
    }
  }, [location.pathname]);

  useEffect(() => {
    const checkEmailUpdate = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.user_metadata.email_change_requested_at) {
        const emailChangeRequestedAt = new Date(
          user.user_metadata.email_change_requested_at
        );
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        if (emailChangeRequestedAt >= fiveMinutesAgo) {
          toggleWithDelay(
            setConfirmationMessage,
            "Email update was successful! Your new email has been confirmed.",
            "",
            10000
          );
        }
      }
    };
    checkEmailUpdate();
  }, []);

  useEffect(() => {
    if (location.pathname === "/graph") {
      document.body.style.display = "block";
    } else {
      document.body.style.display = "flex";
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isRunning) {
      const interval =
        setInterval(
          () => setCurrentElapsed(Math.floor((Date.now() - unpauseInstant) / 1000)),
          500
        );
      return () => clearInterval(interval);
    }
  }, [isRunning, unpauseInstant]);

  const formattedTime = () => {
    const seconds = `0${totalElapsed % 60}`.slice(-2);
    const minutes = `${Math.floor(totalElapsed / 60)}`;
    return `${minutes}:${seconds}`;
  };

  function stopTimer() {
    setPreviousElapsed(totalElapsed);
    setUnpauseInstant(null);
    setCurrentElapsed(0);
  }

  const postTime = async () => {
    if (isRunning) {
      toggleWithDelay(setError, "Stopwatch must be paused", "", 3000);
      return;
      // should be changed to check if stopwatch is less than one second.
    } else if (totalElapsed <= 0) {
      toggleWithDelay(setError, "Stopwatch must be started first", "", 3000);
      return;
    }
    // else if (sessionLength < 1) {
    //   setError("Can't post zero minutes");
    //   setTimeout(() => {
    //     setError("");
    //   }, 3000);
    //   return;
    // }

    const totalTimeInMinutes = Math.floor(totalElapsed / 60);
    const currentTimeStamp = new Date().toISOString();

    try {
      // if (!authorized) {
      //   setError("Your session expired! Please sign in again.");
      //   return;
      // }
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      console.log(userData);
      if (userError || !userData) {
        setError("Your session expired! Please sign in again.");
        return;
      }

      const { error } = await supabase.from("sessions").insert({
        session_length: totalTimeInMinutes,
        created_at: currentTimeStamp,
        user_id: userData.id,
      });

      if (error) {
        toggleWithDelay(setError, error.message, "", 2000);
        return;
      }
      toggleWithDelay(setShowSuccMsg, true, false, 2000);
      stopTimer();
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const restartTimer = () => {
    stopTimer();
    setPreviousElapsed(0);
  };

  return (
    <>
      {authorized && location.pathname === "/" ? (
        <div className="stopwatch-container">
          <p
            className="stopwatch-display"
            onClick={() => {
              if (!isRunning)
                setUnpauseInstant(Date.now());
              else
                stopTimer();
              toggleWithDelay(setShowAlert, true, false, 1000);
            }}
          >
            {formattedTime()}
          </p>
          <Button
            onClick={() => navigate("/manual")}
            sx={{
              top: isSmallScreen ? "35%" : "25%",
              // backgroundColor: "rgb(29, 29, 29)",
              backgroundColor: "rgb(90, 90, 90)",
              fontFamily: "helvetica",
              borderRadius: "15%",
              width: isSmallScreen ? "30%" : "25%",
              whiteSpace: "nowrap",
              fontSize: isSmallScreen ? "0.65rem" : "0.8rem",
            }}
            variant="contained"
          >
            Add Session Manually
          </Button>
        </div>
      ) : null}
      {confirmationMessage && whiteSuccessMessageFunction(confirmationMessage)}

      {showAlert && (
        <Alert
          severity="info"
          sx={{
            backgroundColor: "rgba(100, 100, 100, 0.2)",
            color: "black",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
            borderRadius: 2,
            width: "100%",
            position: "fixed",
            bottom: isSmallScreen ? "23%" : "0%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "tooltip",
          }}
        >
          {totalElapsed <= 0 ? null : !isRunning ? "paused" : "play"}
        </Alert>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <DrawerAppBar
                navItems={getNavItems(location.pathname)}
                restartTimer={restartTimer}
                postTime={postTime}
                authorized={authorized}
                setAuthorized={setAuthorized}
                setClickedDownload={setClickedDownload}
              />
              <main>
                <Outlet/>
              </main>
            </div>
          }
        >
          <Route
            index
            element={
              <AuthenticatedRoute>
                <StopwatchAlerts
                  userId={userId}
                  duration={totalElapsed}
                  showSuccMsg={showSuccMsg}
                  error={error}
                />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/manual"
            element={
              <AuthenticatedRoute>
                <Manual/>
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/graph"
            element={
              <AuthenticatedRoute>
                <ChazaraGraph
                  clickedDownload={clickedDownload}
                  setClickedDownload={setClickedDownload}
                />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/status"
            element={
              <AuthenticatedRoute>
                <Status/>
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/reset-email"
            element={
              <AuthenticatedRoute>
                <UpdateEmail/>
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              isAdmin ? (
                <AuthenticatedRoute>
                  <AdminPanel
                    activeComponent={activeComponent}
                    setActiveComponent={setActiveComponent}
                    isAdmin={isAdmin}
                  />
                </AuthenticatedRoute>
              ) : (
                <PageNotFound/>
              )
            }
          />
          <Route
            path="/login"
            element={
              <LogIn
                setIsAdmin={setIsAdmin}
                setAuthorized={setAuthorized}
                adminClicked={adminClicked}
                setAdminClicked={setAdminClicked}
              />
            }
          />
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
        </Route>

        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </>
  );
}
