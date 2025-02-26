
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditService from "./pages/EditService";
import EditCommunity from "./pages/EditCommunity";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/service/:id/edit" element={<EditService />} />
        <Route path="/community/:id/edit" element={<EditCommunity />} />
      </Routes>
    </Router>
  );
}
