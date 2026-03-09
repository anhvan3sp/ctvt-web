import {useEffect,useState} from "react"
import axios from "axios"

function Inventory(){

const token = localStorage.getItem("access_token")

const [data,setData]=useState([])

useEffect(()=>{

axios.get(
"https://ctvt-core-api.onrender.com/inventory",
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>setData(res.data))

},[])

return(

<div>

<h2>Tồn kho</h2>

<table border="1">

<thead>
<tr>
<th>Sản phẩm</th>
<th>Tồn kho</th>
</tr>
</thead>

<tbody>

{data.map((p,i)=>(
<tr key={i}>
<td>{p.ten_sp}</td>
<td>{p.ton}</td>
</tr>
))}

</tbody>

</table>

</div>

)

}

export default Inventory