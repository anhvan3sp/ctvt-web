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

const xemBaoCao=async()=>{

try{

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

}

}

const format=(v)=> v ? Number(v).toLocaleString() : 0

return(

<div>

<h2>Báo cáo ngày</h2>

<input
type="date"
value={ngay}
onChange={(e)=>setNgay(e.target.value)}
/>

<button onClick={xemBaoCao}>
Xem báo cáo
</button>

{data && (

<div>

{/* ================= BÁN HÀNG ================= */}

<h3>Bán hàng</h3>

<table border="1">

<thead>
<tr>
<th>Số HD</th>
<th>Khách</th>
<th>Số bình</th>
<th>Tổng tiền</th>
<th>TM</th>
<th>CK</th>
</tr>
</thead>

<tbody>

{data?.hoa_don_ban_trong_ngay?.map((s,i)=>(

<tr key={i}>
<td>{s.so_hd}</td>
<td>{s.ten_kh}</td>
<td>{s.so_binh}</td>
<td>{format(s.tong_tien)}</td>
<td>{format(s.tien_mat)}</td>
<td>{format(s.tien_ck)}</td>
</tr>

))}

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

{data?.hoa_don_nhap_trong_ngay?.map((p,i)=>(

<tr key={i}>
<td>{p.so_hd}</td>
<td>{format(p.tong_tien)}</td>
</tr>

))}

</tbody>

</table>


{/* ================= THU CHI ================= */}

<h3>Thu chi</h3>

<table border="1">

<thead>
<tr>
<th>Đối tượng</th>
<th>Số tiền</th>
<th>Hình thức</th>
</tr>
</thead>

<tbody>

{data?.thu_chi_trong_ngay?.map((t,i)=>(

<tr key={i}>
<td>{t.doi_tuong}</td>
<td>{format(t.so_tien)}</td>
<td>{t.hinh_thuc}</td>
</tr>

))}

</tbody>

</table>


{/* ================= TỔNG KẾT ================= */}

<h3>Tổng kết</h3>

<p>Tổng số bình bán: {format(data?.tong_ket?.tong_so_binh_ban)}</p>

<p>Tổng bán: {format(data?.tong_ket?.tong_ban)}</p>

<p>Tổng nhập: {format(data?.tong_ket?.tong_nhap)}</p>

<p>Tiền mặt: {format(data?.tong_ket?.tong_tien_mat)}</p>

<p>Chuyển khoản: {format(data?.tong_ket?.tong_chuyen_khoan)}</p>

<p>Thu khác: {format(data?.tong_ket?.tong_thu_khac)}</p>

<p>Chi: {format(data?.tong_ket?.tong_chi)}</p>

<h2>
Tồn quỹ cuối ngày: {format(data?.tong_ket?.ton_quy_cuoi_ngay)}
</h2>

</div>

)}

</div>

)

}

export default ReportDay