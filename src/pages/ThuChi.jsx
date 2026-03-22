import { useState, useRef, useEffect } from "react"
import api from "../api"
import Layout from "../components/Layout"

function ThuChi() {

  const inputRefs = useRef([])

  const [rows, setRows] = useState([
    { loai: "chi", loai_giao_dich: "do_dau", so_tien: "", hinh_thuc: "tien_mat" }
  ])

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
    inputRefs.current[0]?.focus()
  }, [])

  const update = (i, field, value) => {
    const newRows = [...rows]

    newRows[i][field] = value

    // auto logic
    if (field === "loai") {
      newRows[i].loai_giao_dich =
        value === "thu" ? "khach_tra_no" : "do_dau"
    }

    if (field === "loai_giao_dich" && value === "nop_tien") {
      newRows[i].hinh_thuc = "tien_mat"
    }

    setRows(newRows)
  }

  const addRow = () => {
    setRows([
      ...rows,
      { loai: "chi", loai_giao_dich: "do_dau", so_tien: "", hinh_thuc: "tien_mat" }
    ])

    setTimeout(() => {
      inputRefs.current[rows.length]?.focus()
    }, 0)
  }

  const removeRow = (i) => {
    setRows(rows.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async () => {

    try {

      for (let r of rows) {

        if (!r.so_tien) continue

        await api.post("/thu-chi-nv/create", {
          loai: r.loai,
          loai_giao_dich: r.loai_giao_dich,
          so_tien: Number(r.so_tien),
          hinh_thuc: r.hinh_thuc
        })
      }

      alert("OK")

      setRows([
        { loai: "chi", loai_giao_dich: "do_dau", so_tien: "", hinh_thuc: "tien_mat" }
      ])

      inputRefs.current[0]?.focus()

    } catch (err) {

      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Lỗi hệ thống"

      alert(msg)
    }
  }

  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      if (i === rows.length - 1) {
        addRow()
      } else {
        inputRefs.current[i + 1]?.focus()
      }
    }
  }

  return (
    <Layout>

      <h2>Thu Chi</h2>

      {rows.map((r, i) => {

        const options = r.loai === "thu" ? thuOptions : chiOptions

        return (
          <div key={i} style={{ marginBottom: "10px" }}>

            <select
              value={r.loai}
              onChange={(e) => update(i, "loai", e.target.value)}
            >
              <option value="thu">Thu</option>
              <option value="chi">Chi</option>
            </select>

            <select
              value={r.loai_giao_dich}
              onChange={(e) => update(i, "loai_giao_dich", e.target.value)}
            >
              {options.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <input
              ref={el => inputRefs.current[i] = el}
              value={r.so_tien}
              onChange={(e) => update(i, "so_tien", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              type="number"
              style={{ width: "120px" }}
            />

            <select
              value={r.hinh_thuc}
              onChange={(e) => update(i, "hinh_thuc", e.target.value)}
              disabled={r.loai_giao_dich === "nop_tien"}
            >
              <option value="tien_mat">Tiền mặt</option>
              <option value="chuyen_khoan">Chuyển khoản</option>
            </select>

            <button onClick={() => removeRow(i)}>X</button>

          </div>
        )
      })}

      <button onClick={addRow}>+ Thêm dòng</button>

      <br /><br />

      <button onClick={handleSubmit}>
        Lưu tất cả
      </button>

    </Layout>
  )
}

export default ThuChi