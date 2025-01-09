import React from 'react';
import './OrderTracker.css'

export default function OrderTracker({orderDeliveryStatus}) {

  const stages = [
    { id: "placed", label: "Placed" },
    { id: "packaged", label: "Packaged" },
    { id: "shipped", label: "Shipped" },
    { id: "in-transit", label: "In Transit" },
    { id: "out-for-delivery", label: "Out for Delivery" },
    { id: "delivered", label: "Delivered" }
  ];

  const isStageActive = (stageId) => {
    const stageIndex = stages.findIndex(stage => stage.id === stageId);
    const currentIndex = stages.findIndex(stage => stage.id === orderDeliveryStatus);
    return stageIndex <= currentIndex;
  };

  return (
    <div className="order-tracking-container">
      <div className="order-status-text-container">
        <div className="order-status-text-key">Order status :</div>
        <div className="order-status-text-value">
          {orderDeliveryStatus.charAt(0).toUpperCase() + orderDeliveryStatus.slice(1).replace(/-/g, ' ')}
        </div>
      </div>
      <div className="order-status-text-container">
      <div className="order-status-text-key">Location :</div>
      <div className="order-status-text-value">Mumbai</div>
      </div>
      <div className="order-status-progress-container">
        {stages.map((stage, index) => (
          <div key={stage.id} className="progress-stage">
            <div className="progress-line-container">
              {index > 0 && <div className={`progress-line ${isStageActive(stage.id) ? 'active' : ''}`}></div>}
              <div className={`progress-point ${isStageActive(stage.id) ? 'active' : ''}`}>
                <div className="point"></div>
              </div>
              {index < stages.length - 1 && <div className={`progress-line ${isStageActive(stage.id) ? 'active' : ''}`}></div>}
            </div>
            <div className="label">{stage.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}