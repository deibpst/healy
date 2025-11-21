// C:\...\frontend\app\(auth)\citas\page.tsx

// ¡IMPORTACIÓN RELATIVA!
// El punto (.) indica "en este mismo directorio".
import FormulariodeSesiones from './formulariodesesiones'; 
import React from 'react';

export default function CitasRegistroPage() {
    
    // Definición del número de cita
    const numeroDeCita = "002"; 
    
    return (
        <main className="flex min-h-screen items-center justify-center py-10">
            {/* Renderización del componente */}
            <FormulariodeSesiones numeroCita={numeroDeCita} />
        </main>
    );
}