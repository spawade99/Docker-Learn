import express from "express";
import mongoose from "mongoose";
import { GoalModel as Goal } from "./models/goal";
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/goals", async (req, res) => {
  console.log("GET /goals");
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal: any) => ({
        id: goal._id,
        text: goal.text,
        completed: goal.completed,
      })),
    });
    console.log("GET /goals success");
  } catch (error) {
    console.error("GET /goals error");
    console.error(error);
    res.status(500).json({ error: "Failed to load goals" });
  }
});

app.post("/goals", async (req, res) => {
  console.log("POST /goals");
  try {
    const goalText = req.body.text;
    if (!goalText || goalText.trim().length === 0) {
      res.status(400).json({ error: "Goal text is required" });
      return;
    }
    const goal = new Goal({ text: req.body.text, completed: false });
    await goal.save();
    res
      .status(201)
      .json({ id: goal._id, text: goal.text, completed: goal.completed });
    console.log("POST /goals success");
  } catch (error) {
    console.error("POST /goals error");
    console.error(error);
    res.status(500).json({ error: "Failed to save goal" });
  }
});

app.put("/goals/:id", async (req, res) => {
  console.log("PUT /goals/:id", req.params.id);
  try {
    let goalId = req.params.id;
    let goal = await Goal.findById(goalId);
    console.log("existingGoal", goal);
    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }
    goal.completed = req.body.completed;
    goal.text = req.body.text;
    console.log("updatedGoal", goal);
    await goal.updateOne(goal);
    console.log("PUT /goals/:id success");
    res.status(204).json(goal);
  } catch (error) {
    console.error("PUT /goals/:id error");
    console.error(error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

app.delete("/goals/:id", async (req, res) => {
  console.log("DELETE /goals/:id", req.params.id);
  try {
    let goalId = req.params.id;
    await Goal.deleteOne({ _id: goalId });
    console.log("DELETE /goals/:id success");
  } catch (error) {
    console.error("DELETE /goals/:id error");
    console.error(error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
  res.status(204).send();
});

const db = mongoose.connect("mongodb://host.docker.internal:27017/goals");

db.then(() => {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}).catch((error) => {
  console.error("Failed to connect to database");
  console.error(error);
  process.exit(1);
});
