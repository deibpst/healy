'use client';

import { useState } from "react";
import { Activity, LogOut, User, Eye, EyeOff, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  
  // Datos del paciente (estos vendrían de tu backend)
  const [formData, setFormData] = useState({
    nombre: "Juan Carlos",
    apellido: "Rodríguez López",
    edad: 32,
    email: "juan.rodriguez@email.com",
    telefono: "+56 9 8765 4321",
    password: "mipassword123"
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    
    // Simular llamada API
    setTimeout(() => {
      setIsLoading(false);
      alert('Cambios guardados exitosamente');
    }, 1000);
  };

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
                onClick={() => {
                  window.location.href = '/login';
                }}
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
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Edad
              </label>
              <input
                type="number"
                value={formData.edad}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Campos editables */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#2E748F' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                style={{ borderColor: '#2E748F' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E748F' }}>
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border-2 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ borderColor: '#2E748F' }}
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
            </div>

            

            {/* Botón de guardar */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-8 py-2 text-white font-medium rounded-md hover:opacity-90 transition-all duration-200 flex items-center gap-2"
                style={{ 
                  backgroundColor: isLoading ? '#94a3b8' : '#1398D6',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}