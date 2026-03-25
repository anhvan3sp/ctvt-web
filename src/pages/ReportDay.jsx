import { useState } from "react"
import axios from "axios"

function ReportDay(){

const token = localStorage.getItem("access_token")

const headers={
Authorization:`Bearer ${token}`
}

const [ngay,setNgay]=useState(
new Date().toISOString().split("T")[0]
)

const [data,setData]=useState(null)
const [loading,setLoading]=useState(false)

const xemBaoCao=async()=>{

try{

setLoading(true)

const res = await axios.get(
"https://ctvt-core-api.onrender.com/report/day",
{
params:{ ngay },
headers
}
)

console.log("REPORT DATA:",res.data)

setData(res.data)

}catch(err){

console.error("Lỗi báo cáo:",err)

}finally{
setLoading(false)
}

}

// format tiền
const format=(v)=> v ? Number(v).toLocaleString("vi-VN") : "0"

return(

<div>

<h2>Báo cáo ngày</h2>

<p>Ngày: {ngay}</p>
<p>Nhân viên: {data?.nhan_vien || "..."}</p>

<input
type="date"
value={ngay}
onChange={(e)=>setNgay(e.target.value)}
/>

<button onClick={xemBaoCao}>
{loading ? "Đang tải..." : "Xem báo cáo"}
</button>

{!data && !loading && (
<p>Chưa có dữ liệu</p>
)}

{data && (

<div>

{/* ================= BÁN HÀNG ================= */}

<h3>Bán hàng</h3>

<table border="1">

<thead>
<tr>
<th>Số HD</th>
<th>Khách</th>
<th>Chi tiết</th>
<th>Tổng tiền</th>
<th>TM</th>
<th>CK</th>
</tr>
</thead>

<tbody>

{data?.hoa_don_ban_trong_ngay?.length > 0 ? (

data.hoa_don_ban_trong_ngay.map((s,i)=>(

<tr key={i}>
<td>{s.so_hd}</td>
<td>{s.ten_kh}</td>

<td>
{s.chi_tiet && s.chi_tiet.length > 0 ? (
s.chi_tiet.map((ct,idx)=>(
<div key={idx}>
{ct.ten_hang} - {ct.so_luong} x {format(ct.don_gia)} = <b>{format(ct.thanh_tien)}</b>
</div>
))
) : (
<span>Không có chi tiết</span>
)}
</td>

<td>{format(s.tong_tien)}</td>
<td>{format(s.tien_mat)}</td>
<td>{format(s.tien_ck)}</td>
</tr>

))

) : (

<tr>
<td colSpan="6">Không có dữ liệu</td>
</tr>

)}

</tbody>

</table>


{/* ================= NHẬP HÀNG ================= */}

<h3>Nhập hàng</h3>

<table border="1">

<thead>
<tr>
<th>Số HD</th>
<th>Tổng tiền</th>
</tr>
</thead>

<tbody>

{data?.hoa_don_nhap_trong_ngay?.length > 0 ? (

data.hoa_don_nhap_trong_ngay.map((p,i)=>(

<tr key={i}>
<td>{p.so_hd}</td>
<td>{format(p.tong_tien)}</td>
</tr>

))

) : (

<tr>
<td colSpan="2">Không có dữ liệu</td>
</tr>

)}

</tbody>

</table>


{/* ================= THU CHI ================= */}

<h3>Thu chi</h3>

<table border="1">

<thead>
<tr>
<th>Loại</th>
<th>Đối tượng</th>
<th>Số tiền</th>
<th>Hình thức</th>
<th>Nội dung</th>
</tr>
</thead>

<tbody>

{data?.thu_chi_trong_ngay?.length > 0 ? (

data.thu_chi_trong_ngay.map((t,i)=>(

<tr key={i}>
<td>{t.loai === "thu" ? "Thu" : "Chi"}</td>
<td>{t.doi_tuong}</td>
<td>{format(t.so_tien)}</td>
<td>{t.hinh_thuc}</td>
<td>{t.noi_dung || ""}</td>
</tr>

))

) : (

<tr>
<td colSpan="5">Không có dữ liệu</td>
</tr>

)}

</tbody>

</table>


{/* ================= TỔNG KẾT ================= */}

<h3>Tổng kết</h3>

<p>Tổng số bình bán: {format(data?.tong_ket?.tong_so_binh_ban)}</p>

<p>Tổng bán: {format(data?.tong_ket?.tong_ban)}</p>

<p>Tổng nhập: {format(data?.tong_ket?.tong_nhap)}</p>

<p>Tiền mặt: {format(data?.tong_ket?.tong_tien_mat)}</p>

<p>Chuyển khoản: {format(data?.tong_ket?.tong_chuyen_khoan)}</p>

<p>Tổng thu: {format(data?.tong_ket?.tong_thu)}</p>

<p>Tổng chi: {format(data?.tong_ket?.tong_chi)}</p>

<h2>
Tồn quỹ cuối ngày: {format(data?.tong_ket?.ton_quy)}
</h2>

</div>

)}

</div>

)

}

export default ReportDay