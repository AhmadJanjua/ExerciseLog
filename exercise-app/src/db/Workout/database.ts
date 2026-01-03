import Dexie, { type Table } from "dexie";
import type { Workout, Exercise, ExerciseSet } from "@/db/Workout/types"

// Dexie workout database
class WorkoutDB extends Dexie {
    workouts!: Table<Workout, string>;
    exercises!: Table<Exercise, string>;
    sets!: Table<ExerciseSet, string>;

    constructor() {
        super("workout_log_2");

        this.version(1).stores({
            workouts: "id, date, name",
            exercises: "id, workout_id, [workout_id+order], name",
            sets: "id, exercise_id, [exercise_id+order]",
        });
    }
}

// export a single instance of the database
const db = new WorkoutDB();

export { db };