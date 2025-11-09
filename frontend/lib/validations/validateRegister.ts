export function validateRegister(form: any, role: string) {
  const errors: Record<string, string> = {};
  if (!form.name) errors.name = 'El nombre es obligatorio';
  if (!form.email) {
    errors.email = 'El correo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Correo inválido';
  }
  if (!form.password || form.password.length < 6) {
    errors.password = 'Debe tener al menos 6 caracteres';
  }
  if (form.password !== form.confirm) {
    errors.confirm = 'Las contraseñas no coinciden';
  }
  if (!form.phone) errors.phone = 'El teléfono es obligatorio';
  if (role === 'fisioterapeuta' && !form.cedula) {
    errors.cedula = 'La cédula es obligatoria';
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}
