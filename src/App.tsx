
import { Routes, Route } from "react-router-dom";
import Communities from "./pages/Communities";
import Transactions from "./pages/Transactions";
import AdminTransactions from "./pages/admin/AdminTransactions";

function App() {
  return (
    <Routes>
      <Route path="/communities" element={<Communities />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/a/admin/transactions" element={<AdminTransactions />} />
    </Routes>
  );
}

export default App;
