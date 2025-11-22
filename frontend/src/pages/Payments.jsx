import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient";

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get("/payments").then((res) => setPayments(res.data));
  }, []);

  return (
    <div>
      <h2>Payments & Billing</h2>
      <ul>
        {payments.map((pay) => (
          <li key={pay.id}>Invoice #{pay.invoiceId} - ${pay.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default Payments;
