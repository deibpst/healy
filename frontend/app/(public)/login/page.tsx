import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="grid md:grid-cols-2 min-h-screen">
      {/* Lado izquierdo: formulario */}
      <div className="flex flex-col justify-center px-10 md:px-20 bg-white">
        <img src="/img/logo.svg" alt="Healy" className="w-32 mb-6" />
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
        <p className="text-gray-500 mb-8">Ingresa tus datos</p>
        <LoginForm />
      </div>

      {/* Lado derecho: imagen */}
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
