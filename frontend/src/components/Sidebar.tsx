'use client'; 

import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings'; 

import { useAuthContext } from '@/app/layout'; 

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const router = useRouter();
  const { logout, isLoggedIn } = useAuthContext(); 

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const loggedInMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Administrar Películas', icon: <MovieIcon />, path: '/admin/peliculas' },
    { text: 'Administrar Salas', icon: <MeetingRoomIcon />, path: '/admin/salas' },
  ];

  const loggedOutMenuItems = [
    { text: 'Iniciar Sesión', icon: <LoginIcon />, path: '/login' },
    { text: 'Crear Usuario', icon: <PersonAddIcon />, path: '/register' },
  ];

  const currentMenuItems = isLoggedIn ? loggedInMenuItems : loggedOutMenuItems;

  if (!hasMounted) {
    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer 
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <Toolbar /> 
                <Divider />
                <List>
                    {loggedOutMenuItems.map((item) => ( 
                        <ListItem key={item.text} disablePadding onClick={() => {
                            router.push(item.path);
                            handleDrawerToggle();
                        }}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Drawer 
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                <Toolbar />
                <Divider />
                <List>
                    {loggedOutMenuItems.map((item) => ( 
                        <ListItem key={item.text} disablePadding onClick={() => router.push(item.path)}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
  }

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar /> 
        <Divider />
        <List>
          {currentMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding onClick={() => {
              router.push(item.path);
              handleDrawerToggle(); 
            }}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          {isLoggedIn && (
            <>
              <Divider /> 
              <ListItem disablePadding onClick={() => {
                logout();
                handleDrawerToggle(); 
              }}> 
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Toolbar />
        <Divider />
        <List>
          {currentMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding onClick={() => router.push(item.path)}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          {isLoggedIn && (
            <>
              <Divider /> 
              <ListItem disablePadding onClick={logout}>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar Sesión" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
