import { useState, useEffect, useRef } from "react"
import api from "../api"
import Layout from "../components/Layout"

function PhatSinh() {

  const inputRefs = useRef([])

  // =========================
  // CREATE ROW
  // =========================
  const createRow = () => ({
    loai: "chi",
    loai_giao_dich: "do_dau",
    so_tien: "",
    dien_giai: ""
  })

  const [rows, setRows] = useState([createRow()])
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  // =========================
  // OPTIONS
  // =========================
  const thuOptions = [
    { value: "thu_khac", label: "Thu khác" },
    { value: "nop_them", label: "Nộp thêm" }
  ]

  const chiOptions = [
    { value: "do_dau", label: "Đổ dầu" },
    { value: "tien_do", label: "Tiền đò" },
    { value: "nop_tien", label: "Nộp tiền" },
    { value: "sua_xe", label: "Sửa xe" },
    { value: "dang_kiem", label: "Đăng kiểm" },
    { value: "chi_khac", label: "Chi khác" }
  ]

  // =========================
  // LOAD DATA
  // =========================
  const loadToday = async () => {
    try {
      const res = await api.get("/phat-sinh/today")
      setList(res.data)
    } catch (err) {
      alert("Lỗi load dữ liệu")
    }
  }

  useEffect(() => {
    loadToday()
    inputRefs.current[0]?.focus()
  }, [])

  // =========================
  // UPDATE ROW
  // =========================
  const update = (i, field, value) => {
    const newRows = [...rows]
    newRows[i][field] = value

    if (field === "loai") {
      newRows[i].loai_giao_dich =
        value === "thu" ? "thu_khac" : "do_dau"
    }

    setRows(newRows)
  }

  // =========================
  // ADD / REMOVE ROW
  // =========================
  const addRow = () => {
    setRows([...rows, createRow()])

    setTimeout(() => {
      inputRefs.current[rows.length]?.focus()
    }, 0)
  }

  const removeRow = (i) => {
    setRows(rows.filter((_, idx) => idx !== i))
  }

  // =========================
  // CREATE NHÁP (THÊM FORCE)
  // =========================
  const submitRow = async (r, force = false) => {
    return await api.post("/phat-sinh/create", {
      ngay: new Date().toISOString().slice(0, 10),
      loai: r.loai,
      loai_giao_dich: r.loai_giao_dich,
      so_tien: Number(r.so_tien),
      dien_giai: r.dien_giai,
      force // 🔥 thêm
    })
  }

  // =========================
  // SUBMIT ALL (WARNING FLOW)
  // =========================
  const handleSubmit = async () => {

    if (loading) return
    setLoading(true)

    try {

      for (let r of rows) {
        if (!r.so_tien) continue

        const res = await submitRow(r)

        // 🔥 HANDLE WARNING
        if (res.data?.warning) {

          const ok = window.confirm(
            res.data.message + "\nVẫn lưu?"
          )

          if (ok) {
            await submitRow(r, true)
          } else {
            continue
          }
        }
      }

      alert("Đã lưu nháp")

      setRows([createRow()])
      inputRefs.current[0]?.focus()

      loadToday()

    } catch (err) {

      const msg =
        err.response?.data?.detail ||
        "Lỗi hệ thống"

      alert(msg)

    } finally {
      setLoading(false)
    }
  }

  // =========================
  // CONFIRM
  // =========================
  const confirm = async (id) => {
    try {
      await api.post("/phat-sinh/confirm", { id })
      loadToday()
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi xác nhận")
    }
  }

  // =========================
  // CANCEL (HUỶ - chuyển trạng thái)
  // =========================
  const cancel = async (id) => {

    const ok = window.confirm("Huỷ sẽ chuyển trạng thái, không xoá dữ liệu. Tiếp tục?")
    if (!ok) return

    try {
      await api.post("/phat-sinh/cancel", { id })
      loadToday()
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi huỷ")
    }
  }

  // =========================
  // DELETE DRAFT (XOÁ THẬT)
  // =========================
  const deleteDraft = async (id) => {

    const ok = window.confirm("Xoá nháp sẽ mất dữ liệu. Tiếp tục?")
    if (!ok) return

    try {
      await api.post("/phat-sinh/delete", { id })
      loadToday()
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi xoá")
    }
  }

  // =========================
  // KEYBOARD
  // =========================
  const handleKeyDown = (e, i) => {
    if (e.key === "Enter") {
      if (i === rows.length - 1) {
        addRow()
      } else {
        inputRefs.current[i + 1]?.focus()
      }
    }
  }

  // =========================
  // RENDER
  // =========================
  return (
    <Layout>

      <h2>Phát sinh</h2>

      {/* ================= FORM ================= */}
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
              placeholder="Số tiền"
              style={{ width: "120px" }}
            />

            <input
              value={r.dien_giai}
              onChange={(e) => update(i, "dien_giai", e.target.value)}
              placeholder="Diễn giải"
              style={{ width: "200px" }}
            />

            <button onClick={() => removeRow(i)}>X</button>

          </div>
        )
      })}

      <button onClick={addRow}>+ Thêm dòng</button>

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu nháp"}
      </button>

      <hr />

      {/* ================= LIST ================= */}
      <h3>Hôm nay</h3>

      {list.map(item => (

        <div key={item.id} style={{
          borderBottom: "1px solid #ccc",
          padding: "5px"
        }}>

          <b>{item.loai.toUpperCase()}</b> |
          {" "}{Number(item.so_tien).toLocaleString()} |
          {" "}{item.loai_giao_dich} |
          {" "}{item.trang_thai}

          {" "}

          {/* NHÁP */}
          {item.trang_thai === "nhap" && (
            <>
              <button onClick={() => confirm(item.id)}>
                Xác nhận
              </button>

              <button onClick={() => deleteDraft(item.id)}>
                Xoá
              </button>
            </>
          )}

          {/* ĐÃ XÁC NHẬN */}
          {item.trang_thai === "xac_nhan" && (
            <button onClick={() => cancel(item.id)}>
              Huỷ
            </button>
          )}

        </div>
      ))}

    </Layout>
  )
}

export default PhatSinh