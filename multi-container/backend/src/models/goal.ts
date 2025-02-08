import mongoose from "mongoose";

const Schema = mongoose.Schema;

const goalSchema = new Schema({
  text: String,
  completed: Boolean,
});

export const GoalModel = mongoose.model("Goal", goalSchema);
