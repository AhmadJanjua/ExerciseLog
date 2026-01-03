import { useState, type Dispatch, type JSX, type SetStateAction } from "react";
import { type NavigateFunction } from "react-router-dom";

import { useLiveQuery } from "dexie-react-hooks";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { dtIsoStr, isoToDateStr } from "@/lib/date";

import { ENERGY_LIST, type Energy } from "@/db/Workout/types";
import { createWorkout, getUniqueWorkoutNames } from "@/db/Workout/helpers/workout";
import { OptionSelector } from "../selector";

function WorkoutDialogContent(
    {setDialog, navigate}:
    {setDialog: Dispatch<SetStateAction<boolean>>, navigate: NavigateFunction }
): JSX.Element {
    const prev_names: string[] | undefined = useLiveQuery(
        getUniqueWorkoutNames, []
    );

    const [name, setName] = useState<string>("");
    const [date, setDate] = useState<string>(isoToDateStr(dtIsoStr()));
    const [energy, setenergy] = useState<Energy>("Strong");
    
    async function submit(): Promise<void> {
        if (!name.trim()) return;

        // create workout
        const workout = await createWorkout(name.trim(), date, energy);

        // reset state - leave date
        setDialog(false);
        setenergy("Strong");

        // move to workout log page
        navigate(`/log/${workout.id}`);
    }

    return (
        <>
            <DialogContent className="sm:max-w-md flex flex-col gap-5">
                {/* Title */}
                <DialogHeader><DialogTitle>
                    Create workout
                </DialogTitle></DialogHeader>

                {/* Name */}
                <Label htmlFor="name">Name</Label>
                <div className="flex flex-row gap-2">
                    <Input
                        id="name"
                        placeholder="Name of workout"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1"
                    />
                    <OptionSelector
                        name={name} setName={setName}
                        options={prev_names} 
                    />
                </div>

                {/* date selection */}
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                {/* energy selection */}
                <Label>Energy</Label>
                <Select value={energy} onValueChange={(v) => setenergy(v as Energy)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select energy level" />
                    </SelectTrigger>
                    <SelectContent>
                        {ENERGY_LIST.map((e) => (
                            <SelectItem key={e} value={e}>
                                {e}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Create button */}
                <DialogFooter className="mt-2">
                    <Button onClick={submit} disabled={!name.trim()}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </>
    );
}

export { WorkoutDialogContent };