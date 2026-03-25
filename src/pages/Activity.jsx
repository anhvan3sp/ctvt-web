import { useEffect, useState } from "react"

export default function Activity() {
  const [data, setData] = useState([])

  const token = localStorage.getItem("access_token")

  const fetchData = async () => {
    const res = await fetch("http://localhost:8000/activity/today", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const json = await res.json()
    setData(json)
  }

  const cancel = async (item) => {
    const ok = window.confirm("Huỷ hoá đơn này?")
    if (!ok) return

    const url =
      item.type === "sale"
        ? `http://localhost:8000/activity/cancel/sale/${item.id}`
        : `http://localhost:8000/activity/cancel/purchase/${item.id}`

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <h2>Huỷ hoá đơn hôm nay</h2>

      <table border="1" cellPadding="6" style={{ background: "white" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.map((x) => (
            <tr key={x.id}>
              <td>{x.id}</td>
              <td>{x.type}</td>
              <td>{x.tong_tien}</td>
              <td>{x.trang_thai}</td>
              <td>
                {x.trang_thai !== "huy" && (
                  <button onClick={() => cancel(x)}>Huỷ</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}