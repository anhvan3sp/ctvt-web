import { useEffect, useState } from "react"
import axios from "axios"

const API = "https://ctvt-core-api.onrender.com"

export default function Purchase() {

  const token = localStorage.getItem("access_token")

  const [suppliers, setSuppliers] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])

  const [maNcc, setMaNcc] = useState("")
  const [maKho, setMaKho] = useState("")
  const [cash, setCash] = useState(0)
  const [transfer, setTransfer] = useState(0)

  const [items, setItems] = useState([
    { ma_sp: "", so_luong: 1, don_gia: 0 }
  ])

  // =============================
  // Load dropdown data
  // =============================
  useEffect(() => {
    fetchSuppliers()
    fetchWarehouses()
    fetchProducts()
  }, [])

  const fetchSuppliers = async () => {
    const res = await axios.get(`${API}/suppliers`)
    setSuppliers(res.data)
  }

  const fetchWarehouses = async () => {
    const res = await axios.get(`${API}/warehouses`)
    setWarehouses(res.data)
  }

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`)
    setProducts(res.data)
  }

  // =============================
  // Item logic
  // =============================
  const handleItemChange = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  const addRow = () => {
    setItems([...items, { ma_sp: "", so_luong: 1, don_gia: 0 }])
  }

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce(
    (sum, i) => sum + Number(i.so_luong) * Number(i.don_gia),
    0
  )

  const totalPayment = Number(cash) + Number(transfer)
  const diff = totalPayment - total

  // =============================
  // Submit
  // =============================
  const handleSubmit = async () => {

    if (!maNcc) return alert("Chưa chọn nhà cung cấp")
    if (!maKho) return alert("Chưa chọn kho")

    if (items.some(i => !i.ma_sp))
      return alert("Có dòng chưa chọn sản phẩm")

    if (diff !== 0)
      return alert("Thanh toán chưa khớp tổng tiền")

    const data = {
      ngay: new Date().toISOString().split("T")[0],
      ma_ncc: maNcc,
      ma_kho: maKho,
      tien_mat: Number(cash),
      tien_ck: Number(transfer),
      items: items
    }

    try {
      await axios.post(`${API}/purchase`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Nhập hàng thành công")

      setMaNcc("")
      setMaKho("")
      setCash(0)
      setTransfer(0)
      setItems([{ ma_sp: "", so_luong: 1, don_gia: 0 }])

    } catch (err) {
      console.error(err)
      alert("Lỗi nhập hàng")
    }
  }

  return (
    <div style={{ padding: 30, maxWidth: 1100, margin: "auto" }}>
      <h2>Nhập hàng</h2>

      {/* NCC & Kho */}
      <div style={{ marginBottom: 20 }}>
        <select value={maNcc} onChange={e => setMaNcc(e.target.value)}>
          <option value="">Chọn nhà cung cấp</option>
          {suppliers.map(s => (
            <option key={s.ma_ncc} value={s.ma_ncc}>
              {s.ma_ncc} - {s.ten_ncc}
            </option>
          ))}
        </select>

        <select
          value={maKho}
          onChange={e => setMaKho(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option value="">Chọn kho</option>
          {warehouses.map(w => (
            <option key={w.ma_kho} value={w.ma_kho}>
              {w.ma_kho} - {w.ten_kho}
            </option>
          ))}
        </select>
      </div>

      {/* Bảng sản phẩm */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <select
                  value={item.ma_sp}
                  onChange={e =>
                    handleItemChange(index, "ma_sp", e.target.value)
                  }
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(p => (
                    <option key={p.ma_sp} value={p.ma_sp}>
                      {p.ma_sp} - {p.ten_sp}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input
                  type="number"
                  value={item.so_luong}
                  onChange={e =>
                    handleItemChange(index, "so_luong", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={item.don_gia}
                  onChange={e =>
                    handleItemChange(index, "don_gia", e.target.value)
                  }
                />
              </td>

              <td>
                {(item.so_luong * item.don_gia).toLocaleString()}
              </td>

              <td>
                <button onClick={() => removeRow(index)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} style={{ marginTop: 10 }}>
        + Thêm dòng
      </button>

      {/* Thanh toán */}
      <div
        style={{
          marginTop: 30,
          border: "1px solid #ccc",
          padding: 15,
          maxWidth: 500
        }}
      >
        <h3>Thanh toán</h3>

        <div><strong>Tổng tiền:</strong> {total.toLocaleString()}</div>

        <div style={{ marginTop: 10 }}>
          <label>Tiền mặt: </label>
          <input
            type="number"
            value={cash}
            onChange={e => setCash(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Chuyển khoản: </label>
          <input
            type="number"
            value={transfer}
            onChange={e => setTransfer(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Tổng thanh toán:</strong> {totalPayment.toLocaleString()}
        </div>

        <div
          style={{
            marginTop: 5,
            color: diff === 0 ? "green" : "red"
          }}
        >
          <strong>Chênh lệch:</strong> {diff.toLocaleString()}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={diff !== 0}
        style={{
          marginTop: 20,
          backgroundColor: diff === 0 ? "#28a745" : "#ccc",
          color: "white",
          padding: "8px 15px",
          border: "none",
          cursor: diff === 0 ? "pointer" : "not-allowed"
        }}
      >
        Lưu hóa đơn
      </button>
    </div>
  )
}