import React from "react";
import "./dashboard.css";

export default function DashboardHome() {
  return (
    <div className="dashboard">

      <div className="order-status">
        <h5>ORDER STATUS</h5>
        <h2>Live fulfillment breakdown</h2>

        <div className="status-grid">

          <div className="card pending">
            <h4>PENDING</h4>
            <h1>0</h1>
          </div>

          <div className="card processing">
            <h4>PROCESSING</h4>
            <h1>2</h1>
          </div>

          <div className="card confirmed">
            <h4>CONFIRMED</h4>
            <h1>2</h1>
          </div>

          <div className="card shipped">
            <h4>SHIPPED</h4>
            <h1>3</h1>
          </div>

          <div className="card delivered">
            <h4>DELIVERED</h4>
            <h1>3</h1>
          </div>

          <div className="card cancelled">
            <h4>CANCELLED</h4>
            <h1>4</h1>
          </div>

        </div>
      </div>

    </div>
  );
}