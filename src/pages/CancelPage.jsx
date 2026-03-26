import { useEffect, useState } from "react"
import api from "../api"
import Layout from "../components/Layout"

function CancelPage() {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await api.get("/transaction/today")
      setList(res.data)

    } catch (err) {
      console.error(err)
      alert("Lỗi load dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCancel = async (loai, id) => {

    const ok = window.confirm("Xác nhận huỷ giao dịch này?")
    if (!ok) return

    try {
      setProcessingId(id)

      await api.post("/transaction/cancel", null, {
        params: { loai, id }
      })

      alert("Huỷ thành công")

      fetchData()

    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi huỷ")
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Layout>
      <div style={{ padding: 20 }}>

        <h2>Huỷ hoá đơn hôm nay</h2>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table border="1" cellPadding="8" style={{ marginTop: 10, width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Loại</th>
                <th>Đối tượng</th>
                <th>Chi tiết</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr key={`${item.loai}-${item.id}`}>

                  <td>{item.id}</td>

                  <td>
                    {item.loai === "ban" && "Bán"}
                    {item.loai === "nhap" && "Nhập"}
                    {item.loai === "thu_chi" && "Thu/Chi"}
                  </td>

                  <td>{item.ten_kh}</td>

                  <td>
                    {item.chi_tiet?.map((ct, index) => (
                      <div key={index}>
                        {ct.ten_hang} - {ct.so_luong} x {Number(ct.don_gia).toLocaleString()}
                      </div>
                    ))}
                  </td>

                  <td>{Number(item.tong_tien).toLocaleString()} đ</td>

                  <td>
                    {item.trang_thai === "huy"
                      ? "Đã huỷ"
                      : "Hoạt động"}
                  </td>

                  <td>
                    {item.trang_thai === "huy" ? (
                      <span>---</span>
                    ) : (
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleCancel(item.loai, item.id)}
                      >
                        {processingId === item.id ? "Đang huỷ..." : "Huỷ"}
                      </button>
                    )}
                  </td>

                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan="7">Không có dữ liệu</td>
                </tr>
              )}

            </tbody>
          </table>
        )}

      </div>
    </Layout>
  )
}

export default CancelPage