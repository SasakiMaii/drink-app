import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { ActiveBlueButton, ActiveDarkBlueButton } from "../atoms/button/Button";
import { Link } from "react-router-dom";
import ModalWindow from "../organisms/ModalWindow";
import Cookies from "js-cookie";
import { useLoginUserFetch } from "../../hooks/useLoginUserFetch";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginUserState } from "../../store/loginUserState";
import { Users } from "../../types/type";
import { getAuth, signOut } from "firebase/auth";
const Header = () => {
  const navigate = useNavigate();

  const pages = [
    { label: "Top", href: "/home" },
    { label: "ご利用ガイド", href: "/home/guide" },
    { label: "投票", href: "/home/poll" },
    { label: "タイムライン", href: "/home/timeline" },
    { label: "お問い合わせ", href: "/home/contact" },
  ];
  const filteredAdminHeader = pages.filter(
    (page) => page.label !== "お問い合わせ"
  );
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const styles = {
    appBar: {
      background: "#f3bf88",
    },
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  // ログアウト
  const auth = getAuth();
  const authId = Cookies.get("authId")!;
  const isAdmin = Cookies.get("isAdmin")!;
  const loginUser = useLoginUserFetch({ authId: authId });
  const onLogoutClick = () => {
    signOut(auth);

    if (loginUser?.isAdmin === false) {
      const date = new Date("2020-12-31T23:59:59Z");
      document.cookie = `authId=;path=/;expires=${date.toUTCString()};`;
      document.cookie = `isAdmin=;path=/;expires=${date.toUTCString()};`;
      navigate("/login");
      window.location.reload();
    }
    if (loginUser?.isAdmin === true) {
      const date = new Date("2020-12-31T23:59:59Z");
      document.cookie = `authId=;path=/;expires=${date.toUTCString()};`;
      document.cookie = `isAdmin=;path=/;expires=${date.toUTCString()};`;
      navigate("/adminlogin");
      window.location.reload();
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {loginUser?.firstName === "" ? (
          <></>
        ) : isAdmin ? (
          <Typography>こんにちは管理者さん</Typography>
        ) : (
          <Typography>こんにちは {loginUser?.firstName}さん</Typography>
        )}
        <div>
          <ModalWindow
            title=""
            content="本当にログアウトしてもよろしいですか？"
            openButtonColor="blue"
            completeButtonColor="darkblue"
            completeButtonName="ログアウト"
            completeAction={onLogoutClick}
            cancelButtonColor="gray"
            openButtonSxStyle={{
              mx: 3,
              py: "5px",
              fontSize: "16px",
              borderRadius: 10,
            }}
          />
        </div>
        {loginUser?.isAdmin ? (
          <div style={{ marginLeft: "auto" }}>
            <Link to="/adminhome">
              <ActiveDarkBlueButton
                sxStyle={{ borderRadius: 10 }}
                event={() => navigate(`/adminhome/`)}
              >
                管理者用TOP
              </ActiveDarkBlueButton>
            </Link>
          </div>
        ) : (
          ""
        )}
      </Paper>

      <AppBar position="static" sx={styles.appBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                textAlign: "center !important",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                    <Box sx={{ textAlign: "center !important" }}>
                      <Typography fontWeight="bold">{page.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            ></Typography>
            {/* 管理者ログイン時のヘッダー */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {!isAdmin ? (
                <>
                  {pages.map((page) => (
                    <Link to={page.href} key={page.label}>
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          color: "white",
                          display: "block",
                          fontWeight: "bold",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {page.label}
                      </Button>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {filteredAdminHeader.map((page) => (
                    <Link to={page.href} key={page.label}>
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          color: "white",
                          display: "block",
                          fontWeight: "bold",
                          fontSize: 16,
                          textAlign: "center",
                        }}
                      >
                        {page.label}
                      </Button>
                    </Link>
                  ))}
                </>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
