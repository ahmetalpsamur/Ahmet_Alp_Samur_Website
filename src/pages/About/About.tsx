import CircularGallery from "../../components/CircularGallery";
import Header from "../../components/Header/Header";

const About = () => {


  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <div style={{ height: '700px', position: 'relative' }}>
        <CircularGallery bend={0.7} textColor="#ffffff" borderRadius={0.05} isInfinite={false}/>
      </div>
    </div>
    


  );
};

export default About;