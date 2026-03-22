import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { StatCard } from '../components/StatCard';

interface PaymentSummary {
  payment_method: string;
  order_type: string;
  order_count: number;
  total_amount: string;
}

const paymentLabels: Record<string, string> = {
  upi: 'UPI',
  cash: 'Cash',
  card: 'Card',
  paytm: 'Paytm',
};

const orderTypeLabels: Record<string, string> = {
  'dine-in': 'Dine-In',
  'take-away': 'Take Away',
};

export default function PaymentsOverview() {
  const [summary, setSummary] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/orders/payment-summary')
      .then(res => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load payment summary');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Group by payment method for cards
  const grouped = summary.reduce<Record<string, PaymentSummary[]>>((acc, item) => {
    if (!acc[item.payment_method]) acc[item.payment_method] = [];
    acc[item.payment_method].push(item);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payments Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.keys(grouped).map(method => (
          <StatCard
            key={method}
            title={paymentLabels[method] || method}
            value={grouped[method].reduce((sum, s) => sum + parseFloat(s.total_amount), 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            description={`${grouped[method].reduce((sum, s) => sum + s.order_count, 0)} orders`}
          />
        ))}
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Detailed Breakdown</h2>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-4">Payment Method</th>
                <th className="text-left py-2 px-4">Order Type</th>
                <th className="text-right py-2 px-4">Orders</th>
                <th className="text-right py-2 px-4">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-4">{paymentLabels[row.payment_method] || row.payment_method}</td>
                  <td className="py-2 px-4">{orderTypeLabels[row.order_type] || row.order_type}</td>
                  <td className="py-2 px-4 text-right">{row.order_count}</td>
                  <td className="py-2 px-4 text-right">{parseFloat(row.total_amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
