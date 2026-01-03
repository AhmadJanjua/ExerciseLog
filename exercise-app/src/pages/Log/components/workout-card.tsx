import type { JSX } from "react";
import type { NavigateFunction } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Workout } from "@/db/Workout/types";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteWorkout } from "@/db/Workout/helpers/workout";

function WorkoutCard(
    { workout, navigate}:
        { workout: Workout, navigate?: NavigateFunction }
): JSX.Element {
    const pointer_status: string = (navigate === undefined) ? "" : "cursor-pointer";
    
    function buttonPress() {
        if (navigate === undefined) return;
        navigate(`/log/${workout.id}`)
    }

    return (
        <Card key={workout.id} className={pointer_status} onClick={buttonPress}>
            <div className="flex items-center gap-3 px-6">
                <CardHeader className="p-0 pb-0 flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                        {workout.name}
                    </CardTitle>
                </CardHeader>
                { (navigate !== undefined) && (
                    <Button
                        variant="destructive"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            return deleteWorkout(workout.id);
                        }}
                    >
                        <Trash />
                    </Button>
                )}
            </div>
            <CardContent className="flex flex-row items-center justify-between text-sm text-muted-foreground">
                <span>{workout.date}</span>
                <span>{workout.energy}</span>
            </CardContent>
        </Card>
    );
}

export { WorkoutCard };