"use client";
import Registro from "../../components/Registro";

export default function CrearCuenta() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgb(245, 237, 237)",
          width: "300px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "black" }}>Crear Cuenta</h1>
        <Registro />
      </div>
    </div>
  );
}