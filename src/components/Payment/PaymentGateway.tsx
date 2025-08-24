import React, { useState } from 'react';
import { CreditCard, Lock, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentGatewayProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful payment
      const paymentData = {
        id: `pay_${Date.now()}`,
        amount,
        method: paymentMethod,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      onSuccess(paymentData);
      toast.success('Payment successful!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
          <Shield className="h-10 w-10 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
        <p className="text-gray-600 mt-2">Complete your booking payment</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount</span>
          <span className="text-2xl font-bold text-primary-600">${amount}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-3">
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <CreditCard className="h-5 w-5 text-primary-600 mr-3" />
            <span className="font-medium">Credit/Debit Card</span>
          </label>
          
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            paymentMethod === 'paypal' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className="w-5 h-5 bg-blue-600 rounded mr-3"></div>
            <span className="font-medium">PayPal</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              required
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              required
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                required
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                required
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4">
            <Lock className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Pay ${amount}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {paymentMethod === 'paypal' && (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded mx-auto mt-2"></div>
            </div>
            <p className="text-gray-600">You will be redirected to PayPal to complete your payment</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setProcessing(true);
                setTimeout(() => {
                  const paymentData = {
                    id: `paypal_${Date.now()}`,
                    amount,
                    method: 'paypal',
                    status: 'completed',
                    timestamp: new Date().toISOString(),
                  };
                  onSuccess(paymentData);
                }, 2000);
              }}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Redirecting...' : 'Continue with PayPal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;