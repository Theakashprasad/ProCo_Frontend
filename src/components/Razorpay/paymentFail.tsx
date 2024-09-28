import React from 'react'
import animationData from "../../assets/PaymentFail.json";
import Lottie from "lottie-react";

const PaymentFail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600">
    <div className="text-center">
      <div className=" mx-auto">
        <Lottie animationData={animationData} />
      </div>
      <div>
        <h1 className="text-white ">PAYMENT HAS BEEN FAILED</h1>
      </div>
    </div>
  </div>
  )
}

export default PaymentFail
