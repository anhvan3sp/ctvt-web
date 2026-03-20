import { useEffect, useState } from "react"
import api from "../api"
import Layout from "../components/Layout"

function Dashboard() {

  const [data, setData] = useState(null)

  useEffect(() => {

    const loadDashboard = async () => {
      try {
        const res = await api.get("/dashboard")
        setData(res.data)
      } catch (err) {
        console.log(err)
        alert("Lỗi tải dashboard")
      }
    }

    loadDashboard()

  }, [])

  if (!data) {
    return (
      <Layout>
        <h2>Đang tải...</h2>
      </Layout>
    )
  }

  return (
    <Layout>

      <h1>Bảng Điều Khiển</h1>

      <p>Chào mừng đến hệ thống GAS VĂN THUỶ</p>

      <br />

      {data.loai === "cong_ty" && (
        <>
          <h3>Quỹ công ty</h3>

          <p>Tiền mặt: {(data.tien_mat || 0).toLocaleString()} đ</p>
          <p>Tiền ngân hàng: {(data.tien_ngan_hang || 0).toLocaleString()} đ</p>
          <p><b>Tổng quỹ: {(data.tong_quy || 0).toLocaleString()} đ</b></p>
        </>
      )}

      {data.loai === "nhan_vien" && (
        <h3>Quỹ của bạn: {(data.so_du || 0).toLocaleString()} đ</h3>
      )}

      <br />

      <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "300px"
      }}>

        <h3>Hôm nay</h3>

        <p>Bán: {data.ban_hom_nay || 0} bình</p>
        <p>Thu: {(data.thu_hom_nay || 0).toLocaleString()} đ</p>
        <p>Chi: {(data.chi_hom_nay || 0).toLocaleString()} đ</p>

      </div>

    </Layout>
  )
}

export default Dashboard