import mongoose, { Schema, type Document } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  description: string;
  difficulty: string;
  durationMinutes: number;
  equipment: string[];
}

const workoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  equipment: [{ type: String, required: true }],
});

export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
