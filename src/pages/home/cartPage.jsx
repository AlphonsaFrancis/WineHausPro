// import React, { useState } from 'react';
// import './cartPage.css';

// const CartPage = () => {
//   const [quantity, setQuantity] = useState(1);

//   const increaseQuantity = () => setQuantity(quantity + 1);
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleRemove = () => {
//     console.log('Item removed from cart');
//   };

//   const handleCheckout = () => {
//     console.log('Proceeding to checkout');
//   };

//   return (
//     <div className="accurate-cart-page">
//       <h1>Your Shopping Cart</h1>

//       <div className="accurate-cart-container">
//         <div className="accurate-cart-items">
//           <div className="accurate-cart-item">
//             <img src="https://via.placeholder.com/150" alt="Product" />
//             <div className="accurate-item-details">
//               <h4>Product Name</h4>
//               <p className="accurate-price">Price: <span>₹ 999</span></p>
//               <div className="accurate-quantity-control">
//                 <button className="accurate-qty-btn" onClick={decreaseQuantity}>-</button>
//                 <span className="accurate-quantity">{quantity}</span>
//                 <button className="accurate-qty-btn" onClick={increaseQuantity}>+</button>
//               </div>
//             </div>
//             <button className="accurate-remove-btn" onClick={handleRemove}>
//               <i className="fas fa-trash"></i>
//             </button>
//           </div>
//         </div>

//         <div className="accurate-cart-summary">
//           <h3>Order Summary</h3>
//           <p>Subtotal: <span>₹ {999 * quantity}</span></p>
//           <p>Shipping: <span>₹ 100</span></p>
//           <h4>Total: <span>₹ {999 * quantity + 100}</span></h4>
//           <button className="accurate-checkout-btn" onClick={handleCheckout}>
//             Proceed to Checkout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
