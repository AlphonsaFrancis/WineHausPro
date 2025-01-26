import React, { useEffect, useState } from "react";
import "./AdminHome.css";
import BarGraph from "../../../components/Graphs/BarGraph";
import axios from "axios";
import config from "../../../config/config";
import { formatActiveUsersBarGraphData, formatBarGraphData } from "../helper";
import DonutChart from "../../../components/Graphs/DonutChart";

function AdminHome() {
  const [ordersOverTimeFilter, setOrderOverTimeFilter] = useState("1");
  const [ordersPerDay, setOrderPerDay] = useState();
  const [activeUsersFilter, setActiveUsersFilter] = useState("1");
  const [activeUsers, setActiveUsers] = useState();
  const [categoryFilter, setCategoryFilter] = useState("7");
  const [category, setCategory] = useState();
  const [productFilter, setProductFilter] = useState("7");
  const [product, setProduct] = useState();

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

  const fetchCategorySalesByTime = async () => {
    const url = new URL(
      `${config.BASE_URL}api/v1/orders/category-orders-per-day/`
    );
    const params = new URLSearchParams();
    params.append("days", categoryFilter);
    url.search = params.toString();

    try {
      const response = await axios.get(url.toString());
      setCategory(response.data);
    } catch (err) {}
  };

  const fetchProductSalesByTime = async () => {
    const url = new URL(
      `${config.BASE_URL}api/v1/orders/product-orders-by-day/`
    );
    const params = new URLSearchParams();
    params.append("days", productFilter);
    url.search = params.toString();

    try {
      const response = await axios.get(url.toString());
      setProduct(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchOrdersOverTime();
  }, [ordersOverTimeFilter]);

  useEffect(() => {
    fetchActiveUsersOverTime();
  }, [activeUsersFilter]);

  useEffect(() => {
    fetchCategorySalesByTime();
  }, [categoryFilter]);

  useEffect(() => {
    fetchProductSalesByTime();
  }, [productFilter]);

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
                barColor="#0948c6"
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
            <div className="graph-box-content-title">Sales by Product</div>
            <div className="graph-quick-filters">
              {["1", "7", "30", "90"].map((filter) => (
                <div
                  key={filter}
                  className={`graph-filter ${
                    productFilter === filter ? "active" : ""
                  }`}
                  onClick={() => setProductFilter(filter)}
                >
                  {filter === "1" ? "Today" : `${filter} Days`}
                </div>
              ))}
            </div>
            <div className="graph-box-content-graph">
              <DonutChart data={product ?? []} />
            </div>
          </div>
        </div>
        <div className="graph-box">
          <div className="graph-box-content-title">Sales by Category</div>
          <div className="graph-quick-filters">
            {["1", "7", "30", "90"].map((filter) => (
              <div
                key={filter}
                className={`graph-filter ${
                  categoryFilter === filter ? "active" : ""
                }`}
                onClick={() => setCategoryFilter(filter)}
              >
                {filter === "1" ? "Today" : `${filter} Days`}
              </div>
            ))}
          </div>
          <div className="graph-box-content-graph">
            <DonutChart data={category ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
