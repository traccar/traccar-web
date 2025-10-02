import { useEffect, useState } from "react";
import {
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Link,
  Snackbar,
  IconButton,
  Tooltip,
  Box,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { makeStyles } from "tss-react/mui";
import CloseIcon from "@mui/icons-material/Close";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionActions } from "../store";
import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import LoginLayout from "./LoginLayout";
import usePersistedState from "../common/util/usePersistedState";
import {
  generateLoginToken,
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from "../common/components/NativeInterface";
import LogoImage from "./LogoImage";
import { useCatch } from "../reactHelper";
import Loader from "../common/components/Loader";
import QrCodeDialog from "../common/components/QrCodeDialog";
import fetchOrThrow from "../common/util/fetchOrThrow";

const useStyles = makeStyles()((theme) => ({
  options: {
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  registerButton: {
    minWidth: "unset",
  },
  link: {
    cursor: "pointer",
  },
  wlcText: {
    fontSize: "1.5rem",
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLocalLanguage } = useLocalization();
  const allowedLanguages = ["fa", "en"]; // Limits of languages

  const languageList = Object.entries(languages)
    .filter(([code]) => allowedLanguages.includes(code)) // Limitation of languages
    .map((values) => ({
      code: values[0],
      country: values[1].country,
      name: values[1].name,
    }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState("loginEmail", "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showServerTooltip, setShowServerTooltip] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector(
    (state) => state.session.server.registration
  );
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes["ui.disableLoginLanguage"];
  });
  const changeEnabled = useSelector(
    (state) => !state.session.server.attributes.disableChange
  );
  const emailEnabled = useSelector(
    (state) => state.session.server.emailEnabled
  );
  const openIdEnabled = useSelector(
    (state) => state.session.server.openIdEnabled
  );
  const openIdForced = useSelector(
    (state) =>
      state.session.server.openIdEnabled && state.session.server.openIdForce
  );
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector(
    (state) => state.session.server.announcement
  );

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;
      const response = await fetch("/api/session", {
        method: "POST",
        body: new URLSearchParams(
          code.length ? `${query}&code=${code}` : query
        ),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem("postLogin") || "/";
        window.sessionStorage.removeItem("postLogin");
        navigate(target, { replace: true });
      } else if (
        response.status === 401 &&
        response.headers.get("WWW-Authenticate") === "TOTP"
      ) {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch {
      setFailed(true);
      setPassword("");
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetchOrThrow(
      `/api/session?token=${encodeURIComponent(token)}`
    );
    const user = await response.json();
    dispatch(sessionActions.updateUser(user));
    navigate("/");
  });

  const handleOpenIdLogin = () => {
    document.location = "/api/session/openid/auth";
  };

  useEffect(() => nativePostMessage("authentication"), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem("hostname") !== window.location.hostname) {
      window.localStorage.setItem("hostname", window.location.hostname);
      setShowServerTooltip(true);
    }
  }, []);

  return (
    <LoginLayout>
      {!useMediaQuery(theme.breakpoints.down("lg")) && (
        <>
          <h1 className={classes.Title}>{t("raahyab")}</h1>
          <p className={classes.wlcText}>{t("loginWelcome")}</p>
        </>
      )}
      <div
        className={classes.options}
        style={{
          direction: "ltr",
          top: theme.spacing(5),
          right: theme.spacing(5),
        }}>
        {nativeEnvironment && changeEnabled && (
          <IconButton
            color="primary"
            onClick={() => navigate("/change-server")}>
            <Tooltip
              title={`${t("settingsServer")}: ${window.location.hostname}`}
              open={showServerTooltip}
              arrow>
              <VpnLockIcon />
            </Tooltip>
          </IconButton>
        )}
        {!nativeEnvironment && (
          <IconButton color="primary" onClick={() => setShowQr(true)}>
            <QrCode2Icon />
          </IconButton>
        )}
        {languageEnabled && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={(e, newLang) => newLang && setLocalLanguage(newLang)}
              sx={{ borderRadius: 2, overflow: "hidden" }} // دکمه‌ها را به هم متصل نگه می‌دارد
            >
              {languageList.map((it) => (
                <ToggleButton
                  key={it.code}
                  value={it.code}
                  sx={{ textTransform: "none" }}
                  style={{ direction: "rtl" }}>
                  <Box component="span" style={{ marginLeft: "1rem" }}>
                    <ReactCountryFlag
                      countryCode={it.country}
                      svg
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Box>
                  {it.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        )}

        {/* {languageEnabled && (
          <FormControl>
            <Select
              value={language}
              onChange={(e) => setLocalLanguage(e.target.value)}>
              {languageList.map((it) => (
                <MenuItem key={it.code} value={it.code}>
                  <Box component="span" sx={{ mr: 1 }}>
                    <ReactCountryFlag countryCode={it.country} svg />
                  </Box>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )} */}
      </div>
      <div className={classes.container}>
        {useMediaQuery(theme.breakpoints.down("lg")) && (
          <LogoImage color={theme.palette.primary.main} />
        )}
        {!openIdForced && (
          <>
            <TextField
              required
              error={failed}
              label={t("userEmail")}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus={!email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={failed && "Invalid username or password"}
            />
            <TextField
              required
              error={failed}
              label={t("userPassword")}
              name="password"
              value={password}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small">
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {codeEnabled && (
              <TextField
                required
                error={failed}
                label={t("loginTotpCode")}
                name="code"
                value={code}
                type="number"
                onChange={(e) => setCode(e.target.value)}
              />
            )}
            <Button
              onClick={handlePasswordLogin}
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!email || !password || (codeEnabled && !code)}>
              {t("loginLogin")}
            </Button>
          </>
        )}
        {openIdEnabled && (
          <Button
            onClick={() => handleOpenIdLogin()}
            variant="contained"
            color="secondary">
            {t("loginOpenId")}
          </Button>
        )}
        {!openIdForced && (
          <div className={classes.extraContainer}>
            {registrationEnabled && (
              <Link
                onClick={() => navigate("/register")}
                className={classes.link}
                underline="none"
                variant="caption">
                {t("loginRegister")}
              </Link>
            )}
            {emailEnabled && (
              <Link
                onClick={() => navigate("/reset-password")}
                className={classes.link}
                underline="none"
                variant="caption">
                {t("loginReset")}
              </Link>
            )}
          </div>
        )}
      </div>
      <QrCodeDialog open={showQr} onClose={() => setShowQr(false)} />
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </LoginLayout>
  );
};

export default LoginPage;
