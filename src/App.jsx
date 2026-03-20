import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Purchase from "./pages/Purchase"
import Sale from "./pages/Sale"
import ReportDay from "./pages/ReportDay"
import ThuChi from "./pages/ThuChi"
import KhoiTaoDauKy from "./pages/KhoiTaoDauKy" // ✅ thêm

function App() {

  const token = localStorage.getItem("access_token")

  return (
    <Routes>

      <Route path="/login"
        element={token ? <Navigate to="/" /> : <Login />}
      />

      <Route path="/"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route path="/purchase"
        element={token ? <Purchase /> : <Navigate to="/login" />}
      />

      <Route path="/sale"
        element={token ? <Sale /> : <Navigate to="/login" />}
      />

      <Route path="/thu-chi"
        element={token ? <ThuChi /> : <Navigate to="/login" />}
      />

      <Route path="/report-day"
        element={token ? <ReportDay /> : <Navigate to="/login" />}
      />

      {/* ✅ thêm */}
      <Route path="/khoi-tao-dau-ky"
        element={token ? <KhoiTaoDauKy /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App