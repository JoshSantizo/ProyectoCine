"use client";
import Login from "../components/Login";
import Link from "next/link";

export default function Home() {
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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          width: "300px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "black" }}>Iniciar Sesión</h1>
        <Login />
        <p style={{ textAlign: "center", color: "black" }}>
          <Link href="/crear-cuenta">Crear Usuario</Link>
        </p>
      </div>
    </div>
  );
}