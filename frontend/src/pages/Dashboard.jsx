import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Insurance Company Dashboard</h1>
      <nav>
        <Link to="/policies">Policy Management</Link> |{" "}
        <Link to="/claims">Claims Processing</Link> |{" "}
        <Link to="/payments">Payments & Billing</Link> |{" "}
        <Link to="/reports">Reports</Link>
      </nav>
    </div>
  );
}

export default Dashboard;
