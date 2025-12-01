'use client';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link"; // Importar el componente Link

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-white">
      <img src="/img/logo_sin_fondo.png" alt="Healy" className="w-70 h-auto mb-4" />
      <h1 className="text-6xl md:text-6xl font-bold text-gray-900 mb-2">
        Bienvenido a Healy
      </h1>
      <p className="text-gray-500 mb-8">
        Sistema de gestión para fisioterapeutas y pacientes
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-20 py-2 bg-[#337790] text-white rounded-md hover:bg-[#337790] transition"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-20 py-2 bg-[#dbdcdd] rounded-md hover:bg-gray-100 transition"
        >
          Registrarse
        </button>
      </div>
    </main>
  );
}