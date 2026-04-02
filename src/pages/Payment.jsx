import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Payment() {
  const [form, setForm] = useState({
    ma_kh: "",
    tien_mat: 0,
    tien_ck: 0,
    noi_dung: "",
  });

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        idempotency_key: `pay_${Date.now()}`
      };

      await axios.post(`${API}/payment/`, payload);

      alert("OK");

      setForm({
        ma_kh: "",
        tien_mat: 0,
        tien_ck: 0,
        noi_dung: "",
      });

    } catch (err) {
      console.error(err);
      alert("Lỗi");
    }
  };

  return (
    <div className="p-4">
      <h2>Khách trả nợ</h2>

      <input
        placeholder="Mã khách"
        value={form.ma_kh}
        onChange={(e) =>
          setForm({ ...form, ma_kh: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Tiền mặt"
        value={form.tien_mat}
        onChange={(e) =>
          setForm({ ...form, tien_mat: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Chuyển khoản"
        value={form.tien_ck}
        onChange={(e) =>
          setForm({ ...form, tien_ck: Number(e.target.value) })
        }
      />

      <input
        placeholder="Nội dung"
        value={form.noi_dung}
        onChange={(e) =>
          setForm({ ...form, noi_dung: e.target.value })
        }
      />

      <button onClick={handleSubmit}>
        Ghi nhận
      </button>
    </div>
  );
}