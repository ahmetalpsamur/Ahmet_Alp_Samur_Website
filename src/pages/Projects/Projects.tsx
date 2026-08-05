import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CardSwap, { Card } from "../../components/CardSwap";

const Projects = () => {
  return (

    <div className="flex h-screen overflow-hidden">
      {/* Sol taraf */}
      <div className="w-1/2 bg-gray-800 text-white flex items-center justify-center">
        Sol Taraf
      </div>

      {/* Sağ taraf */}
      <div className="w-1/2 bg-gray-200 text-black flex items-center justify-center">
        <div style={{ height: '500px', width: '350px', position: 'relative' }}>
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={false}
            skewAmount={1}
          >
            <Card>
              <h3>Card 1</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 2</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 3</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 4</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 5</h3>
              <p>Your content here</p>
            </Card>
            <Card>
              <h3>Card 6</h3>
              <p>Your content here</p>
            </Card>
          </CardSwap>

        </div>
      </div>
    </div>



  );
};

export default Projects;