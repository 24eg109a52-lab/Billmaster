import { BrowserRouter, Routes, Route } from "react-router-dom";
import BillMaster from "./BillMaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BillMaster />} />
        <Route path="/billmaster" element={<BillMaster />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;