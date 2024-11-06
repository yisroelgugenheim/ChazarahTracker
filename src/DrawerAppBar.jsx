import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "./utils/supabase";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import "./Stopwatch.css";
import Tooltip from "@mui/material/Tooltip";

const getButtonStyles = (buttonLabel, location) => {
  const styles = {};
  const title = buttonLabel?.props?.title;
  if (title === "stopwatch" && location.pathname === "/") {
    styles.color = "grey";
    styles.cursor = "default";
  } else if (
    title === "add session manually" &&
    location.pathname === "/manual"
  ) {
    styles.color = "grey";
    styles.cursor = "default";
  } else if (title === "status" && location.pathname === "/status") {
    styles.color = "grey";
    styles.cursor = "default";
  } else if (title === "graph" && location.pathname === "/graph") {
    styles.color = "grey";
    styles.cursor = "default";
  }
  return styles;
};

function DrawerAppBar(props) {
  const {
    window,
    navItems,
    restartTimer,
    postTime,
    authorized,
    setAuthorized,
    setClickedDownload,
  } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stopwatch, setStopwatch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userIcon, setUserIcon] = useState(false);

  const location = useLocation();
  useEffect(() => {
    const pages = [
      "/login",
      "/signup",
      "/reset-email",
      "/forgot-password",
      "/reset-password",
    ];
    if (pages.includes(location.pathname)) setUserIcon(false);
    else setUserIcon(true);
  }, [location.pathname]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleUserClick(event) {
    setMobileOpen(false);
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  async function handleSignOutClick() {
    handleClose();
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/login");
  }

  function handleUpdateEmailClick() {
    handleClose();
    navigate("/reset-email");
  }

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (data) setAuthorized(true);
    }

    checkAuth();
  }, [setAuthorized]);

  useEffect(() => {
    if (authorized && location.pathname === "/") {
      setStopwatch(true);
    } else {
      setStopwatch(false);
    }
  }, [location.pathname, authorized]);

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Chazarah Tracker
      </Typography>
      <Divider/>
      <List sx={{ outline: "red solid 2px" }}>
        {navItems.map(({ onClick, buttonLabel }, index) => {
          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  ...getButtonStyles(buttonLabel, location),
                }}
                onClick={onClick}
              >
                <ListItemText primary={buttonLabel}/>
              </ListItemButton>
            </ListItem>
          );
        })}
        <Divider/>
        {userIcon && (
          <PersonIcon
            sx={{ cursor: "pointer" }}
            color="inherit"
            id="user-button"
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleUserClick}
          />
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  function handleClickedDownload() {
    setClickedDownload((prev) => !prev);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline/>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon/>
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Ateres Ami | Chazarah Tracker
          </Typography>
          {location.pathname === "/graph" ? (
            <Tooltip title="download graph">
              <DownloadIcon
                onClick={handleClickedDownload}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  fontSize: isSmallScreen ? "100%" : "4.5vmin",
                  right: "4vmin",
                }}
              >
                Download Graph
              </DownloadIcon>
            </Tooltip>
          ) : null}

          {stopwatch ? (
            <>
              <Button
                sx={{
                  fontSize: isSmallScreen ? "3.2vmin" : null,
                  left: isSmallScreen ? "10%" : "-23%",
                }}
                className="button-submit"
                variant="outlined"
                color="inherit"
                onClick={postTime}
              >
                Submit
              </Button>

              <Button
                sx={{ left: isSmallScreen ? "15%" : "-21%" }}
                className="button-start-over"
                variant="outlined"
                color="inherit"
                onClick={restartTimer}
              >
                <RestartAltIcon
                  sx={{ fontSize: isSmallScreen ? "5vmin" : null }}
                />
              </Button>
            </>
          ) : null}

          {/* {location.pathname === "/status" && (
            <>
              <Button
                variant="outlined"
                color="inherit"
                id="menu-button"
                aria-controls={open2 ? "stats-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? "true" : undefined}
                onClick={handleClick2}
              >
                Status
              </Button>
              <Menu
                id="stats-menu"
                anchorEl={anchorEl2}
                open={open2}
                onClose={handleClose2}
                MenuListProps={{
                  "aria-labelledby": "menu-button",
                }}
              >
                <MenuItem onClick={getWeek}>Week Status</MenuItem>
                <MenuItem onClick={getCurrQ}>Quarter Status</MenuItem>
                <MenuItem onClick={getPrevQ}>Previous Quarter</MenuItem>
                <MenuItem onClick={getOwed}>Owed Status</MenuItem>
              </Menu>
            </>
          )} */}

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {
              // Here is the map function:
              navItems.map(({ onClick, buttonLabel }, index) => (
                <Button
                  key={index}
                  sx={{
                    color: "white",
                    ...getButtonStyles(buttonLabel, location),
                  }}
                  onClick={onClick}
                >
                  {buttonLabel}
                </Button>
              ))
            }
            {userIcon && (
              <>
                <PersonIcon
                  sx={{
                    marginBottom: "-7px",
                    marginLeft: "19px",
                    left: "-10px",
                    cursor: "pointer",
                  }}
                  color="inherit"
                  id="user-button"
                  aria-controls={open ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                />

                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "user-button",
                  }}
                >
                  {location.pathname !== "/admin-panel" && (
                    <MenuItem onClick={handleUpdateEmailClick}>
                      update email
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleSignOutClick}>sign out</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar/>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      buttonLabel: PropTypes.object.isRequired,
    })
  ).isRequired,
  restartTimer: PropTypes.func.isRequired,
  postTime: PropTypes.func.isRequired,
  authorized: PropTypes.bool.isRequired,
  setAuthorized: PropTypes.func.isRequired,
  setClickedDownload: PropTypes.func.isRequired
};

export default DrawerAppBar;
