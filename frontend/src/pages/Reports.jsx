import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient";

function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/reports").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Reporting & Analytics</h2>
      <ul>
        {data.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
