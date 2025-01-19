import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  MenuItem,
  Modal,
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  FormControl,
  CircularProgress,
} from "@mui/material";
import config from "../config/config";
import axios from "axios";
import { timeStampToLocalString } from "../pages/dashboard/helper";

const OrderItemsList = () => {
  const { orderId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  const statusOptions = [
    "placed",
    "packed",
    "shipped",
    "inTransit",
    "outForDelivery",
    "delivered",
    "cancelled",
  ];

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.BASE_URL}api/v1/orders/order-items/${parseInt(orderId)}`
      );
      setOrderItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const getStatusStyle = (status) => {
    const styles = {
      placed: {
        backgroundColor: "#FFF3E0",
        color: "#E65100",
        border: "1px solid #FFB74D",
      },
      packed: {
        backgroundColor: "#E3F2FD",
        color: "#1565C0",
        border: "1px solid #64B5F6",
      },
      shipped: {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        border: "1px solid #81C784",
      },
      inTransit: {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        border: "1px solid #81C784",
      },
      outForDelivery: {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32",
        border: "1px solidrgb(212, 243, 36)",
      },
      delivered: {
        backgroundColor: "#E8F5E9",
        color: "#1B5E20",
        border: "1px solid #4CAF50",
      },
      cancelled: {
        backgroundColor: "#FFEBEE",
        color: "#C62828",
        border: "1px solid #E57373",
      },
    };
    return styles[status] || {};
  };

  const handleStatusChange = (itemId, event) => {
    setSelectedItem(itemId);
    setNewStatus(event.target.value);
    setIsModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      setUpdatingStatus(true);

      // Make API call
      await axios.post(
        `${config.BASE_URL}api/v1/orders/update-order-status/${parseInt(
          selectedItem
        )}/`,
        { order_status: newStatus }
      );

      // Update local state immediately
      setOrderItems(
        orderItems.map((item) =>
          item.order_item_id === selectedItem
            ? { ...item, order_status: newStatus }
            : item
        )
      );

      // Refresh data from server to ensure consistency
      await fetchOrderData();

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {user.is_superuser ? (
          <>
            <a href="/admin">Admin</a>
            <span style={{ margin: "0 5px" }}>/</span>
            <a href="/admin/orders">Orders</a>
          </>
        ) : user.is_delivery_agent ? (
          <>
            <a href="/order-delivery">Home</a>
          </>
        ) : (
          <>
            <a href="/staff">Home</a>
            <span style={{ margin: "0 5px" }}>/</span>
            <a href="/staff/orders">Orders</a>
          </>
        )}
      </div>

      <Typography variant="h4" component="h2" gutterBottom>
        Order Items
      </Typography>
      {orderItems.map((item) => (
        <Paper
          key={item.id}
          elevation={2}
          sx={{
            mb: 2,
            p: 3,
            "&:hover": {
              bgcolor: "grey.50",
            },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={2}>
              <Box
                component="img"
                src={`${config.BASE_URL}${item?.product_id?.image}`}
                alt={item.name}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 1,
                  maxWidth: "96px",
                }}
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <Typography variant="h6" gutterBottom>
                {item?.product_id?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {item?.product_id?.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item?.quantity}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${item?.price}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Order Date: {timeStampToLocalString(item?.created_at)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <Select
                  value={item.order_status}
                  onChange={(e) => handleStatusChange(item.order_item_id, e)}
                  sx={{
                    minWidth: 120,
                    ...getStatusStyle(item.order_status),
                    "& .MuiSelect-select": {
                      textTransform: "capitalize",
                    },
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                >
                  {statusOptions.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={{
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="confirm-status-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            maxWidth: 400,
            mx: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Confirm Status Change
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to change the order status to {newStatus}?
            This action cannot be undone.
          </Typography>
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              onClick={() => setIsModalOpen(false)}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              variant="contained"
              disabled={updatingStatus}
            >
              {updatingStatus ? <CircularProgress size={24} /> : "Confirm"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default OrderItemsList;
