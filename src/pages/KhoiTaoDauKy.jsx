import { useState } from "react"
import axios from "axios"

export default function KhoiTaoDauKy() {

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // DOWNLOAD TEMPLATE (FIX CHUẨN)
  const downloadTemplate = async () => {
    const res = await axios.get("/system/export-dau-ky-template", {
      responseType: "blob"
    })

    const url = window.URL.createObjectURL(new Blob([res.data]))

    const a = document.createElement("a")
    a.href = url
    a.download = "template_dau_ky.xlsx"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  // UPLOAD FILE
  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  // IMPORT
  const handleSubmit = async () => {

    if (!file) {
      alert("Chọn file trước")
      return
    }

    if (!window.confirm("Xác nhận import?")) return

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("/system/import-dau-ky?mode=reset", formData)
      
      if (res.data.status === "error") {
        alert(res.data.errors.join("\n"))
      } else {
        alert("Import thành công")
      }

    } catch (err) {
      alert("Lỗi import")
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Khởi tạo đầu kỳ</h2>

      <button onClick={downloadTemplate}>
        📥 Tải file mẫu
      </button>

      <br /><br />

      <input type="file" onChange={handleFile} />

      <br /><br />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: "red",
          color: "white",
          padding: 10
        }}
      >
        {loading ? "Đang xử lý..." : "Import"}
      </button>

    </div>
  )
}