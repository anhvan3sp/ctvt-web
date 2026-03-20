import { Link, useLocation } from "react-router-dom"

function Layout({ children }) {

  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("ma_nv")
    localStorage.removeItem("vai_tro")
    window.location.href = "/login"
  }

  const menuStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    display: "block",
    padding: "8px 10px",
    borderRadius: "4px",
    background: location.pathname === path ? "#334155" : "transparent"
  })

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      <div style={{
        width: "230px",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>

        <div>

          <h2 style={{ marginBottom: "30px" }}>
            GAS VĂN THUỶ
          </h2>

          <div>

            <Link to="/" style={menuStyle("/")}>Bảng điều khiển</Link>
            <Link to="/purchase" style={menuStyle("/purchase")}>Nhập hàng</Link>
            <Link to="/sale" style={menuStyle("/sale")}>Bán hàng</Link>
            <Link to="/thu-chi" style={menuStyle("/thu-chi")}>Thu chi</Link>
            <Link to="/report-day" style={menuStyle("/report-day")}>Báo cáo ngày</Link>

            {/* ✅ thêm */}
            <Link to="/khoi-tao-dau-ky" style={menuStyle("/khoi-tao-dau-ky")}>
              Khởi tạo đầu kỳ
            </Link>

          </div>
        </div>

        <button onClick={handleLogout} style={{
          padding: "10px",
          width: "100%",
          border: "none",
          background: "#e5e7eb",
          cursor: "pointer"
        }}>
          Đăng xuất
        </button>

      </div>

      <div style={{
        flex: 1,
        padding: "40px",
        background: "#f3f4f6"
      }}>
        {children}
      </div>

    </div>
  )
}

export default Layout