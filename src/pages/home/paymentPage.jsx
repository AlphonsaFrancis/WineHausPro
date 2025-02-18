import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import Header from '../../components/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './paymentPage.css';
import config from '../../config/config';

const BASE_URL = 'http://127.0.0.1:8000';

const PaymentPage = () => {
  const location = useLocation();
  const { selectedAddress, total } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('online'); // Default to online payment
  const [cartId, setCartId] = useState(null); // State to store cart ID
  const [userWalletAmount, setUserWalletAmount]=useState()
  const [consumeUserWallet, setConsumeUserWallet]=useState(false)
  const [totalAmount,setTotalAmount]=useState(0)
  const navigate=useNavigate();
  const userId = localStorage.getItem('userId'); // Get the user ID from localStorage

  useEffect(() => {
    if (!selectedAddress || !total) {
      toast.error('Missing payment details. Please go back and try again.');
      return;
    }
    fetchCartDetails(); // Fetch the cart details
    loadRazorpayScript();
    setTotalAmount(total) // Load the Razorpay script when the component mounts
  }, [selectedAddress, total]);

  useEffect(()=>{
    axios.get(`${config.BASE_URL}api/v1/auth/get-user-wallet/${userId}/`)
    .then((response)=>{
      console.log("response",response)
      setUserWalletAmount(response?.data?.balance)
    })
    .catch((err)=>{
      console.log("err")
    })
  },[])

  useEffect(() => {
    if (consumeUserWallet) {
      if (userWalletAmount >= total) {
        setTotalAmount(0); // Wallet covers full amount
        setPaymentMethod('')
      } else {
        setTotalAmount(total - userWalletAmount); // Deduct wallet amount
      }
    } else {
      setTotalAmount(total); // No wallet deduction
    }
  }, [consumeUserWallet, userWalletAmount, total]);
  
    console.log("Total amount:", total - (consumeUserWallet ? userWalletAmount : 0));
  

  // Function to fetch the cart details for the logged-in user
  const fetchCartDetails = async () => {
    try {
      if (!userId) {
        toast.error('User is not logged in.');
        return;
      }

      const response = await axios.get(`${config.BASE_URL}api/v1/orders/cart-list/?user_id=${userId}`);
      if (response.data && response.data.length > 0) {
        const userCart = response.data[0];
        setCartId(userCart.cart_id);
      } else {
        toast.error('No cart found for the current user.');
      }
    } catch (error) {
      console.error('Error fetching cart details:', error);
      toast.error('Failed to fetch cart details.');
    }
  };

  // Function to dynamically load the Razorpay script
  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => console.log('Razorpay script loaded successfully');
    script.onerror = () => toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
    document.body.appendChild(script);
  };

  // Initiate payment based on the selected payment method
  const initiatePayment = () => {
    if (!cartId) {
      toast.error('Cart ID is not available. Unable to proceed with payment.');
      return;
    }

    if(userWalletAmount>=total){
      handleCODPayment()

    }

    if (paymentMethod === 'cod') {
      handleCODPayment();
    } else {
      handleOnlinePayment();
    }
  };

  // const handleCODPayment = () => {
  //   axios.post(`${config.BASE_URL}api/v1/orders/payments/create/`, {
  //     payment_method: 'cod',
  //     amount: totalAmount,
  //     cart_id: cartId,
  //   })
  //   .then(response => {
  //     toast.success('Order placed successfully with Cash on Delivery!');
  //     if(consumeUserWallet){
  //       axios.post(`${config.BASE_URL}api/v1/auth/deduct-from-wallet/${userId}/`,{amount:userWalletAmount})
  //     .then((response)=>{
  //       toast.success('Amount deducted from wallet successfully!');
  //       clearCartItems(cartId);
  //       navigate('/userorder');

  //     })
  //     .catch((error)=>{
  //       console.log("Error",error)
  //       toast.error('Failed to place order. Please try again.');
  //     })


  //     }
  //     clearCartItems(cartId);
  //     navigate('/userorder');
      
  //   })
  //   .catch(error => {
  //     console.error("COD Payment error:", error);
  //     toast.error('Failed to place order. Please try again.');
  //   });
  // };

  const handleCODPayment = async () => {
    try {
      // Create order with COD
      const orderResponse = await axios.post(`${config.BASE_URL}api/v1/orders/payments/create/`, {
        payment_method: 'cod',
        amount: totalAmount,
        cart_id: cartId,
      });
  
      toast.success('Order placed successfully with Cash on Delivery!');
  
      // If user wants to use wallet balance
      if (consumeUserWallet) {
        try {
          await axios.post(`${config.BASE_URL}api/v1/auth/deduct-from-wallet/${userId}/`, {
            amount: total,
          });
          toast.success('Amount deducted from wallet successfully!');
        } catch (walletError) {
          console.error("Wallet deduction error:", walletError);
          toast.error('Failed to deduct amount from wallet. Please check your wallet balance.');
        }
      }
  
      // Clear cart and navigate after successful order & wallet deduction
      clearCartItems(cartId);
      navigate('/userorder');
  
    } catch (orderError) {
      console.error("COD Payment error:", orderError);
      toast.error('Failed to place order. Please try again.');
    }
  };
  

  // Handle online payment with Razorpay
  const handleOnlinePayment = async () => {
    try {
      const response = await axios.post(`${config.BASE_URL}api/v1/orders/payments/create/`, {
        payment_method: 'online',
        amount: totalAmount,
        cart_id: cartId,
      });

      if (response.data && response.data.order_id) {
        const options = {
          key: 'rzp_test_yIjQWNT42YCgb7',
          amount: total * 100, // amount in paise
          currency: 'INR',
          name: 'WineHaus',
          description: 'Payment for your order',
          order_id: response.data.order_id,  // Attach the Razorpay order ID here
          // handler: function (razorpayResponse) {
          //   verifyPayment(razorpayResponse.razorpay_payment_id, response.data.order_id);
          // },
          handler: function (razorpayResponse) {
            verifyPayment(razorpayResponse.razorpay_payment_id, response.data.order_id);
         },
         
          prefill: { name: 'User Name', email: 'user@example.com', contact: '9876543210' },
          theme: { color: '#008000' }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function () {
          toast.error('Payment failed. Please try again.');
        });
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please check your network connection.');
    }
  };

  // Verify payment after successful Razorpay transaction

// const verifyPayment = async (paymentId, orderId) => {
//   try {
//     const response = await axios.post(`${config.BASE_URL}api/v1/orders/payments/verify/`, {
//       payment_id: paymentId,
//       order_id: orderId,
//     });

//     if(consumeUserWallet){

//       axios.post(`${config.BASE_URL}api/v1/auth/deduct-from-wallet/${userId}/`,{amount:userWalletAmount})
//       .then(response => {
//         console.log('Payment verified successfully:', response.data);
//         toast.success('Payment verified successfully!');
    
//        clearCartItems();
//       })
//       .catch((err)=>{
//         toast.error('Payment verification failed. Please contact support.');
  
//       })

//     }
//     toast.success('Payment verified successfully!');
    
//     clearCartItems();

   

   

//   } catch (error) {
//     console.error('Payment verification failed:', error);
//     toast.error('Payment verification failed. Please contact support.');
//   }
// };


const verifyPayment = async (paymentId, orderId) => {
  try {
    // Verify the payment
    const response = await axios.post(`${config.BASE_URL}api/v1/orders/payments/verify/`, {
      payment_id: paymentId,
      order_id: orderId,
    });

    toast.success('Payment verified successfully!');

    // If user wants to use wallet balance
    if (consumeUserWallet) {
      try {
        await axios.post(`${config.BASE_URL}api/v1/auth/deduct-from-wallet/${userId}/`, {
          amount: total,
        });
        toast.success('Amount deducted from wallet successfully!');
      } catch (walletError) {
        console.error("Wallet deduction error:", walletError);
        toast.error('Wallet deduction failed. Please check your wallet balance.');
      }
    }

    // Clear cart after successful verification and wallet deduction
    clearCartItems();

  } catch (error) {
    console.error('Payment verification failed:', error);
    toast.error('Payment verification failed. Please contact support.');
  }
};


// Function to clear cart items after order is placed
const clearCartItems = async () => {
  try {
    const userId = localStorage.getItem('userId');
    await axios.delete(`${config.BASE_URL}api/v1/orders/cart-items/clear/?user_id=${userId}`);
    navigate('/userorder');
    toast.success('Cart cleared successfully!');
  } catch (error) {
    console.error('Error clearing cart items:', error);
    toast.error('Failed to clear cart items.');
  }
};


  return (
   
    <div>
    <Header />
    <div className="payment-page">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <h2>Payment Page</h2>
      {selectedAddress && total ? (
        <div className="payment-content">
          <p className="total-amount">Proceeding to payment for total amount: <strong>₹{totalAmount}</strong></p>
          <div className="payment-methods">
            <div className="wallet-option">
              {userWalletAmount > 0 && 
              <label>
              <input
                type="checkbox"
                checked={consumeUserWallet}
                onChange={() => setConsumeUserWallet(!consumeUserWallet)}
              />
              <span className="checkmark"></span>
              Use ₹{userWalletAmount > total ? total : userWalletAmount} from your wallet
            </label>
            }
              
            </div>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  disabled={consumeUserWallet&&userWalletAmount>=total}
                />
                <span className="radio-checkmark"></span>
                Online Payment
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  disabled={consumeUserWallet&&userWalletAmount>=total}
                />
                <span className="radio-checkmark"></span>
                Cash on Delivery
              </label>
            </div>
          </div>
          <button className="payment-btn" onClick={initiatePayment}>Proceed to Payment</button>
        </div>
      ) : (
        <p className="error-message">Unable to proceed with payment due to missing details. Please go back and select an address.</p>
      )}
    </div>
  </div>
  );
};

export default PaymentPage;