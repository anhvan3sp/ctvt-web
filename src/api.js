import axios from "axios"

const api = axios.create({
  baseURL: "https://ctvt-core-api.onrender.com", // 🔥 KHÔNG thêm / ở cuối
  timeout: 15000 // 🔥 tránh treo request
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 🔥 đảm bảo không bị double slash
  if (config.url?.startsWith("/")) {
    config.url = config.url.slice(1)
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {

    // 🔥 log để debug
    console.error("API ERROR:", err?.config?.url, err?.response?.status)

    if (err.response?.status === 401) {
      alert("Hết phiên đăng nhập")
      localStorage.removeItem("access_token")
      window.location.href = "/login"
    }

    return Promise.reject(err)
  }
)

export default api