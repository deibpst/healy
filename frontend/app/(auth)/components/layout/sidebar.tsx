'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importar useRouter
import { Calendar, Home, List, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
	isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
	
	const pathname = usePathname();
	const router = useRouter(); // Inicializar useRouter
	
	const isActive = (path: string) => pathname.startsWith(path);
	
	// Función para manejar el cierre de sesión
	const handleLogout = () => {
		// 1. Eliminar el token de autenticación (clave usada en LoginForm.tsx)
		localStorage.removeItem('userToken');
		// 2. Redirigir al usuario a la página de login, que es la raíz (/)
		router.push('/login');
	};
	
	return (
		<div className={`${isOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden shrink-0`}>
			<div className="p-6 h-full flex flex-col justify-between">
				
				<div>
					<div className="flex items-center gap-2 mb-8">
						<div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-sm">RS</span>
						</div>
						<span className="font-semibold text-gray-800">Fisioterapia</span>
					</div>

					<div className="space-y-1">
						<div className="text-xs text-gray-500 uppercase tracking-wider mb-3">PAGES</div>
						
						
						<Link 
							href="/components/dashboard" 
							className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
								isActive('/components/dashboard') 
								? 'bg-blue-500 text-white shadow-sm' 
								: 'text-gray-600 hover:bg-gray-50'
							}`}
						>
							<Home size={20} />
							<span className="text-sm">Dashboard</span>
						</Link>

						<Link 
							href="/components/orderList" 
							className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
								isActive('/components/orderList') 
								? 'bg-blue-500 text-white shadow-sm' 
								: 'text-gray-600 hover:bg-gray-50'
							}`}
						>
							<List size={20} />
							<span className="text-sm">Order Lists</span>
						</Link>

						<Link 
							href="/calendar" 
							className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
								isActive('/calendar') 
								? 'bg-blue-500 text-white shadow-sm' 
								: 'text-gray-600 hover:bg-gray-50'
							}`}
						>
							<Calendar size={20} />
							<span className="text-sm font-medium">Calendar</span>
						</Link>
                        
					</div>
				</div>

				<div className="space-y-1 mt-auto">
					<Link href="/settings" className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
						<Settings size={20} />
						<span className="text-sm">Settings</span>
					</Link>
					
					{/* Botón de Cerrar Sesión: Llama a handleLogout */}
					<button 
						onClick={handleLogout} 
						className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					>
						<LogOut size={20} />
						<span className="text-sm font-medium">Cerrar sesión</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;