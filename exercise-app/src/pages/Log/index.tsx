import { useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import Stopwatch from "./components/stopwatch";
import { AllWorkout } from "./components/all-workouts";
import { LogWorkout } from "./components/log-workout";

export default function LogPage(): JSX.Element {
    // vars
    const { id } = useParams<{ id: string }>();
    const [elapsed, setElapsed] = useState<number>(0);

    // load workout list
    if (id === undefined) {
        return <div className="p-6"><AllWorkout /></div>;
    }

    // load workout logger + stopwatch
    return (
        <>
            <div className="sticky top-0 z-49 border-b bg-background">
                <Stopwatch elapsed={elapsed} setElapsed={setElapsed} />
            </div>
            <div className="p-6">
                <LogWorkout workout_id={id} elapsed={elapsed} />
            </div>
        </>
    );
}

