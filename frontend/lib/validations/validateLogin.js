// frontend/lib/validations/validateLogin.js

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email) {
    errors.email = 'El correo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Formato de correo inválido';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.length < 6) {
    errors.password = 'Debe tener al menos 6 caracteres';
  }

  // Retorna los errores y si es válido
  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}
