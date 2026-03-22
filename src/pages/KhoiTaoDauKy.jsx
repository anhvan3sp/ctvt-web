import { useEffect, useState } from "react"
import api from "../api"

export default function KhoiTaoDauKy() {

  const [data, setData] = useState({
    ton_kho: [],
    quy_nhan_vien: [],
    quy_cong_ty: { tien_mat: 0, tien_ngan_hang: 0 },
    cong_no_khach: [],
    cong_no_ncc: []
  })

  const [dm, setDm] = useState({
    kho: [],
    san_pham: [],
    nhan_vien: [],
    khach_hang: [],
    ncc: []
  })

  // ===== BUILD DEFAULT =====
  const buildDefaultTonKho = (kho, san_pham) => {
    const arr = []
    kho.forEach(k => {
      san_pham.forEach(sp => {
        arr.push({
          ma_kho: k.ma_kho,
          ma_sp: sp.ma_sp,
          so_luong: 0
        })
      })
    })
    return arr
  }

  const buildDefaultQuyNV = (nhan_vien) => {
    return nhan_vien.map(nv => ({
      ma_nv: nv.ma_nv,
      so_du: 0
    }))
  }

  // ===== LOAD =====
  const loadAll = async () => {
    const [resDK, resDM] = await Promise.all([
      api.get("/system/dau-ky"),
      api.get("/system/danh-muc")
    ])

    const dmData = resDM.data
    setDm(dmData)

    setData({
      ton_kho: resDK.data.ton_kho.length
        ? resDK.data.ton_kho
        : buildDefaultTonKho(dmData.kho, dmData.san_pham),

      quy_nhan_vien: resDK.data.quy_nhan_vien.length
        ? resDK.data.quy_nhan_vien
        : buildDefaultQuyNV(dmData.nhan_vien),

      quy_cong_ty: resDK.data.quy_cong_ty,

      cong_no_khach: resDK.data.cong_no_khach.length
        ? resDK.data.cong_no_khach
        : [{ ma_kh: "", so_no: 0 }],

      cong_no_ncc: resDK.data.cong_no_ncc.length
        ? resDK.data.cong_no_ncc
        : [{ ma_ncc: "", so_no: 0 }]
    })
  }

  useEffect(() => {
    loadAll()
  }, [])

  // ===== UPDATE =====
  const update = (key, index, field, value) => {
    const newData = [...data[key]]
    newData[index][field] = value
    setData({ ...data, [key]: newData })
  }

  const addRow = (key, row) => {
    setData({ ...data, [key]: [...data[key], row] })
  }

  // ===== CLEAN =====
  const clean = () => ({
    ...data,
    ton_kho: data.ton_kho.filter(x => x.ma_kho && x.ma_sp),
    quy_nhan_vien: data.quy_nhan_vien.filter(x => x.ma_nv),
    cong_no_khach: data.cong_no_khach.filter(x => x.ma_kh),
    cong_no_ncc: data.cong_no_ncc.filter(x => x.ma_ncc)
  })

  // ===== SAVE =====
  const save = async () => {
    await api.post("/system/dau-ky", clean())
    alert("Lưu thành công")
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Khởi tạo đầu kỳ</h2>

      {/* ===== TỒN KHO ===== */}
      <h3>Tồn kho</h3>
      {data.ton_kho.map((row, i) => (
        <div key={i}>

          <select value={row.ma_kho}
            onChange={e => update("ton_kho", i, "ma_kho", e.target.value)}>
            {dm.kho.map(k => (
              <option key={k.ma_kho} value={k.ma_kho}>{k.ma_kho}</option>
            ))}
          </select>

          <select value={row.ma_sp}
            onChange={e => update("ton_kho", i, "ma_sp", e.target.value)}>
            {dm.san_pham.map(sp => (
              <option key={sp.ma_sp} value={sp.ma_sp}>{sp.ma_sp}</option>
            ))}
          </select>

          <input
            type="number"
            value={row.so_luong}
            onChange={e => update("ton_kho", i, "so_luong", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={() => addRow("ton_kho", { ma_kho: "", ma_sp: "", so_luong: 0 })}>
        + Thêm dòng
      </button>

      {/* ===== QUỸ NV ===== */}
      <h3>Quỹ nhân viên</h3>
      {data.quy_nhan_vien.map((row, i) => (
        <div key={i}>
          <select value={row.ma_nv}
            onChange={e => update("quy_nhan_vien", i, "ma_nv", e.target.value)}>
            {dm.nhan_vien.map(nv => (
              <option key={nv.ma_nv} value={nv.ma_nv}>{nv.ma_nv}</option>
            ))}
          </select>

          <input
            type="number"
            value={row.so_du}
            onChange={e => update("quy_nhan_vien", i, "so_du", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={() => addRow("quy_nhan_vien", { ma_nv: "", so_du: 0 })}>
        + Thêm dòng
      </button>

      {/* ===== CÔNG NỢ KH ===== */}
      <h3>Công nợ khách</h3>
      {data.cong_no_khach.map((row, i) => (
        <div key={i}>
          <select value={row.ma_kh}
            onChange={e => update("cong_no_khach", i, "ma_kh", e.target.value)}>
            <option value="">-- KH --</option>
            {dm.khach_hang.map(k => (
              <option key={k.ma_kh} value={k.ma_kh}>
                {k.ten_kh} {/* FIX CHÍNH Ở ĐÂY */}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={row.so_no}
            onChange={e => update("cong_no_khach", i, "so_no", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={() => addRow("cong_no_khach", { ma_kh: "", so_no: 0 })}>
        + Thêm
      </button>

      {/* ===== CÔNG NỢ NCC ===== */}
      <h3>Công nợ NCC</h3>
      {data.cong_no_ncc.map((row, i) => (
        <div key={i}>
          <select value={row.ma_ncc}
            onChange={e => update("cong_no_ncc", i, "ma_ncc", e.target.value)}>
            <option value="">-- NCC --</option>
            {dm.ncc.map(n => (
              <option key={n.ma_ncc} value={n.ma_ncc}>{n.ma_ncc}</option>
            ))}
          </select>

          <input
            type="number"
            value={row.so_no}
            onChange={e => update("cong_no_ncc", i, "so_no", Number(e.target.value))}
          />
        </div>
      ))}

      <button onClick={() => addRow("cong_no_ncc", { ma_ncc: "", so_no: 0 })}>
        + Thêm
      </button>

      {/* ===== QUỸ CTY ===== */}
      <h3>Quỹ công ty</h3>

      <input
        type="number"
        value={data.quy_cong_ty.tien_mat}
        onChange={e =>
          setData({
            ...data,
            quy_cong_ty: { ...data.quy_cong_ty, tien_mat: Number(e.target.value) }
          })
        }
      />

      <input
        type="number"
        value={data.quy_cong_ty.tien_ngan_hang}
        onChange={e =>
          setData({
            ...data,
            quy_cong_ty: { ...data.quy_cong_ty, tien_ngan_hang: Number(e.target.value) }
          })
        }
      />

      <br /><br />

      <button onClick={save}>Lưu</button>

    </div>
  )
}