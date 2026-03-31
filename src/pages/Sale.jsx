import { useEffect, useState } from "react"
import axios from "axios"

function Sale() {

  const token = localStorage.getItem("access_token")
  const headers = { Authorization: `Bearer ${token}` }

  let maNV = ""
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      maNV = payload.sub || ""
    } catch (e) {
      console.log("Không đọc được token")
    }
  }

  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])

  const [searchKH, setSearchKH] = useState("")

  const [maKH, setMaKH] = useState("")
  const [maKho, setMaKho] = useState("")
  const [ngay, setNgay] = useState(new Date().toISOString().split("T")[0])

  const [items, setItems] = useState([
    { ma_sp: "", so_luong: 1, don_gia: 0 }
  ])

  const [tienMat, setTienMat] = useState(0)
  const [tienCK, setTienCK] = useState(0)

  // ===== TODAY =====
  const [todayList, setTodayList] = useState([])

  const loadToday = async () => {
    try {
      const res = await axios.get(
        "https://ctvt-core-api.onrender.com/sale/today",
        { headers }
      )
      setTodayList(res.data)
    } catch {
      setTodayList([])
    }
  }

  useEffect(() => {

    axios.get("https://ctvt-core-api.onrender.com/customer/", { headers })
      .then(res => setCustomers(res.data))

    axios.get("https://ctvt-core-api.onrender.com/products/", { headers })
      .then(res => {
        const ps = res.data
        setProducts(ps)

        const gas12 = ps.find(p =>
          p.ten_sp?.toLowerCase().includes("12")
        )

        if (gas12) {
          setItems([
            { ma_sp: gas12.ma_sp, so_luong: 1, don_gia: 0 }
          ])
        }
      })

    axios.get("https://ctvt-core-api.onrender.com/warehouses/", { headers })
      .then(res => {
        const ws = res.data
        setWarehouses(ws)

        if (maNV === "thao") {
          const k = ws.find(w =>
            w.ten_kho?.toLowerCase().includes("lương")
          )
          if (k) setMaKho(k.ma_kho)
        }

        if (maNV === "thuy" || maNV === "cong") {
          const k = ws.find(w =>
            w.ten_kho?.toLowerCase().includes("bắc")
          )
          if (k) setMaKho(k.ma_kho)
        }
      })

    loadToday()

  }, [])

  const filteredCustomers = customers.filter(c =>
    c.ten_cua_hang?.toLowerCase().includes(searchKH.toLowerCase())
  )

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const addRow = () => {
    setItems([...items, { ma_sp: "", so_luong: 1, don_gia: 0 }])
  }

  const tongTien = items.reduce(
    (sum, item) => sum + (Number(item.so_luong) * Number(item.don_gia)),
    0
  )

  const handleSubmit = async (force = false) => {

    if (!maKH || !maKho) {
      alert("Chọn khách và kho")
      return
    }

    const validItems = items.filter(i => i.ma_sp && i.so_luong > 0)

    if (validItems.length === 0) {
      alert("Chưa chọn sản phẩm")
      return
    }

    const data = {
      ngay,
      ma_kh: maKH,
      ma_kho: maKho,
      tien_mat: tienMat,
      tien_ck: tienCK,
      items: validItems,
      force
    }

    try {

      await axios.post(
        "https://ctvt-core-api.onrender.com/sale/",
        data,
        { headers }
      )

      alert("Đã lưu nháp")
      loadToday()

    } catch (err) {

      if (err.response?.status === 409 && !force) {
        const ok = window.confirm("Hoá đơn trùng. Vẫn tạo?")
        if (ok) await handleSubmit(true)
      } else {
        alert("Lỗi khi lưu")
      }
    }
  }

  const handleConfirm = async (id) => {
    try {
      await axios.post(
        `https://ctvt-core-api.onrender.com/sale/confirm?id=${id}`,
        {},
        { headers }
      )
      loadToday()
    } catch {
      alert("Lỗi xác nhận")
    }
  }

  const handleCancel = async (id) => {
    try {
      await axios.post(
        `https://ctvt-core-api.onrender.com/sale/cancel?id=${id}`,
        {},
        { headers }
      )
      loadToday()
    } catch {
      alert("Lỗi huỷ")
    }
  }

  const handlePrintInvoice = () => {
    if (!maKH) {
      alert("Chọn khách hàng trước")
      return
    }

    const customer = customers.find(c => c.ma_kh === maKH)

    const ten =
      customer?.ten_cua_hang_chi_tiet ||
      customer?.ten_cua_hang ||
      ""

    const diaChi = customer?.dia_chi || ""
    const mst = customer?.ma_so_thue || ""

    const win = window.open("", "_blank")

    win.document.write(`
      <html>
      <body style="font-family: Arial; padding:80px; font-size:32px;">
        <h1>HÓA ĐƠN</h1>
        <div>${ten}</div>
        <div>${diaChi}</div>
        <div>${mst}</div>
        <h2>${tongTien.toLocaleString()}</h2>
      </body>
      </html>
    `)

    win.document.close()
  }

  return (
    <div>
      <h2>Bán hàng</h2>

      {/* ===== FORM GIỮ NGUYÊN ===== */}
      <div style={{ marginBottom: "15px" }}>
        <input type="date" value={ngay} onChange={e => setNgay(e.target.value)} />

        <input
          type="text"
          placeholder="Gõ tên khách..."
          value={searchKH}
          onChange={e => setSearchKH(e.target.value)}
          style={{ marginLeft: "10px", width: "200px" }}
        />

        <select value={maKH} onChange={(e) => setMaKH(e.target.value)} style={{ marginLeft: "10px", width: "200px" }}>
          <option value="">Chọn khách</option>
          {filteredCustomers.map(c => (
            <option key={c.id} value={c.ma_kh}>
              {c.ten_cua_hang}
            </option>
          ))}
        </select>

        <select value={maKho} onChange={e => setMaKho(e.target.value)} style={{ marginLeft: "10px" }}>
          <option value="">Chọn kho</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.ma_kho}>
              {w.ten_kho}
            </option>
          ))}
        </select>
      </div>

      {/* ===== TABLE SP GIỮ NGUYÊN ===== */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <select value={item.ma_sp} onChange={e => handleItemChange(index, "ma_sp", e.target.value)}>
                  <option value="">Chọn SP</option>
                  {products.map(p => (
                    <option key={p.id} value={p.ma_sp}>
                      {p.ten_sp}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input type="number" value={item.so_luong}
                  onChange={e => handleItemChange(index, "so_luong", Number(e.target.value))}
                />
              </td>

              <td>
                <input type="number" value={item.don_gia}
                  onChange={e => handleItemChange(index, "don_gia", Number(e.target.value))}
                />
              </td>

              <td>
                {(item.so_luong * item.don_gia).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addRow} style={{ marginTop: "10px" }}>Thêm dòng</button>

      <h3>Tổng tiền: {tongTien.toLocaleString()}</h3>

      <div>
        Tiền mặt:
        <input type="number" value={tienMat} onChange={e => setTienMat(Number(e.target.value))} />
      </div>

      <div>
        Chuyển khoản:
        <input type="number" value={tienCK} onChange={e => setTienCK(Number(e.target.value))} />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={() => handleSubmit()}>Lưu hóa đơn</button>
        <button onClick={handlePrintInvoice} style={{ marginLeft: "10px" }}>
          Xuất hóa đơn đỏ
        </button>
      </div>

      {/* =========================
          ✅ TODAY TABLE (CHUẨN ERP)
      ========================= */}
      <div style={{ marginTop: "30px" }}>
        <h3>Hôm nay</h3>

        <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách</th>
              <th>Sản phẩm</th>
              <th>SL</th>
              <th>Giá</th>
              <th>TT</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {todayList.map(bill =>
              bill.items.map((it, index) => (
                <tr key={`${bill.id}-${index}`}>

                  {index === 0 && <td rowSpan={bill.items.length}>{bill.id}</td>}
                  {index === 0 && <td rowSpan={bill.items.length}>{bill.ten_kh}</td>}

                  <td>{it.ten_sp}</td>
                  <td>{it.so_luong}</td>
                  <td>{it.don_gia}</td>
                  <td>{it.thanh_tien}</td>

                  {index === 0 && <td rowSpan={bill.items.length}>{bill.tong_tien}</td>}
                  {index === 0 && <td rowSpan={bill.items.length}>{bill.trang_thai}</td>}

                  {index === 0 && (
                    <td rowSpan={bill.items.length}>
                      {bill.trang_thai === "nhap" && (
                        <>
                          <button onClick={() => handleConfirm(bill.id)}>Xác nhận</button>
                          <button onClick={() => handleCancel(bill.id)}>Huỷ</button>
                        </>
                      )}
                    </td>
                  )}

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Sale