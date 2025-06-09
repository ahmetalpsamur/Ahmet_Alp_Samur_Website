import React from 'react';
import { Link } from 'react-router-dom';
import videoBg from '../../assets/Video/404-video/404_background_cut_delete.mp4';

const NotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Video Background (MP4 + WebM) */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-[#EAEAEA] p-4 text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Kayboldun Belki de Kaybolmak istedin kim bilir ?</h2>
        <p className="text-lg mb-8 max-w-2xl">
          Bu koordinatlarda bir sayfa yok. Ana üsse dönüp yeni bir rota çizelim!
        </p>
        <Link 
          to="/" 
          className="inline-block px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition duration-300 hover:scale-105"
        >
          Ana Üsse Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;