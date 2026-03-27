import axios from "axios"

const api = axios.create({
  baseURL: "https://ctvt-core-api.onrender.com", // 🔥 KHÔNG thêm / ở cuối
  timeout: 15000 // 🔥 tránh treo request
})

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 🔥 tránh double slash
  if (config.url?.startsWith("/")) {
    config.url = config.url.slice(1)
  }

  return config
})

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (res) => res,
  (err) => {

    // 🔥 LOG DEBUG (QUAN TRỌNG)
    console.error(
      "API ERROR:",
      err?.config?.method?.toUpperCase(),
      err?.config?.url,
      err?.response?.status,
      err?.response?.data
    )

    // 🔥 TOKEN HẾT HẠN
    if (err.response?.status === 401) {
      alert("Hết phiên đăng nhập")
      localStorage.removeItem("access_token")
      localStorage.removeItem("ma_nv")
      localStorage.removeItem("vai_tro")
      window.location.href = "/login"
    }

    // 🔥 NETWORK ERROR (Render hay bị)
    if (!err.response) {
      alert("Không kết nối được server")
    }

    return Promise.reject(err)
  }
)

// =========================
// 🔥 OPTIONAL: API GROUP (CHO SẠCH CODE)
// =========================

export const phatSinhAPI = {
  create: (data) => api.post("/phat-sinh/create", data),
  confirm: (id) => api.post("/phat-sinh/confirm", { id }),
  cancel: (id) => api.post("/phat-sinh/cancel", { id }),
  today: () => api.get("/phat-sinh/today"),
}

export const thuChiAPI = {
  create: (data) => api.post("/thu-chi-nv/create", data),
}

export default api