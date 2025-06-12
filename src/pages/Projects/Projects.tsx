

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Logo eklemek isterseniz */}
      {/* <img src="/logo.png" alt="Logo" className="mb-4 h-16 w-16" /> */}
      
      {/* Modern spinner */}
      <div className="relative h-12 w-12">
        <div className="absolute h-full w-full animate-spin-slow rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
      
      {/* Yükleme yazısı */}
      <p className="mt-4 text-sm font-medium text-gray-600">Yükleniyor...</p>
    </div>
  );
};

export default Preloader;