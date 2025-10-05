export interface CustomerData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  snackName: string;
  rating: number;
  feedback: string;
  purchaseFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Occasionally';
  createdAt?: Date;
}

export interface StatsData {
  totalReviews: number;
  avgRating: number;
  positiveReviews: number;
  weeklyPurchasers: number;
}