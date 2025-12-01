export function validateRegister(form: any, role: string) {
  const errors: Record<string, string> = {};

  if (!form.firstName || form.firstName.trim().length < 2) {
    errors.firstName = 'El/los nombre(s) son obligatorios';
  }

  if (!form.lastName || form.lastName.trim().length < 2) {
    errors.lastName = 'Los apellidos son obligatorios';
  }

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

  // Teléfono: prefijo fijo 52 + 10 dígitos de número
  if (!form.phone) {
    errors.phone = 'El teléfono es obligatorio';
  } else {
    const phoneTrim = form.phone.trim();

    // debe iniciar con 52
    if (!phoneTrim.startsWith('52')) {
      errors.phone = 'El teléfono debe iniciar con 52';
    } else {
      const numberPart = phoneTrim.slice(2); // lo que escribió el usuario
      if (!/^\d{10}$/.test(numberPart)) {
        errors.phone = 'Teléfono inválido (debe tener 10 dígitos después de la lada)';
      }
    }
  }

  if (role === 'fisioterapeuta') {
    if (!form.codigo) {
      errors.codigo = 'El código es obligatorio';
    } else if (form.codigo.trim() !== 'fisioterapeuta123') {
      errors.codigo = 'Código inválido';
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}
