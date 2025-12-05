import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="grid md:grid-cols-2 h-screen">
      {/* Lado izquierdo: formulario */}
      <div className="relative flex flex-col justify-center px-10 md:px-20 bg-white">
        <img
          src="/img/logo_sin_fondo.png"
          alt="Healy"
          className="w-40 absolute top-4 left-4 md:left-8"
        />
        <h1 className="mt-10 text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
        <p className="text-gray-500 mb-8">Ingresa tus datos</p>
        <LoginForm />
      </div>

      {/* Lado derecho: imagen */}
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
