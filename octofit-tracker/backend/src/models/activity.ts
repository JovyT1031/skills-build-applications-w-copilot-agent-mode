import mongoose, { Schema, type Document } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  type: string;
  durationMinutes: number;
  date: string;
  calories: number;
}

const activitySchema = new Schema<IActivity>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  date: { type: String, required: true },
  calories: { type: Number, required: true },
});

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
