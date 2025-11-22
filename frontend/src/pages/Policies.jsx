import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient";

function Policies() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get("/policies").then((res) => setPolicies(res.data));
  }, []);

  return (
    <div>
      <h2>Policy Management</h2>
      <ul>
        {policies.map((p) => (
          <li key={p.id}>{p.policyName}</li>
        ))}
      </ul>
    </div>
  );
}

export default Policies;
