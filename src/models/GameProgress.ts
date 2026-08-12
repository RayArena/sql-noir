import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGameProgress extends Document {
  userId: string;
  completedCases: number[];
  completedQuests: string[];
  currentObjectives: Map<string, number>;
  updatedAt: Date;
}

const GameProgressSchema = new Schema<IGameProgress>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    completedCases: { type: [Number], default: [] },
    completedQuests: { type: [String], default: [] },
    currentObjectives: { type: Map, of: Number, default: new Map() },
  },
  { timestamps: true }
);

export const GameProgress: Model<IGameProgress> =
  mongoose.models.GameProgress ||
  mongoose.model<IGameProgress>("GameProgress", GameProgressSchema);
