'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-white">
      <img src="/img/logo.svg" alt="Healy" className="w-20 h-20 mb-4" />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Bienvenido a Healy
      </h1>
      <p className="text-gray-500 mb-8">
        Sistema de gestión para fisioterapeutas y pacientes
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Registrarse
        </button>
      </div>
    </main>
  );
}
