// next.config.js (en la raíz del frontend)
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        // ¡ACTUALIZADO A 5001!
        destination: 'http://localhost:5001/api/auth/:path*', 
      },
    ];
  },
};

module.exports = nextConfig;