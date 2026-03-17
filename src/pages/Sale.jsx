import { useEffect, useState } from "react"
import axios from "axios"

function Sale() {

  const token = localStorage.getItem("access_token")
  const headers = { Authorization: `Bearer ${token}` }

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

  useEffect(() => {

    axios.get("https://ctvt-core-api.onrender.com/customer/", { headers })
      .then(res => setCustomers(res.data))

    axios.get("https://ctvt-core-api.onrender.com/products/", { headers })
      .then(res => setProducts(res.data))

    axios.get("https://ctvt-core-api.onrender.com/warehouses/", { headers })
      .then(res => setWarehouses(res.data))

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

  const handleSubmit = async () => {

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
      items: validItems
    }

    try {

      const res = await axios.post(
        "https://ctvt-core-api.onrender.com/sale/",
        data,
        { headers }
      )

      // ---- nếu backend cảnh báo trùng ----
      if (res.data.warning) {

        if (window.confirm(res.data.message)) {

          const data2 = {
            ...data,
            force_create: true
          }

          await axios.post(
            "https://ctvt-core-api.onrender.com/sale/",
            data2,
            { headers }
          )

          alert("Đã tạo hóa đơn")
          window.location.reload()
        }

        return
      }

      alert("Bán hàng thành công")
      window.location.reload()

    } catch (err) {
      console.error(err.response?.data)
      alert("Lỗi khi lưu")
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
      <head>
        <title>Thông tin viết hóa đơn</title>

        <style>
          body{
            font-family: Arial;
            padding:80px;
            font-size:32px;
          }

          h1{
            text-align:center;
            margin-bottom:60px;
          }

          .row{
            margin:30px 0;
          }

          .label{
            font-weight:bold;
            display:inline-block;
            width:320px;
          }

          .money{
            font-size:40px;
            font-weight:bold;
            color:red;
          }

        </style>

      </head>

      <body>

        <h1>THÔNG TIN VIẾT HÓA ĐƠN ĐỎ</h1>

        <div class="row">
          <span class="label">Tên khách hàng:</span>
          ${ten}
        </div>

        <div class="row">
          <span class="label">Địa chỉ:</span>
          ${diaChi}
        </div>

        <div class="row">
          <span class="label">Mã số thuế:</span>
          ${mst}
        </div>

        <div class="row money">
          Tổng tiền thanh toán: ${tongTien.toLocaleString()}
        </div>

      </body>
      </html>
    `)

    win.document.close()
  }

  return (
    <div>
      <h2>Bán hàng</h2>

      <div style={{ marginBottom: "15px" }}>
        <input type="date" value={ngay} onChange={e => setNgay(e.target.value)} />

        <input
          type="text"
          placeholder="Gõ tên khách..."
          value={searchKH}
          onChange={e => setSearchKH(e.target.value)}
          style={{ marginLeft: "10px", width: "200px" }}
        />

        <select
          value={maKH}
          onChange={(e) => setMaKH(e.target.value)}
          style={{ marginLeft: "10px", width: "200px" }}
        >
          <option value="">Chọn khách</option>

          {filteredCustomers.map(c => (
            <option key={c.id} value={c.ma_kh}>
              {c.ten_cua_hang}
            </option>
          ))}
        </select>

        <select
          value={maKho}
          onChange={e => setMaKho(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">Chọn kho</option>

          {warehouses.map(w => (
            <option key={w.id} value={w.ma_kho}>
              {w.ten_kho}
            </option>
          ))}
        </select>
      </div>

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
                <select
                  value={item.ma_sp}
                  onChange={e => handleItemChange(index, "ma_sp", e.target.value)}
                >
                  <option value="">Chọn SP</option>

                  {products.map(p => (
                    <option key={p.id} value={p.ma_sp}>
                      {p.ten_sp}
                    </option>
                  ))}

                </select>
              </td>

              <td>
                <input
                  type="number"
                  value={item.so_luong}
                  onChange={e => handleItemChange(index, "so_luong", Number(e.target.value))}
                />
              </td>

              <td>
                <input
                  type="number"
                  value={item.don_gia}
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

      <button onClick={addRow} style={{ marginTop: "10px" }}>
        Thêm dòng
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Tổng tiền: {tongTien.toLocaleString()}</h3>

        <div>
          Tiền mặt:
          <input
            type="number"
            value={tienMat}
            onChange={e => setTienMat(Number(e.target.value))}
          />
        </div>

        <div>
          Chuyển khoản:
          <input
            type="number"
            value={tienCK}
            onChange={e => setTienCK(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleSubmit}>
          Lưu hóa đơn
        </button>

        <button
          onClick={handlePrintInvoice}
          style={{ marginLeft: "10px" }}
        >
          Xuất hóa đơn đỏ
        </button>
      </div>

    </div>
  )
}

export default Sale