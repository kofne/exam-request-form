"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
  grade: z.enum(['Standard 1–7 (PSLE)', 'Form 1–3 (JCE)', 'Form 4–5 (BGCSE)']),
  subjects: z.string().min(1, 'Subjects are required'),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!paymentCompleted) {
      toast.error('Please complete the payment first');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Thank you! Your request has been received. We\'ll process it and email you within 24 hours.');
      reset();
      setPaymentCompleted(false);
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 animate-gradient">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-pulse"></div>
      <main className="relative min-h-screen p-8 max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border-2 border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">Request Form</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100 shadow-sm">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Student Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Name</label>
                  <input
                    {...register('name')}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
                    type="text"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                  <input
                    {...register('email')}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
                    type="email"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg border border-green-100 shadow-sm">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-4">Academic Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Grade</label>
                  <select
                    {...register('grade')}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/80 backdrop-blur-sm"
                  >
                    <option value="">Select your grade</option>
                    <option value="Standard 1–7 (PSLE)">Standard 1–7 (PSLE)</option>
                    <option value="Form 1–3 (JCE)">Form 1–3 (JCE)</option>
                    <option value="Form 4–5 (BGCSE)">Form 4–5 (BGCSE)</option>
                  </select>
                  {errors.grade && (
                    <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Subjects</label>
                  <input
                    {...register('subjects')}
                    className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/80 backdrop-blur-sm"
                    type="text"
                    placeholder="Enter subjects (e.g., Mathematics, Science)"
                  />
                  {errors.subjects && (
                    <p className="text-red-500 text-sm mt-1">{errors.subjects.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100 shadow-sm">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">Your Request</h2>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Message</label>
                <textarea
                  {...register('message')}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all h-32 bg-white/80 backdrop-blur-sm"
                  placeholder="Please describe your request in detail"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Payment (USD 10)</h2>
              <div className="w-full max-w-md mx-auto">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            value: "10",
                            currency_code: "USD"
                          }
                        }
                      ]
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      await actions.order.capture();
                      setPaymentCompleted(true);
                      toast.success('Payment completed successfully!');
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    toast.error('Payment failed. Please try again.');
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!paymentCompleted || isSubmitting}
              className={`w-full p-4 rounded-lg text-white font-medium text-lg transition-all ${
                paymentCompleted && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:via-pink-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}