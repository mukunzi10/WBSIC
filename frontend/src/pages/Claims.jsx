import React, { useState, useEffect } from "react";
import axios from "../api/axiosClient";

function Claims() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    axios.get("/claims").then((res) => setClaims(res.data));
  }, []);

  return (
    <div>
      <h2>Claims Processing</h2>
      <ul>
        {claims.map((claim) => (
          <li key={claim.id}>{claim.claimType} - {claim.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Claims;
