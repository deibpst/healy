"use client";

import React, { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
	onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
	const router = useRouter();
	const [searchText, setSearchText] = useState("");

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchText(value);

		// REDIRIGE A /pacientes con la búsqueda en el query
		router.push(`/pacientes?search=${encodeURIComponent(value)}`);
	};

	return (
		<div className="bg-white border-b border-gray-200 px-8 py-8 sticky top-0 z-10">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg">
						<Menu size={20} className="text-gray-600" />
					</button>

					<div className="relative">
						<Search
							size={18}
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						/>
						<input
							type="text"
							placeholder="Buscar pacientes…"
							value={searchText}
							onChange={handleSearchChange}
							className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
						/>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<button className="relative p-2 hover:bg-gray-100 rounded-lg">
						<Bell size={20} className="text-gray-600" />
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
					</button>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-[#337790] to-[#6ed0eb] rounded-full"></div>
						<span className="text-lg font-medium text-gray-700">User</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
