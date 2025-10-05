import mongoose, { Schema, Model } from 'mongoose';

export interface ICustomer {
  name: string;
  email: string;
  phone: string;
  snackName: string;
  rating: number;
  feedback: string;
  purchaseFrequency: 'Daily' | 'Weekly' | 'Monthly' | 'Occasionally';
  createdAt: Date;
  userId: string;
}

const CustomerSchema = new Schema<ICustomer>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  snackName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    required: true,
  },
  purchaseFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Occasionally'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;