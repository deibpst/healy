// app/editProfile/page.tsx
'use client';

import { useState, useEffect } from "react";
import { Activity, LogOut, User, Eye, EyeOff, Save, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EditProfile() {
  const router = useRouter();
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lastSaveMessage, setLastSaveMessage] = useState<string | null>(null);
  const [lastSaveType, setLastSaveType] = useState<'success' | 'info' | 'error' | null>(null);

  // Función para obtener el token del localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsFetching(true);
      const token = getToken();
      
      if (!token) {
        toast.error("🔒 No estás autenticado. Redirigiendo al login...");
        setTimeout(() => router.push('/login'), 2000);
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData({
          nombre: data.user.nombre || "",
          apellidos: data.user.apellidos || "",
          email: data.user.email || "",
          telefono: data.user.telefono || "",
          contrasena: "",
          confirmarContrasena: ""
        });
      } else {
        toast.error(data.msg || "❌ Error al cargar datos del usuario");
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("🔌 Error de conexión con el servidor");
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar mensajes anteriores cuando el usuario edita
    setLastSaveMessage(null);
    setLastSaveType(null);
  };

  const handleSaveChanges = async () => {
    // Validaciones
    if (!formData.email.trim()) {
      toast.error("📧 El email es un campo requerido");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("📧 Por favor ingresa un email válido");
      return;
    }

    if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
      toast.error("🔒 Las contraseñas no coinciden");
      return;
    }

    if (formData.contrasena && formData.contrasena.length < 6) {
      toast.error("🔒 La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    
    try {
      const token = getToken();
      if (!token) {
        toast.error("⏰ Sesión expirada. Por favor, inicia sesión nuevamente.");
        router.push('/login');
        return;
      }

      // Preparar datos para enviar
      const updateData: any = {
        email: formData.email,
        telefono: formData.telefono,
      };

      // Solo incluir contraseña si se proporcionó una nueva
      if (formData.contrasena.trim()) {
        updateData.contrasena = formData.contrasena;
      }

      const response = await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.success) {
        // Usar el mensaje específico del backend
        const successMessage = data.msg || "✅ Cambios guardados exitosamente";
        toast.success(successMessage);
        
        // Guardar el mensaje para mostrarlo en la interfaz
        setLastSaveMessage(successMessage);
        setLastSaveType('success');
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          contrasena: "",
          confirmarContrasena: ""
        }));
        
        // Actualizar datos en localStorage
        localStorage.setItem('user_email', formData.email);
        if (formData.nombre) localStorage.setItem('user_name', formData.nombre);
        
        // Si el backend devuelve el usuario actualizado, actualizar el estado
        if (data.user) {
          setFormData(prev => ({
            ...prev,
            nombre: data.user.nombre,
            apellidos: data.user.apellidos,
            email: data.user.email,
            telefono: data.user.telefono
          }));
        }
      } else {
        // Mostrar mensaje de error específico del backend
        const errorMessage = data.msg || "❌ Error al guardar cambios";
        toast.error(errorMessage);
        setLastSaveMessage(errorMessage);
        setLastSaveType('error');
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      const errorMessage = "🔌 Error de conexión con el servidor";
      toast.error(errorMessage);
      setLastSaveMessage(errorMessage);
      setLastSaveType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    toast.success("👋 Sesión cerrada exitosamente");
    router.push('/login');
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2E748F 0%, #1398D6 50%, #ffffff 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin" style={{ borderColor: '#2E748F', borderTopColor: 'transparent' }}></div>
          <div className="text-white font-semibold">Cargando datos del perfil...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #2E748F 0%, #1398D6 50%, #ffffff 100%)' }}>
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2E748F' }}>
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#2E748F' }}>Mi Rehabilitación</h1>
                <p className="text-sm text-gray-600">Editar Perfil</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-gray-300 hover:text-white transition-colors"
                style={{ 
                  borderColor: '#2E748F', 
                  color: '#2E748F',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2E748F'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => router.push('/patient-dashboard')}
              >
                <User className="h-4 w-4" />
                Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center pb-6" style={{ borderBottom: '2px solid #2E748F' }}>
            <CardTitle className="text-2xl font-bold" style={{ color: '#2E748F' }}>
              Información del Perfil
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Actualiza tu información personal
            </p>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Mensaje de última guardada */}
            {lastSaveMessage && (
              <div className={`p-3 rounded-md flex items-start gap-3 ${
                lastSaveType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : lastSaveType === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                {lastSaveType === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className={`font-medium ${
                    lastSaveType === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {lastSaveMessage}
                  </span>
                  {lastSaveType === 'success' && (
                    <p className="text-sm text-green-600 mt-1">
                      Los cambios se han guardado en la base de datos correctamente.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Campos no editables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Este campo no se puede modificar</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                  Apellidos
                </label>
                <input
                  type="text"
                  value={formData.apellidos}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Este campo no se puede modificar</p>
              </div>
            </div>

            {/* Campos editables */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#2E748F' }}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Campo obligatorio. Se notificará si el email ya está en uso.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#2E748F' }}
                placeholder="+56 9 1234 5678"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional. Formato internacional recomendado.</p>
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.contrasena}
                  onChange={(e) => handleInputChange('contrasena', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#2E748F' }}
                  placeholder="Dejar en blanco para no cambiar"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" style={{ color: '#2E748F' }} />
                  ) : (
                    <Eye className="h-4 w-4" style={{ color: '#2E748F' }} />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.contrasena 
                  ? `Contraseña ingresada: ${formData.contrasena.length} caracteres`
                  : "Mínimo 6 caracteres. Deja en blanco si no quieres cambiarla"}
              </p>
            </div>

            {/* Confirmar Contraseña (solo mostrar si hay contraseña) */}
            {formData.contrasena && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmarContrasena}
                    onChange={(e) => handleInputChange('confirmarContrasena', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#2E748F' }}
                    placeholder="Repite la nueva contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 hover:bg-gray-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" style={{ color: '#2E748F' }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: '#2E748F' }} />
                    )}
                  </Button>
                </div>
                <p className={`text-xs mt-1 ${
                  formData.contrasena === formData.confirmarContrasena 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formData.contrasena === formData.confirmarContrasena 
                    ? '✅ Las contraseñas coinciden'
                    : '❌ Las contraseñas no coinciden'}
                </p>
              </div>
            )}

            {/* Estado del formulario */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Estado del formulario:</span>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li className="flex items-center gap-1">
                  {formData.email ? '✅' : '⭕'} Email {formData.email ? 'completado' : 'pendiente'}
                </li>
                <li className="flex items-center gap-1">
                  {formData.contrasena ? '🔑' : '🔒'} Contraseña {formData.contrasena ? 'nueva ingresada' : 'sin cambios'}
                </li>
                <li className="flex items-center gap-1">
                  {formData.telefono ? '📞' : '📱'} Teléfono {formData.telefono ? 'ingresado' : 'opcional'}
                </li>
              </ul>
            </div>

            {/* Botón de guardar */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-8 py-3 text-white font-medium rounded-md hover:opacity-90 transition-all duration-200 flex items-center gap-2"
                style={{ 
                  backgroundColor: isLoading ? '#94a3b8' : '#1398D6',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando cambios...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-500 text-center max-w-md">
                Al hacer clic en "Guardar Cambios", tus datos se actualizarán en tiempo real en nuestra base de datos segura.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
          <h3 className="font-medium mb-2" style={{ color: '#2E748F' }}>💡 Información útil</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Los cambios se guardan inmediatamente en la base de datos</li>
            <li>• Puedes actualizar tu correo, pero no debe estar en uso por otro usuario</li>
            <li>• La contraseña se encripta automáticamente por seguridad</li>
            <li>• Para verificar los cambios, cierra sesión y vuelve a ingresar</li>
          </ul>
        </div>
      </main>
    </div>
  );
}