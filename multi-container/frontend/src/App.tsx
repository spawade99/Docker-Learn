import axios from "axios";
import { useEffect, useState } from "react";

type Goal = {
  id: number;
  text: string;
  completed: boolean;
};

const App = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalText, setGoalText] = useState("");

  useEffect(() => {
    fetchGoals();
    () => { console.log("cleanup called") };
  }, []);

  const fetchGoals = async () => {
    const response = await axios.get("http://localhost:3000/goals");
    if (response.status !== 200) {
      console.error("Failed to load goals");
      return;
    }
    const data = response.data;
    setGoals(data.goals);
  };
  const addGoal = async () => {
    if (!goalText.trim()) return;
    const newGoal: Goal = { id: 1, text: goalText, completed: false };
    const response = await axios.post("http://localhost:3000/goals", { text: goalText });
    if (response.status !== 201) {
      console.error("Failed to save goal");
      return;
    }
    newGoal.id = response.data.id;
    setGoals([...goals, newGoal]);
    setGoalText("");
  };

  const toggleGoal = async (id: number) => {
    const completedGoal: Goal = goals.find((goal) => goal.id === id)!;
    if (!completedGoal) return;
    completedGoal.completed = !completedGoal.completed;
    const response = await axios.put(`http://localhost:3000/goals/${id}`, { completedGoal });
    if (response.status !== 204) {
      console.error("Failed to update goal");
      return;
    }
    console.log("response", response);
    console.log("goals", completedGoal);
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, completed: completedGoal.completed } : goal)));
  };

  const removeGoal = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/goals/${id}`);
    if (response.status !== 204) {
      console.error("Failed to delete goal");
    };

    setGoals(goals.filter((goal) => goal.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Goal Tracker</h1>
        <div className="flex gap-2">
          <input
            type="text"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Enter a goal..."
          />
          <button onClick={addGoal} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="mt-4">
          {goals.map((goal) => (
            <li key={goal.id} className="flex justify-between items-center p-2 bg-gray-50 mt-2 rounded">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                  className="w-5 h-5"
                />
                <span className={`cursor-pointer ${goal.completed ? "line-through text-gray-500" : ""}`}>
                  {goal.text}
                </span>
              </div>
              <button onClick={() => removeGoal(goal.id)} className="text-red-500">
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default App;
