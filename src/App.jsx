// App.jsx
import Header from "./components/Headerr";
import Hero from "./components/Hero";
import Logoslider from "./components/Logoslider";
import FeatureCard from "./components/FeatureCards";
import FeatureRows from "./components/FeatureRows";
import TestimonialWall from "./components/TestimonialWall";
import FAQ from "./components/FAQ";
import HeroGradient from "./components/HeroGradient";
import Footer from "./components/Footer";

import ContactSales from "./components/ContactSales";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import { Routes, Route } from "react-router-dom";

function Home() {
  return (
    <>
      <Hero />
      <Logoslider />
      <FeatureCard />
      <FeatureRows />
      <TestimonialWall />
      <FAQ />
      <HeroGradient />
    </>
  );
}

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Footer />
            </>
          }
        />
        <Route 
          path="/auth" 
          element={
          <Login />
          } 
        />
        <Route 
          path="/auth/register" 
          element={
          <Register />
          } 
        /> 
        {/* 추가 */}
        <Route
          path="/contact"
          element={
            <>
              <ContactSales />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
