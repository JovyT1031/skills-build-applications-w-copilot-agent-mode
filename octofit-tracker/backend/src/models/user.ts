import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  fitnessGoal: string;
  location: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  fitnessGoal: { type: String, required: true },
  location: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);
