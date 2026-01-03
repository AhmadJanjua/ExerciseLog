
import { useState, type JSX } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getWorkout } from "@/db/Workout/helpers/workout";
import type { Exercise, Workout } from "@/db/Workout/types";
import { createExercise, getUniqueWorkoutExerciseNames, getWorkoutExercises } from "@/db/Workout/helpers/exercise";

import { ExerciseCard } from "./manage-sets";
import { WorkoutCard } from "../workout-card";
import { OptionSelector } from "../selector";

function LogWorkout(
    { workout_id, elapsed }:
        { workout_id: string, elapsed: number }
): JSX.Element {
    // Vars
    const workout: Workout | undefined = useLiveQuery(
        () => getWorkout(workout_id), [workout_id]
    );
    const exercises: Exercise[] | undefined = useLiveQuery(
        () => getWorkoutExercises(workout_id), [workout_id]
    );
    const exercise_names = useLiveQuery(
        () => getUniqueWorkoutExerciseNames(workout_id), [workout_id]
    );
    const [name, setName] = useState("");
    
    async function addExercise() {
        if (!name.trim()) return;
        await createExercise(workout_id, name.trim());
        setName("");
    }
    
    if (!workout) {
        // TODO: add a real loading screen
        return <>Loading...</>;
    }
    
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <WorkoutCard workout={workout} />
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">
                    Exercises
                </CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Exercise Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1"
                        />
                        <OptionSelector
                            name={name} setName={setName}
                            options={exercise_names}
                        />
                        <Button onClick={addExercise} disabled={!name.trim()}>
                            Add
                        </Button>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-3">
                        {(exercises ?? []).map((ex) => (
                            <ExerciseCard key={ex.id} id={ex.id} name={ex.name} elapsed={elapsed} />
                        ))}

                        {(exercises?.length ?? 0) === 0 && (
                            <div className="text-sm text-muted-foreground">
                                Add an exercise to start logging sets.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export { LogWorkout }