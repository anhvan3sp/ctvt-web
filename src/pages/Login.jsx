import { useState } from "react"
import axios from "axios"

function Login() {

  const [maNV, setMaNV] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {

    setError("")
    setLoading(true)

    try {

      const formData = new URLSearchParams()

      formData.append("username", maNV.trim().toLowerCase())
      formData.append("password", password)
      formData.append("grant_type", "password")

      const res = await axios.post(
        "https://ctvt-core-api.onrender.com/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )

      const data = res.data

      // ---- lưu dữ liệu đăng nhập ----
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("ma_nv", data.ma_nv)
      localStorage.setItem("vai_tro", data.vai_tro)

      // reload app
      window.location.href = "/"

    } catch (err) {

      console.error(err)
      setError("Sai tài khoản hoặc mật khẩu")

    }

    setLoading(false)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Đăng nhập</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Mã nhân viên"
          value={maNV}
          onChange={(e) => setMaNV(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}

    </div>
  )
}

export default Login