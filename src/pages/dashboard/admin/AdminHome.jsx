import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import BarGraph from "../../../components/Graphs/BarGraph";
import axios from "axios";
import config from "../../../config/config";
import { formatActiveUsersBarGraphData, formatBarGraphData } from "../helper";

function AdminHome() {
  const [ordersOverTimeFilter, setOrderOverTimeFilter] = useState("7");
  const [ordersPerDay, setOrderPerDay] = useState();
  const [activeUsersFilter, setActiveUsersFilter] = useState("7");
  const [activeUsers, setActiveUsers] = useState();

  const fetchOrdersOverTime = async () => {
    const url = new URL(`${config.BASE_URL}api/v1/orders/orders-per-day/`);
    const params = new URLSearchParams();
    params.append("days", ordersOverTimeFilter);
    url.search = params.toString();

    try {
      const response = await axios.get(url.toString());

      setOrderPerDay(formatBarGraphData(response.data));
    } catch (err) {}
  };

  const fetchActiveUsersOverTime = async () => {
    const url = new URL(`${config.BASE_URL}api/v1/auth/daily-logged-in-users/`);
    const params = new URLSearchParams();
    params.append("days", activeUsersFilter);
    url.search = params.toString();

    try {
      const response = await axios.get(url.toString());
      setActiveUsers(formatActiveUsersBarGraphData(response.data.data));
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    fetchOrdersOverTime();
  }, [ordersOverTimeFilter]);

  useEffect(() => {
    fetchActiveUsersOverTime();
  }, [activeUsersFilter]);

  return (
    <div>
      <div className="admin-home-quick-info-container">
        <div className="admin-home-quick-info-box"></div>
        <div className="admin-home-quick-info-box"></div>
        <div className="admin-home-quick-info-box"></div>
      </div>

      <div className="graph-container">
        <div className="graph-box">
          <div className="graph-box-content">
            <div className="graph-box-content-title">Orders Over Time</div>
            <div className="graph-quick-filters">
              {["1", "7", "30", "90"].map((filter) => (
                <div
                  key={filter}
                  className={`graph-filter ${
                    ordersOverTimeFilter === filter ? "active" : ""
                  }`}
                  onClick={() => setOrderOverTimeFilter(filter)}
                >
                  {filter === "1" ? "Today" : `${filter} Days`}
                </div>
              ))}
            </div>
            <div className="graph-box-content-graph">
              <BarGraph
                data={ordersPerDay}
                barWidth={10}
                legendLabel="Number Of Orders"
                yAxisLabel="Orders"
              />
            </div>
          </div>
        </div>
        <div className="graph-box">
          <div className="graph-box-content">
            <div className="graph-box-content-title">
              Active Users: Day-by-Day
            </div>
            <div className="graph-quick-filters">
              {["1", "7", "30", "90"].map((filter) => (
                <div
                  key={filter}
                  className={`graph-filter ${
                    activeUsersFilter === filter ? "active" : ""
                  }`}
                  onClick={() => setActiveUsersFilter(filter)}
                >
                  {filter === "1" ? "Today" : `${filter} Days`}
                </div>
              ))}
            </div>
            <div className="graph-box-content-graph">
              <BarGraph
                data={activeUsers}
                barWidth={10}
                legendLabel="Active users"
                yAxisLabel="Users"
                barColor="#05d140"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="graph-container">
        <div className="graph-box">
          <div className="graph-box-content">
            <div className="graph-box-content-title">
              Sales by Product Category
            </div>
            <div className="graph-box-content-graph"></div>
          </div>
        </div>
        <div className="graph-box"></div>
      </div>
    </div>
  );
}

export default AdminHome;
