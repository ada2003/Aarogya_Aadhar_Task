'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Star, ThumbsUp, ShoppingCart } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { CustomerData, StatsData } from '@/types';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalReviews: 0,
    avgRating: 0,
    positiveReviews: 0,
    weeklyPurchasers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
        calculateStats(data.customers);
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (customersData: CustomerData[]) => {
    const totalReviews = customersData.length;
    const avgRating =
      totalReviews > 0
        ? customersData.reduce((sum, c) => sum + c.rating, 0) / totalReviews
        : 0;
    const positiveReviews = customersData.filter((c) => c.rating >= 4).length;
    const weeklyPurchasers = customersData.filter(
      (c) => c.purchaseFrequency === 'Weekly'
    ).length;

    setStats({
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      positiveReviews,
      weeklyPurchasers,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={TrendingUp}
          color="text-sky-600"
        />
        <StatsCard
          title="Average Rating"
          value={`${stats.avgRating} ⭐`}
          icon={Star}
          color="text-green-600"
        />
        <StatsCard
          title="Positive Reviews"
          value={stats.positiveReviews}
          icon={ThumbsUp}
          color="text-blue-600"
        />
        <StatsCard
          title="Weekly Purchasers"
          value={stats.weeklyPurchasers}
          icon={ShoppingCart}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reviews</h2>
        {customers.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reviews yet. Create your first customer review!</p>
        ) : (
          <div className="space-y-4">
            {customers.slice(0, 5).map((customer) => (
              <div
                key={customer._id}
                className="border-b pb-4 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.snackName}</p>
                  </div>
                  <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium">
                    {customer.rating} ⭐
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{customer.feedback}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(customer.createdAt!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}