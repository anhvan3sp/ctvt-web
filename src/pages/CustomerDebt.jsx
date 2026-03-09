import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

function CustomerDebt() {

  const { ma_kh } = useParams()
  const token = localStorage.getItem("access_token")
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get(
      `https://ctvt-core-api.onrender.com/customer/debt/${ma_kh}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setData(res.data))
  }, [])

  if (!data) return <div>Đang tải...</div>

  return (
    <div style={{ padding: "20px" }}>
      <h2>Công nợ khách: {data.ten_khach}</h2>

      <p><strong>Tổng bán:</strong> {data.tong_ban.toLocaleString()}</p>
      <p><strong>Tổng đã trả:</strong> {data.tong_da_tra.toLocaleString()}</p>
      <p><strong>Tổng công nợ:</strong> {data.tong_cong_no.toLocaleString()}</p>

      <h3>Danh sách hóa đơn còn nợ</h3>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày</th>
            <th>Tổng tiền</th>
            <th>Đã trả</th>
            <th>Còn nợ</th>
          </tr>
        </thead>
        <tbody>
          {data.danh_sach_hoa_don_con_no.map(hd => (
            <tr key={hd.id}>
              <td>{hd.id}</td>
              <td>{hd.ngay}</td>
              <td>{hd.tong_tien.toLocaleString()}</td>
              <td>{hd.da_tra.toLocaleString()}</td>
              <td style={{ color: "red" }}>
                {hd.con_no.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerDebt