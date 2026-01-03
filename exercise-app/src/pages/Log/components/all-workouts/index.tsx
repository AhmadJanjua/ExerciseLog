import { useState, type JSX } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import { type Workout } from "@/db/Workout/types";
import { getWorkoutList } from "@/db/Workout/helpers/workout";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

import { WorkoutDialogContent } from "./dialog";
import { WorkoutCard } from "../workout-card";

function AllWorkout(): JSX.Element {
    const navigate: NavigateFunction = useNavigate();
    const workouts: Workout[] | undefined = useLiveQuery(getWorkoutList, []);
    const [dialog_open, setDialog] = useState(false);

    // TODO:
    if (workouts === undefined) return <>Loading...</>

    return (
        <div className="flex w-full flex-col gap-10">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-2xl font-semibold">Workouts</h1>

                { /* Dialog Box */}
                <Dialog open={dialog_open} onOpenChange={setDialog}>
                    <DialogTrigger asChild><Button>
                        New workout
                    </Button></DialogTrigger>

                    <WorkoutDialogContent
                        setDialog={setDialog} navigate={navigate}
                    />
                </Dialog>
            </div>

            {/* List of workouts */}
            <div className="grid gap-2">
                {workouts?.map((w) => (
                    <WorkoutCard workout={w} navigate={navigate} />
                ))}

                {/* No workout message */}
                {(workouts?.length ?? 0) === 0 && (
                    <Card><CardContent className="p-6 text-sm text-muted-foreground">
                            No workouts yet. Create your first workout.
                    </CardContent></Card>
                )}
            </div>
        </div>
    );
}

export { AllWorkout };