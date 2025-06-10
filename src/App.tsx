import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Preloader from "./components/Preloader/Preloader"; // Yeni preloader bileşeni

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa açıldığında 2 saniye loader göster
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <Preloader />;

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;
