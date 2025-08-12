import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  X, CreditCard, Shield, Clock, Users, 
  CheckCircle, Sparkles, Award, Target 
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, resumeId, resumeTitle }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    specialRequests: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await axios.post(`/api/resumes/${resumeId}/submit`, {
        paymentDetails: {
          amount: 249,
          method: paymentMethod,
          transactionId: `TXN_${Date.now()}`
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phone
        },
        specialRequests: formData.specialRequests
      });

      setStep(3);
      setTimeout(() => {
        onClose();
        window.location.href = "/dashboard";
      }, 3000);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Users, text: 'Expert reviewers' },
    { icon: Target, text: '94% ATS pass rate' },
    { icon: Clock, text: '24-hour delivery' },
    { icon: Award, text: '3.2x more interviews' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {step === 1 && (
              <>
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white relative">
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className="w-8 h-8" />
                    <div>
                      <h2 className="text-xl font-bold">Submit for Expert Review</h2>
                      <p className="text-purple-100 text-sm">Resume: {resumeTitle}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold">₹249</div>
                    <p className="text-purple-100 text-sm">One-time payment • 24h delivery</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-violet-50 rounded-lg">
                          <Icon className="w-4 h-4 text-violet-600" />
                          <span className="text-xs text-slate-700">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                        className="bg-white/80"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                        required
                        className="bg-white/80"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests (Optional)</label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                        placeholder="Target roles, specific requirements..."
                        className="w-full px-3 py-2 rounded-lg border bg-white/80 text-sm resize-none"
                        rows={2}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600">
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                  <button 
                    onClick={() => setStep(1)}
                    className="mb-4 text-purple-200 hover:text-white text-sm"
                  >
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Secure Payment
                  </h2>
                  <p className="text-purple-100 text-sm">₹249 • SSL Encrypted</p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                      <Input
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="bg-white/80"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 h-12"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 mr-2" />
                          Pay ₹249 & Submit
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-slate-600 mb-4">Resume submitted for expert review</p>
                
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-green-700">
                    ✅ You'll receive updates via email<br/>
                    📅 Expected delivery: Within 24 hours
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Redirecting to dashboard in 3 seconds...
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
