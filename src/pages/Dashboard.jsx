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

  const format = (v) => (v || 0).toLocaleString("vi-VN")

  return (
    <Layout>

      <h1>Bảng Điều Khiển</h1>

      {/* 🔥 TÊN NGƯỜI */}
      <p>Chào <b>{data.ten_nv}</b></p>

      <br />

      {data.loai === "cong_ty" && (
        <>
          <h3>Quỹ công ty</h3>

          <p>Tiền mặt: {format(data.tien_mat)} đ</p>
          <p>Tiền ngân hàng: {format(data.tien_ngan_hang)} đ</p>
          <p><b>Tổng quỹ: {format(data.tong_quy)} đ</b></p>
        </>
      )}

      {data.loai === "nhan_vien" && (
        <h3>Quỹ của bạn: {format(data.so_du)} đ</h3>
      )}

      <br />

      <div style={{
        border: "1px solid #ccc",
        padding: "20px",
        width: "300px"
      }}>

        <h3>Hôm nay</h3>

        {/* 🔥 PHÂN LOẠI BÁN */}
        <div>
          <b>Bán hàng:</b>
          {data.ban_theo_loai?.length > 0 ? (
            data.ban_theo_loai.map((b,i)=>(
              <div key={i}>
                {b.ten}: {b.so_luong} bình
              </div>
            ))
          ) : (
            <div>Không có dữ liệu</div>
          )}
        </div>

        <hr/>

        <p><b>Tổng: {data.ban_hom_nay} bình</b></p>

        <p>Thu: {format(data.thu_hom_nay)} đ</p>
        <p>Chi: {format(data.chi_hom_nay)} đ</p>

      </div>

    </Layout>
  )
}

export default Dashboard