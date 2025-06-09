import React from "react";
import Header from "../components/Header/Header";
const Home = () => {
  return (
    <div>
      <Header />
      <h1 className="text-4xl font-bold text-white mb-4">
        Hoş Geldiniz!
      </h1>
      <p className="text-gray-300 text-lg">
        Bu benim React + Tailwind ile yaptığım basit kişisel web sitem.
      </p>
    </div>
  );
};

export default Home;
