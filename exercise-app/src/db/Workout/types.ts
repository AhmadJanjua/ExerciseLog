// types
type Energy = "Weak" | "Tired" | "Okay" | "Good" | "Strong";
type WeightSI = "kg" | "lb";

// variables
const ENERGY_LIST: Energy[] = ["Weak", "Tired", "Okay", "Good", "Strong"] as const;
const WEIGHT_LIST: WeightSI[] = ["kg", "lb"] as const;
// interfaces
interface Workout {
    id: string;
    name: string;
    date: string;
    energy: Energy;
    created_at: string;
    updated_at: string;
}

interface Exercise {
    id: string;
    workout_id: string;
    name: string;
    order: number;
}

interface ExerciseSet {
    id: string;
    exercise_id: string;
    order: number;
    rest: number;
    reps: number;
    weight?: number;
    unit?: WeightSI;
}

export type { Energy, WeightSI, Workout, Exercise, ExerciseSet }
export { ENERGY_LIST, WEIGHT_LIST };
