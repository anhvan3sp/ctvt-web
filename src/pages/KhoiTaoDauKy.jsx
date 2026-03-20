import { useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"

export default function KhoiTaoDauKy() {

  const [data, setData] = useState(null)
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)

  // =========================
  // IMPORT EXCEL
  // =========================
  const handleFile = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()

    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" })

      const ton_kho = XLSX.utils.sheet_to_json(wb.Sheets["ton_kho"])
      const quy_nv = XLSX.utils.sheet_to_json(wb.Sheets["quy_nhan_vien"])
      const quy_ct = XLSX.utils.sheet_to_json(wb.Sheets["quy_cong_ty"])

      const payload = {
        ngay: new Date().toISOString().slice(0, 10),
        ton_kho: ton_kho,
        quy_nhan_vien: quy_nv,
        quy_cong_ty: quy_ct[0]?.tien_mat || 0,
        cong_no_khach: [],
        cong_no_ncc: []
      }

      setData(payload)
      setPreview(true)
    }

    reader.readAsBinaryString(file)
  }

  // =========================
  // CONFIRM
  // =========================
  const handleSubmit = async () => {

    if (!window.confirm("⚠️ Xác nhận khởi tạo? (KHÔNG hoàn tác)"))
      return

    setLoading(true)

    try {
      await axios.post("/system/khoi-tao-dau-ky", data)
      alert("✅ Thành công")
      setPreview(false)
    } catch (err) {
      alert("❌ Lỗi")
    }

    setLoading(false)
  }

  return (
    <div>

      <h2>Khởi tạo đầu kỳ (Excel)</h2>

      {/* IMPORT */}
      <input type="file" onChange={handleFile} />

      {/* PREVIEW */}
      {preview && (
        <div style={{ marginTop: 20 }}>

          <h3>Preview</h3>

          <p><b>Tồn kho:</b> {data.ton_kho.length} dòng</p>
          <p><b>Quỹ NV:</b> {data.quy_nhan_vien.length} dòng</p>
          <p><b>Quỹ CT:</b> {data.quy_cong_ty}</p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: "red",
              color: "white",
              padding: "10px"
            }}
          >
            {loading ? "Đang xử lý..." : "XÁC NHẬN KHỞI TẠO"}
          </button>

        </div>
      )}

    </div>
  )
}