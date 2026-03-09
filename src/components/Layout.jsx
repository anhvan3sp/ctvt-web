import { Link } from "react-router-dom"

function Layout({ children }) {

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("ma_nv")
    localStorage.removeItem("vai_tro")

    window.location.href = "/login"
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}>

        <h2>GAS VĂN THUỶ</h2>

        <div style={{ marginTop: "30px" }}>

          <p>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Bảng điều khiển
            </Link>
          </p>

          <p>
            <Link to="/purchase" style={{ color: "white", textDecoration: "none" }}>
              Nhập hàng
            </Link>
          </p>

          <p>
            <Link to="/sale" style={{ color: "white", textDecoration: "none" }}>
              Bán hàng
            </Link>
          </p>

          {/* 🔥 Báo cáo ngày */}
          <p>
            <Link to="/report-day" style={{ color: "white", textDecoration: "none" }}>
              Báo cáo ngày
            </Link>
          </p>

        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "40px",
            padding: "8px",
            width: "100%"
          }}
        >
          Đăng xuất
        </button>

      </div>

      {/* Nội dung */}
      <div style={{ flex: 1, padding: "40px" }}>
        {children}
      </div>

    </div>
  )
}

export default Layout