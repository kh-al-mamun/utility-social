import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';
import HeadsetTwoToneIcon from '@mui/icons-material/HeadsetTwoTone';
import PendingActionsTwoToneIcon from '@mui/icons-material/PendingActionsTwoTone';
import InterestsTwoToneIcon from '@mui/icons-material/InterestsTwoTone';
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import SocialNavigation from './SocialNavigation';
import HiddenDown from '../utils/HiddenDown';

let pages;
const mobilePages = ['Home:', 'Todos:todos', 'Songs:songs', 'Social:social'];
const settings = ['Profile', 'Account', 'Dashboard'];
const logoStyleSm = { display: { xs: 'flex', md: 'none' }, mr: 1 };
const logoStyleMd = { display: { xs: 'none', md: 'flex' }, mr: 1 };

function Navbar() {
  const { user, logOut } = useAuth()
  const { userInfo } = useUser();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname !== '/') {
    pages = ['Home:', 'Todos:todos', 'Songs:songs', 'Social:social'];
  } else {
    pages = ['Todos:todos', 'Songs:songs', 'Social:social'];
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path) => {
    setAnchorElNav(null);
    if (typeof (path) === 'string') navigate(`/${path}`)
  };

  const handleCloseUserMenu = async (button) => {
    setAnchorElUser(null);
    switch (button) {
      case 'Logout': {
        logOut()
          .then(() => {
            navigate('/sign-in');
          })
          .catch(error => {
            alert(error.message);
          })
      }
        break;

      case 'Profile': {
        navigate(`/social/profile/${userInfo.username}`)
      }
        break;

      case 'Account': {
        navigate('/social/account/edit')
      }
        break;

      case 'Dashboard': {
        navigate('/social/account/dashboard')
      }
    }
  };


  return (
    <AppBar position="static" color='secondary'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo logoStyle={logoStyleMd} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            // href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            {location.pathname === '/songs' ? 'SONGS' : location.pathname === '/todos' ? 'TODOS' : location.pathname.includes('/social') ? 'SOCIAL' : 'HOME'}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}> {/* MOBILE */}
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {mobilePages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page.split(':')[1])}>
                  <Typography textAlign="center">{page.split(':')[0]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* MOBILE */}
          <Logo logoStyle={logoStyleSm} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            // href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            {location.pathname === '/songs' ? 'SONGS' : location.pathname === '/todos' ? 'TODOS' : location.pathname.includes('/social') ? 'SOCIAL' : 'HOME'}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {
              location.pathname.includes('/social') ?
                <SocialNavigation /> :
                <PagesNotSocial handleCloseNavMenu={handleCloseNavMenu} />
            }
          </Box>


          {/* MENU */}
          {
            user ?
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={userInfo?.displayName} src={userInfo?.image} sx={{ width: '35px', height: '35px' }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* Social navigation for mobile */}
                  <HiddenDown breakpoint='md' up>
                    <SocialNavigation onClick={() => handleCloseUserMenu()} ml={1.4} /> <p></p>
                  </HiddenDown>
                  {/* all setting buttons */}
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                      <Typography textAlign="center" display="flex" gap={1}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                  {/* standalone logout button */}
                  <MenuItem onClick={() => handleCloseUserMenu('Logout')}>
                    <Typography textAlign="center" display="flex" gap={1}>
                      <LogoutIcon /> Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box> :
              <Button onClick={() => navigate('/sign-in')} color='secondary' variant='outlined'>
                Login &nbsp;
                <LoginIcon />
              </Button>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
}


const Logo = ({ logoStyle }) => {
  return (
    location.pathname === '/songs' ? <HeadsetTwoToneIcon sx={logoStyle} /> :
      location.pathname === '/todos' ? <PendingActionsTwoToneIcon sx={logoStyle} /> :
        location.pathname.includes('/social') ? <InterestsTwoToneIcon sx={logoStyle} /> :
          // <HomeTwoToneIcon sx={logoStyle}/>
          <WifiChannelIcon sx={logoStyle} />
  )
}

const PagesNotSocial = ({ handleCloseNavMenu }) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => handleCloseNavMenu(page.split(':')[1])}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {page.split(':')[0]}
        </Button>
      ))}
    </Box>
  )
}

export default Navbar;