import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction.jsx";
import { whiteFailMessageFunction } from "./utils/whiteFailMessageFunction.jsx";
import supabase from "./utils/supabase.js";
import { useNavigate, Link } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useTheme, useMediaQuery } from "@mui/material";
import toggleWithDelay from "./utils/toggleWithDelay.js";

// TODO remove, this demo shouldn't need to reset the theme.

export default function LogIn({
  setIsAdmin,
  setAuthorized,
  adminClicked,
  setAdminClicked,
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccMsg, setLoginSuccMsg] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function togglePassword() {
    setPasswordHidden(!passwordHidden);
  }

  async function submitLoginForm(e) {
    e.preventDefault();

    try {
      if (!form.email) {
        setEmailError(true);
        setEmailErrorMessage("email is required");
        return;
      } else {
        setEmailError(false);
        setEmailErrorMessage("");
      }
      if (!form.password) {
        setPasswordError(true);
        setPasswordErrorMessage("password is required");
        return;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage("");
      }

      // Attempt to sign in with the provided email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      // Handle authentication errors
      if (error) {
        console.log(error.message);
        toggleWithDelay(setError, error.message, "", 2000);
        return;
      }

      if (adminClicked) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("admin")
          .eq("user_id", data.user.id)
          .single();

        // Handle errors in fetching user data
        if (userError) {
          console.log(userError.message);
          toggleWithDelay(setError, userError.message, "", 2000);
          return;
        } else {
          // If the user is an admin, set the admin panel state
          if (userData.admin === true) {
            console.log("User is admin");
            setAuthorized(true);
            setIsAdmin(true);
            true;
            setLoginSuccMsg("Login successful! Welcome, Admin.");
            setTimeout(() => {
              setTimeout(() => {
                navigate("/admin-panel");
              }, 0);
            }, 2000);
            return;
          }
        }
      }

      setForm({ email: "", password: "" });
      setAuthorized(true);
      setLoginSuccMsg("Login successful!");
      setTimeout(() => {
        navigate("/");
        setLoginSuccMsg("");
      }, 1000);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(true);
    }
  }

  useEffect(() => {
    form.email ? setEmailErrorMessage("") : "";
  }, [form.email]);

  useEffect(() => {
    form.password ? setPasswordErrorMessage("") : "";
  }, [form.password]);

  function handleSwitch() {
    setAdminClicked(!adminClicked);
  }

  return (
    <Card sx={{ marginTop: isSmallScreen ? -10 : "" }}>
      <CardContent>
        <Box
          component="form"
          onSubmit={submitLoginForm}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              mt: -1,
              color: "silver",
              bgcolor: "transparent",
              mr: "1px",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <h1>Sign in</h1>
          <Stack spacing={1.5}>
            <Typography></Typography>
            <TextField
              size="small"
              className="text-field"
              label="Email"
              placeholder="your@email.com"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              value={form.email}
              autoComplete="email"
              autoFocus
              type="email"
              onChange={handleChange}
            />

            {loginSuccMsg && whiteSuccessMessageFunction(loginSuccMsg)}
            {error && whiteFailMessageFunction(error)}
            {emailErrorMessage && whiteFailMessageFunction(emailErrorMessage)}
            {passwordErrorMessage &&
              whiteFailMessageFunction(passwordErrorMessage)}
            <Typography></Typography>
            <Typography></Typography>
            <TextField
              size="small"
              label="Password"
              placeholder={passwordHidden ? "●●●●●●" : "password"}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={form.password}
              type={passwordHidden ? "password" : "text"}
              id="password"
              autoComplete="password"
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePassword();
                      }}
                      edge="end"
                    >
                      {passwordHidden ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box component="span" sx={{ display: "inline-block" }}>
              <Link
                style={{
                  fontSize: "75%",
                  color: "#1976D2",
                }}
                variant="body2"
                to={"/forgot-password"}
              >
                Forgot password
              </Link>
            </Box>

            <Typography></Typography>
            <Button size="small" type="submit" fullWidth variant="contained">
              Log In
            </Button>
            <Typography></Typography>

            <div>
              <Link
                style={{
                  fontSize: "75%",
                  color: "#1976D2",
                }}
                variant="body2"
                to={"/signup"}
              >
                {"Create an account"}
              </Link>

              <FormGroup>
                <FormControlLabel
                  sx={{ marginTop: "-12%", marginLeft: "60%" }}
                  control={<Switch onChange={handleSwitch} />}
                  label={
                    <Typography
                      variant="body2"
                      style={{ fontSize: "80%", color: "grey" }}
                    >
                      admin
                    </Typography>
                  }
                />
              </FormGroup>
            </div>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
