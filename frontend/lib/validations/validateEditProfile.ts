// frontend/lib/validations/validateEditProfile.ts

export function validateEditProfile(form: {
  email: string;
  telefono: string;
  password: string;
}) {
  const errors: Record<string, string> = {};

  // Correo obligatorio + formato
  if (!form.email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "El correo electrónico no es válido.";
  }

  // Teléfono obligatorio
  if (!form.telefono) {
    errors.telefono = "El teléfono es obligatorio.";
  } else {
    // quitamos todo menos dígitos (para soportar +56 9 8765 4321)
    const digits = form.telefono.replace(/\D/g, "");
    if (digits.length < 8) {
      errors.telefono = "El teléfono debe tener al menos 8 dígitos.";
    }
  }

  // Contraseña obligatoria
  if (!form.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (form.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}
