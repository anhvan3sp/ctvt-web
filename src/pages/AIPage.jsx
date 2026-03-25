import { useState } from "react";

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const askAI = async () => {
    const res = await fetch("https://ctvt-core-api.onrender.com/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div>
      <h2>🤖 Trợ lý AI</h2>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập câu hỏi..."
      />

      <button onClick={askAI}>Gửi</button>

      <div style={{ marginTop: 20 }}>
        <b>Kết quả:</b>
        <p>{result}</p>
      </div>
    </div>
  );
}