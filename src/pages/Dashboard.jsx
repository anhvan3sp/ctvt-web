import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"

function Dashboard() {

  const token = localStorage.getItem("access_token")

  const headers = {
    Authorization: `Bearer ${token}`
  }

  const [data,setData] = useState(null)

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const res = await axios.get(
          "https://ctvt-core-api.onrender.com/dashboard",
          { headers }
        )

        setData(res.data)

      } catch (err) {

        console.log(err)

      }
    }

    loadDashboard()

  }, [])

  if(!data){
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

      <br/>

      {/* ============================= */}
      {/* ADMIN → QUỸ CÔNG TY */}
      {/* ============================= */}

      {data.loai === "cong_ty" && (

        <>
          <h3>Quỹ công ty</h3>

          <p>Tiền mặt: {data.tien_mat.toLocaleString()} đ</p>

          <p>Tiền ngân hàng: {data.tien_ngan_hang.toLocaleString()} đ</p>

          <p><b>Tổng quỹ: {data.tong_quy.toLocaleString()} đ</b></p>
        </>
      )}

      {/* ============================= */}
      {/* NHÂN VIÊN */}
      {/* ============================= */}

      {data.loai === "nhan_vien" && (

        <h3>Quỹ của bạn: {data.so_du.toLocaleString()} đ</h3>

      )}

      <br/>

      <div style={{
        border:"1px solid #ccc",
        padding:"20px",
        width:"300px"
      }}>

        <h3>Hôm nay</h3>

        <p>Bán: ... bình</p>

        <p>Thu: {data.thu_hom_nay.toLocaleString()} đ</p>

        <p>Chi: {data.chi_hom_nay.toLocaleString()} đ</p>

      </div>

    </Layout>
  )
}

export default Dashboard