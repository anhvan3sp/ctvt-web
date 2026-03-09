import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Purchase from "./pages/Purchase"
import Sale from "./pages/Sale"
import ReportDay from "./pages/ReportDay"

function App() {

  const token = localStorage.getItem("access_token")

  return (
    <Routes>

      {/* Login */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" /> : <Login />
        }
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          token ? <Dashboard /> : <Navigate to="/login" />
        }
      />

      {/* Nhập hàng */}
      <Route
        path="/purchase"
        element={
          token ? <Purchase /> : <Navigate to="/login" />
        }
      />

      {/* Bán hàng */}
      <Route
        path="/sale"
        element={
          token ? <Sale /> : <Navigate to="/login" />
        }
      />

      {/* Báo cáo ngày */}
      <Route
        path="/report-day"
        element={
          token ? <ReportDay /> : <Navigate to="/login" />
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App