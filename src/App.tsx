import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Preloader from "./components/Preloader/Preloader";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) return <Preloader onDone={() => setLoading(false)} />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/lost" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
