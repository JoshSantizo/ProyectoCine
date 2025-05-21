// next.config.js (o next.config.ts)
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... otras configuraciones ...

  images: {
    domains: [
      'm.media-amazon.com',
      'encrypted-tbn0.gstatic.com',
      'es.web.img3.acsta.net',
      'es.web.img2.acsta.net',
      'i.pinimg.com',
      'xl.movieposterdb.com', // <--- ¡Añadido este nuevo dominio!
      // Aquí añadirás cualquier otro dominio que te dé el mismo error en el futuro.
    ],
  },

};

module.exports = nextConfig;
