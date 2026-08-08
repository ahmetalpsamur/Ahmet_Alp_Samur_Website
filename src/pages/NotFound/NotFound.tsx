import { Link } from "react-router-dom";

import FuzzyText from "../../components/FuzzyText";
import videoBg from "../../assets/Video/404-video/404_background_cut_delete.mp4";

const NotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 h-full w-full object-cover opacity-70"
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center text-[#EAEAEA]">
        <div className="mb-4 max-w-full [&>canvas]:h-auto [&>canvas]:max-w-full">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover
            fontSize="9rem"
            fontWeight={900}
            color="#ffffff"
          >
            404
          </FuzzyText>
        </div>
        <h2 className="mb-6 text-3xl font-semibold">
          Kayboldun, belki de kaybolmak istedin; kim bilir?
        </h2>
        <p className="mb-8 max-w-2xl text-lg">
          Bu koordinatlarda bir sayfa yok. Ana üsse dönüp yeni bir rota çizelim!
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-black transition duration-300 hover:scale-105 hover:bg-gray-200"
        >
          Ana Üsse Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
