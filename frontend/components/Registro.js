"use client";
import { useState } from "react";
import axios from "axios";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState(""); // Nuevo estado para el mensaje

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/usuario/registro`,
        {
          nombre,
          username,
          contrasena: password,
        }
      );
      setMensaje("Usuario creado exitosamente"); // Mensaje de éxito
      // Limpiar los campos del formulario si es necesario
      setNombre("");
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al crear el usuario"); // Mensaje de error
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registro</button>
      </form>
      {mensaje && <p>{mensaje}</p>} {/* Mostrar el mensaje */}
    </div>
  );
}

export default Registro;