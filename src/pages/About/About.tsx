import CircularGallery from "../../components/CircularGallery";
import Header from "../../components/Header/Header";

const About = () => {


  return (
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
            <div style={{ height: '700px' ,position: 'relative' }}>
  <CircularGallery bend={0.7} textColor="#ffffff" borderRadius={0.05} />
</div>
      </div>
    

  );
};

export default About;