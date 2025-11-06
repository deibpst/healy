import RegisterForm from './RegisterForm';
import RoleTabs from './RoleTabs';

export default function RegisterPage() {
  return (
    <main className="grid md:grid-cols-2 min-h-screen">
      <div className="flex flex-col justify-center px-10 md:px-20 bg-white">
        <img src="/img/logo.svg" alt="Healy" className="w-32 mb-6" />
        <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
        <p className="text-gray-500 mb-6">
          Completa tus datos para registrarte
        </p>
        
        <RegisterForm />
      </div>

      <div className="hidden md:block">
        <img
          src="/img/ejemplo.jpg"
          alt="Fisioterapeuta"
          className="object-cover w-full h-full"
        />
      </div>
    </main>
  );
}
