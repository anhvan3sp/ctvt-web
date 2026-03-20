import { useState, useRef, useEffect } from "react"
import api from "../api"
import Layout from "../components/Layout"

function ThuChi() {

  const inputTienRef = useRef(null)

  const [loai, setLoai] = useState("chi")
  const [soTien, setSoTien] = useState("")
  const [hinhThuc, setHinhThuc] = useState("tien_mat")
  const [loaiGiaoDich, setLoaiGiaoDich] = useState("do_dau")

  const thuOptions = [
    { value: "khach_tra_no", label: "Khách trả nợ" },
    { value: "khach_dat_hang", label: "Khách đặt hàng" },
    { value: "cho_hang_thue", label: "Chở hàng thuê" },
    { value: "thu_khac", label: "Thu khác" }
  ]

  const chiOptions = [
    { value: "do_dau", label: "Đổ dầu" },
    { value: "sua_xe", label: "Sửa xe" },
    { value: "dang_kiem", label: "Đăng kiểm" },
    { value: "tien_doi", label: "Tiền đò" },
    { value: "nop_tien", label: "Nộp tiền" },
    { value: "chi_khac", label: "Chi khác" }
  ]

  useEffect(() => {
    inputTienRef.current?.focus()
  }, [])

  useEffect(() => {
    if (loaiGiaoDich === "nop_tien") {
      setHinhThuc("tien_mat")
    }
  }, [loaiGiaoDich])

  const handleLoai = (type) => {
    setLoai(type)
    setLoaiGiaoDich(type === "thu" ? "khach_tra_no" : "do_dau")
  }

  const handleSubmit = async () => {

    if (!soTien) {
      alert("Chưa nhập số tiền")
      return
    }

    try {

      const res = await api.post("/thu-chi-nv/create", {
        loai,
        loai_giao_dich: loaiGiaoDich,
        so_tien: Number(soTien),
        hinh_thuc: hinhThuc
      })

      alert(res.data.message)
      setSoTien("")
      inputTienRef.current?.focus()

    } catch (err) {

      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Lỗi hệ thống"

      alert(msg)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  const options = loai === "thu" ? thuOptions : chiOptions

  return (
    <Layout>

      <h2>Thu Chi</h2>

      <div style={{ marginBottom: "20px" }}>

        <button onClick={() => handleLoai("thu")}
          style={{ background: loai === "thu" ? "#ddd" : "" }}>
          Thu
        </button>

        <button onClick={() => handleLoai("chi")}
          style={{ marginLeft: "10px", background: loai === "chi" ? "#ddd" : "" }}>
          Chi
        </button>

      </div>

      <div style={{ marginBottom: "15px" }}>

        <label>Loại giao dịch </label>

        <select value={loaiGiaoDich}
          onChange={(e) => setLoaiGiaoDich(e.target.value)}>

          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}

        </select>

      </div>

      <div style={{ marginBottom: "15px" }}>

        <label>Số tiền </label>

        <input
          ref={inputTienRef}
          value={soTien}
          onChange={(e) => setSoTien(e.target.value)}
          onKeyDown={handleKeyDown}
          type="number"
        />

      </div>

      <div style={{ marginBottom: "20px" }}>

        <label>Hình thức </label>

        <select
          value={hinhThuc}
          onChange={(e) => setHinhThuc(e.target.value)}
          disabled={loaiGiaoDich === "nop_tien"}
        >
          <option value="tien_mat">Tiền mặt</option>
          <option value="chuyen_khoan">Chuyển khoản</option>
        </select>

      </div>

      <button onClick={handleSubmit}>
        Lưu
      </button>

    </Layout>
  )
}

export default ThuChi