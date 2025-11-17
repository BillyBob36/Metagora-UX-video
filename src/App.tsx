import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from '@/components/ui/Toast';
import { Dashboard } from '@/pages/Dashboard';
import { ScenarioEditor } from '@/pages/ScenarioEditor';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scenario/:id" element={<ScenarioEditor />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
