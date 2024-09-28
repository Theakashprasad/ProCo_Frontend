import React from 'react';
import animationData from "../../assets/PaymentSuccess.json";
import Lottie from "lottie-react";

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="mx-auto">
          <Lottie animationData={animationData} />
        </div>
        <div>
          <h1 className="text-2xl uppercase">Payment has been successfully processed</h1>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
