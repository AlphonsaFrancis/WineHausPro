import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AdminHome.css";
import BarGraph from "../../../components/Graphs/BarGraph";
import axios from "axios";
import config from "../../../config/config";
import { formatActiveUsersBarGraphData, formatBarGraphData } from "../helper";
import DonutChart from "../../../components/Graphs/DonutChart";
import LoginUsersChart from "../../../components/Graphs/LineChart";
import infoBg from "../../../assets/info-card-bg.jpg";

function AdminHome() {
  const [ordersOverTimeFilter, setOrderOverTimeFilter] = useState("1");
  const [ordersPerDay, setOrderPerDay] = useState();
  const [activeUsersFilter, setActiveUsersFilter] = useState("1");
  const [activeUsers, setActiveUsers] = useState();
  const [categoryFilter, setCategoryFilter] = useState("7");
  const [category, setCategory] = useState();
  const [productFilter, setProductFilter] = useState("7");
  const [product, setProduct] = useState();
  const [users, setUsers]=useState()

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


  const getAllUsers = () => {
    axios
      .get(`${config.BASE_URL}api/v1/auth/users/`)
      .then((response) => {
        console.log("response.data",response.data)
        setUsers(response.data)
      })
  }

  const exportDataToPdf = async () => {
    const report = document.getElementById("report");

    try {
      const canvas = await html2canvas(report, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = imageWidth / imageHeight;
      const pdfWidth = pageWidth - 20;
      const pdfHeight = pdfWidth / ratio;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        10,
        10,
        pdfWidth,
        pdfHeight
      );

      pdf.save("admin-dashboard-report.pdf");
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
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

  useEffect(()=>{
    getAllUsers()
  },[])

  return (
    <div style={{ overflowY: "hidden" }}>
      <div className="export-button-container">
        <div className="export-button" onClick={exportDataToPdf}>
          Export as PDF
        </div>
      </div>

      <div id="report">
        <div className="admin-home-quick-info-container">
          <div
            className="admin-home-quick-info-box"
            
          >
            <div className="admin-home-quick-info-box-title">Total Orders</div>
            <div className="admin-home-quick-info-box-content">50</div>
          </div>
          <div
            className="admin-home-quick-info-box"
           
          >
            <div className="admin-home-quick-info-box-title">Total Users</div>
            <div className="admin-home-quick-info-box-content">{users?.length}</div>

          </div>
          <div
            className="admin-home-quick-info-box"
           
          ></div>
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
                  barWidth={20}
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
                {/* <BarGraph
                data={activeUsers}
                barWidth={10}
                legendLabel="Active users"
                yAxisLabel="Users"
                barColor="#05d140"
              /> */}

                <LoginUsersChart data={activeUsers} />
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
    </div>
  );
}

export default AdminHome;
