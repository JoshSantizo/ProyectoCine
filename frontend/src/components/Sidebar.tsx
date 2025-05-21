// src/components/Sidebar.tsx
'use client'; // Asegúrate de que esta directiva esté presente

import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
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

// Importa useAuthContext desde tu layout.tsx
import { useAuthContext } from '@/app/layout'; 

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const router = useRouter();
  const { logout, isLoggedIn } = useAuthContext(); 

  // Nuevo estado para controlar si el componente ya se ha montado en el cliente
  const [hasMounted, setHasMounted] = useState(false);

  // useEffect para establecer hasMounted a true una vez que el componente se monta en el cliente
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Definición de los elementos del menú para USUARIOS LOGUEADOS
  const loggedInMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Administrar Películas', icon: <MovieIcon />, path: '/admin/peliculas' },
    { text: 'Administrar Salas', icon: <MeetingRoomIcon />, path: '/admin/salas' },
  ];

  // Definición de los elementos del menú para USUARIOS NO LOGUEADOS
  const loggedOutMenuItems = [
    { text: 'Iniciar Sesión', icon: <LoginIcon />, path: '/login' },
    { text: 'Crear Usuario', icon: <PersonAddIcon />, path: '/register' },
  ];

  // Determina qué conjunto de elementos de menú mostrar
  // Solo se decidirá qué mostrar si hasMounted es true
  const currentMenuItems = isLoggedIn ? loggedInMenuItems : loggedOutMenuItems;

  // Si el componente aún no se ha montado en el cliente, renderiza una versión estática o nada
  // para evitar la discrepancia de hidratación.
  if (!hasMounted) {
    // Puedes renderizar un "esqueleto" o un conjunto mínimo de elementos
    // que son los mismos en SSR y en el cliente antes de la hidratación.
    // Para simplificar, mostraremos solo los elementos de "no logueado" por defecto en el servidor.
    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer // Drawer para móviles
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
                    {loggedOutMenuItems.map((item) => ( // Renderiza siempre lo mismo en SSR
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

            <Drawer // Drawer para escritorio
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
                    {loggedOutMenuItems.map((item) => ( // Renderiza siempre lo mismo en SSR
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

  // Si el componente ya se ha montado en el cliente, renderiza el contenido dinámico
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Drawer para móviles */}
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
              handleDrawerToggle(); // Cierra el drawer móvil al navegar
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
                handleDrawerToggle(); // Cierra el drawer móvil al cerrar sesión
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

      {/* Drawer para escritorio (duplicar lógica) */}
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
