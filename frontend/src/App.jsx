import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import ExplainableAI from './pages/ExplainableAI';
import Recommendations from './pages/Recommendations';
import Map from './pages/Map';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/explainable" element={<ExplainableAI />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;