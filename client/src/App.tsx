import './App.css'
import DropCV from './components/DropCV'
import Footer from './components/Footer'
import Header from './components/Header'
import Score from './components/Score'
import Features from './Features'
import Hero from './Hero'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    <Header />
    <Routes>
      {/* Home page route */}
      <Route
        path="/"
        element={
          <>
            <Hero />
            <Features />
            <DropCV />
            <Footer />
          </>
        }
      />
      
      {/* Analysis page */}
      <Route path="/analyze" element={<Score shouldFetch={false} onFetchComplete={() => {}} />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
