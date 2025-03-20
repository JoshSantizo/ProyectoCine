"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <h1>Ingreso exitoso</h1>
        <Link href="/">Volver a la página principal</Link>
      </div>
    </div>
  );
}