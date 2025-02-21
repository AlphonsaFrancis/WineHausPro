import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userorder.css";
import Header from "../../components/Navbar";
import config from "../../config/config";
import OrderTracker from "../../components/OrderTracker";
import WriteProductReview from "../../components/WriteProductReview";
import { timeStampToLocalString } from "../dashboard/helper";
import UserReviewBox from "../../components/UserReviewBox";
import { getReviewForOrder, getReviewById } from "./utils";

const BASE_URL = "http://127.0.0.1:8000";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const [userSummaries, setUserSummaries] = useState();
  const [isEditReview, setIsEditReview] = useState(false);
  const [addMoreReview, setAddMoreReview] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const userId = localStorage.getItem("userId");

  console.log("userSummaries", userSummaries);
  console.log("isEditReview",isEditReview)


  useEffect(() => {
    axios
      .get(`${config.BASE_URL}api/v1/products/${userId}/user-review-summary/`)
      .then((response) => {
        setUserSummaries(response?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId,selectedReviewId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}api/v1/orders/user-orders/${userId}/`
        );
        if (Array.isArray(response.data)) {
          const ordersWithItems = await Promise.all(
            response.data.map(async (orderData) => {
              const orderId = orderData.order.order_id;
              if (orderId) {
                try {
                  const itemsResponse = await axios.get(
                    `${config.BASE_URL}api/v1/orders/order-items/${orderId}/`
                  );
                  return {
                    ...orderData,
                    order_items: itemsResponse.data,
                  };
                } catch (itemsError) {
                  console.error(
                    `Error fetching items for Order ID ${orderId}:`,
                    itemsError
                  );
                  return orderData;
                }
              } else {
                return orderData;
              }
            })
          );
          setOrders(ordersWithItems);
        } else {
          console.error("Response data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleDeleteOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmModal(true);
  };

  const confirmDeletion = async () => {
    try {
      await axios.delete(
        `${config.BASE_URL}api/v1/orders/delete/${selectedOrderId}/`
      );
      setOrders(
        orders.filter((order) => order.order.order_id !== selectedOrderId)
      );
      toast.success("Order deleted successfully.");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete the order. Please try again.");
    }
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  };

  const cancelDeletion = () => {
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  };

  const downloadReceipt = async (order) => {
    const doc = new jsPDF();
    const centerText = (text, y) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Company Name Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    centerText("Wine Haus", 20);

    // Receipt Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    centerText("Order Receipt", 30);

    // Border & Sectioned Layout
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 40, 190, 140); // Outer border

    // Order Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order.order.order_id}`, 15, 60);
    doc.text(
      `Order Date: ${new Date(order.order.order_date).toLocaleDateString()}`,
      15,
      70
    );
    doc.text(`Order Status: ${order.order.order_status}`, 15, 80);

    // Payment Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 15, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment ID: ${order.order.payment_id || "N/A"}`, 15, 100);
    doc.text(`Total Amount: ₹${order.order.total_amount}`, 15, 110);

    // Items Section Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Items Purchased", 15, 120);

    // Item Details
    doc.setFontSize(10);
    let yPosition = 130;
    order.order_items.forEach((item, index) => {
      doc.text(`Item ${index + 1}: ${item.product_id.name}`, 15, yPosition);
      doc.text(
        `Description: ${item.product_id.description || "N/A"}`,
        15,
        yPosition + 10
      );
      doc.text(`Quantity: ${item.quantity}`, 15, yPosition + 20);
      doc.text(`Price per item: ₹${item.price}`, 15, yPosition + 30);
      yPosition += 40;
    });

    // Footer Section
    doc.setFontSize(10);
    centerText("Thank you for your purchase!", yPosition + 10);
    centerText(
      "For any inquiries, contact us at support@winehaus.com",
      yPosition + 20
    );

    // Download the PDF
    doc.save(`Order_${order.order.order_id}_Receipt.pdf`);
    toast.success("Receipt downloaded successfully.");
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    try {
      await axios.post(
        `${config.BASE_URL}api/v1/orders/cancel-user-order/${orderToCancel.order_id}/`,
        { user_id: userId }
      );
      
      // Update the orders list to reflect the cancellation
      setOrders(orders.map(orderData => {
        if (orderData.order.order_id === orderToCancel.order_id) {
          return {
            ...orderData,
            order: {
              ...orderData.order,
              order_status: 'cancelled'
            },
            order_items: orderData.order_items.map(item => ({
              ...item,
              order_status: 'cancelled'
            }))
          };
        }
        return orderData;
      }));

      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.error || "Failed to cancel the order");
    }
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const cancelCancellation = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  return (
    <div>
      <Header />
      <div className="orders-container">
        <h1 className="orders-title">Your Orders</h1>

        {orders.map(({ order, order_items, products_reviewed }) => (
          <div key={order.order_id} className="order-card">
            <p className="order-date">
              Order Date: {new Date(order.order_date).toLocaleDateString()}
            </p>
            <h4 className="order-items-title">Items:</h4>
            <ul className="order-items-list">
              {order_items.map((item) => {
                const productReview =
                  products_reviewed[item.product_id.product_id];

                const reviewsForOrder = getReviewForOrder(
                  item?.order_id,
                  userSummaries
                );

                return (
                  <li key={item.order_item_id} className="order-item">
                    <div className="order-content-wrapper">
                      <div className="order-main-content">
                        <img
                          src={
                            item.product_id.image
                              ? `${BASE_URL}${item.product_id.image}`
                              : "https://via.placeholder.com/150"
                          }
                          alt={item.product_id.name}
                          className="order-item-image"
                        />
                        <div className="order-item-info">
                          <strong>{item.product_id.name}</strong>
                          <div>
                            Description:{" "}
                            {item.product_id.description ||
                              "No description available"}
                          </div>
                          <div>Quantity: {item.quantity}</div>
                          <div>Price per item: ₹{item.price}</div>

                          {productReview?.has_review &&
                          productReview?.order_id === item?.order_id ? (
                            <div className="review-box-container">
                              {reviewsForOrder.length > 0 ? (
                                reviewsForOrder.map((review) => (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div style={{ width: "70%" }}>
                                      <UserReviewBox
                                        key={review.id}
                                        reviewData={review}
                                      />
                                    </div>

                                    <div
                                      style={{
                                        width: "16%",
                                        cursor: "pointer",
                                        color:'#0652a7',
                                        fontWeight:'bold',
                                        fontSize:'11px',
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems:'center'
                                      }}
                                      onClick={() => {
                                        setIsEditReview(true);
                                        setSelectedReviewId(review.id);
                                        setSelectedOrderId(order.order_id)
                                      }}
                                    >
                                      Edit review 
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <WriteProductReview
                                  productId={item.product_id.product_id}
                                  userId={order.user_id}
                                  orderId={order.order_id}
                                />
                              )}
                              <button
                                onClick={() => {
                                  setAddMoreReview(true);
                                  setSelectedOrderId(order?.order_id);
                                }}
                              >
                                Add more review
                              </button>{" "}
                              {isEditReview &&
                                selectedOrderId === order.order_id && (
                                  <WriteProductReview
                                    productId={item.product_id.product_id}
                                    userId={order.user_id}
                                    orderId={order.order_id}
                                    existingReview={getReviewById(
                                      selectedReviewId,
                                      userSummaries
                                    )}
                                  />
                                )}
                              {addMoreReview &&
                                selectedOrderId === order.order_id && (
                                  <WriteProductReview
                                    productId={item.product_id.product_id}
                                    userId={order.user_id}
                                    orderId={order.order_id}
                                  />
                                )}
                            </div>
                          ) : (
                            <>
                              {item.order_status === "delivered" && (
                                <WriteProductReview
                                  productId={item.product_id.product_id}
                                  userId={order.user_id}
                                  orderId={order.order_id}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="order-tracking-section">
                        {item.order_status !== "delivered" ? (
                          <OrderTracker
                            orderDeliveryStatus={item.order_status}
                          />
                        ) : (
                          <div className="delivery-status">
                            <span className="delivery-icon">✓</span>
                            <div className="delivery-text">
                              <span className="delivery-label">
                                Delivered on:
                              </span>
                              <span className="delivery-date">
                                {timeStampToLocalString(order?.updated_at)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="order-actions">
              {['placed', 'processing'].includes(order.order_status) && (
                <button
                  className="cancel-order-button"
                  onClick={() => handleCancelOrder(order)}
                >
                  Cancel Order
                </button>
              )}
              <button
                className="delete-order-button"
                onClick={() => handleDeleteOrder(order.order_id)}
              >
                Delete Order
              </button>
              <button
                className="download-receipt-button"
                onClick={() => downloadReceipt({ order, order_items })}
              >
                Download Receipt
              </button>
            </div>
          </div>
        ))}

        {showConfirmModal && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <div className="confirm-modal-content">
                <h2>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>{" "}
                  Confirm Deletion
                </h2>
                <p>Are you sure you want to delete this order?</p>
                <div className="modal-buttons">
                  <button onClick={confirmDeletion} className="confirm-btn">
                    Yes
                  </button>
                  <button onClick={cancelDeletion} className="cancel-btn">
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCancelModal && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <div className="confirm-modal-content">
                <h2>
                  <span role="img" aria-label="warning">⚠️</span> Confirm Cancellation
                </h2>
                <p>Are you sure you want to cancel this order?</p>
                <div className="modal-buttons">
                  <button onClick={confirmCancellation} className="confirm-btn">
                    Yes, Cancel Order
                  </button>
                  <button onClick={cancelCancellation} className="cancel-btn">
                    No, Keep Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default OrdersPage;
