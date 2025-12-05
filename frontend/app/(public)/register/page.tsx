import RegisterForm from './RegisterForm';
import RoleTabs from './RoleTabs';

export default function RegisterPage() {
  return (
    <main className="grid md:grid-cols-2 h-screen">
      <div className="relative flex flex-col px-10 md:px-20 bg-white">
        <img
          src="/img/logo_sin_fondo.png"
          alt="Healy"
          className="w-40 absolute top-4 left-4 md:left-8"
        />

        {/* Bloque completo del formulario más abajo */}
        <div className="mt-45">
          <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-gray-500 mb-6">
            Completa tus datos para registrarte
          </p>

          <RegisterForm />
        </div>
      </div>

      <div className="hidden md:block h-full  overflow-hidden">
        <img
          src="/img/ejemplo.jpg"
          alt="Fisioterapeuta"
          className="object-cover w-full h-full"
        />
      </div>
    </main>
  );
}
