import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { Timer, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { msToSeconds } from "@/lib/time";

import { deleteExercise } from "@/db/Workout/helpers/exercise";
import { type WeightSI, WEIGHT_LIST } from "@/db/Workout/types";
import { createSet, deleteSet, getExerciseSets } from "@/db/Workout/helpers/sets";


function ExerciseCard({ id, name, elapsed }: { id: string; name: string; elapsed: number }) {
    const sets = useLiveQuery(() => getExerciseSets(id, false), [id]);

    // Set form state
    const [reps, setReps] = useState(6);
    const [rest, setRest] = useState(Math.floor(elapsed / 1000));
    const [weight, setWeight] = useState<number | undefined>(undefined);
    const [unit, setUnit] = useState<WeightSI>("lb");

    async function onAddSet() {
        if (!Number.isFinite(reps) || reps <= 0) return;
        if (!Number.isFinite(rest) || rest < 0) return;

        await createSet(id, rest, reps, weight, unit);
    }

    return (
        <Card>
            {/* Title + delete button */}
            <div className="flex items-center gap-3 px-6">
                <CardHeader className="p-0 pb-0 flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                        {name}
                    </CardTitle>
                </CardHeader>

                <Button
                    variant="destructive"
                    onClick={() => deleteExercise(id)}
                >
                    <Trash />
                </Button>
            </div>

            {/* Input set information for the exercise */}
            <CardContent className="flex flex-col">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {/* reps */}
                    <div className="grid gap-4">
                        <Label>Reps</Label>
                        <Input
                            inputMode="numeric"
                            value={String(reps)}
                            onChange={(e) => setReps(parseInt(e.target.value || "0", 10))}
                        />
                    </div>

                    {/* rests */}
                    <div className="grid gap-4">
                        <Label>Rest (sec)</Label>
                        <div className="flex flex-row gap-2">
                            <Input
                                inputMode="numeric"
                                value={String(rest)}
                                onChange={(e) => setRest((parseInt(e.target.value || "0", 10)))}
                            />
                            <Button
                                variant="outline"
                                onClick={() => setRest(msToSeconds(elapsed))}
                            >
                                <Timer />
                            </Button>
                        </div>
                    </div>
                    
                    {/* weight */}
                    <div className="grid gap-4">
                        <Label>Weight</Label>
                        <div className="flex flex-row gap-2">
                        <Input
                            inputMode="decimal"
                            placeholder="optional"
                            value={weight === undefined ? "" : String(weight)}
                            onChange={(e) => {
                                const v = e.target.value.trim();
                                setWeight(v === "" ? undefined : Number(v));
                            }}
                        />
                        <Select value={unit} onValueChange={(v) => setUnit(v as WeightSI)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WEIGHT_LIST.map((u) => (
                                    <SelectItem key={u} value={u}>
                                        {u}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="grid justify-items-center py-5">
                    <Button onClick={onAddSet} className="w-1/3">
                        Add
                    </Button>
                </div>

                <Separator />

                {/* exercise sets */}
                <div className="flex flex-col gap-2">
                    {(sets ?? []).map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded-md p-2 text-sm">
                            <div className="flex flex-wrap gap-3">
                                <span className="text-muted-foreground">#{s.order + 1}</span>
                                <span>{s.reps} reps</span>
                                <span>{s.rest}s rest</span>
                                {s.weight !== undefined && (
                                    <span>
                                        {s.weight} {s.unit ?? ""}
                                    </span>
                                )}
                            </div>

                            <Button variant="outline" className="h-8 px-2" onClick={() => deleteSet(s.id)}>
                                Delete
                            </Button>
                        </div>
                    ))}

                    {(sets?.length ?? 0) === 0 && (
                        <div className="text-sm text-muted-foreground">No sets logged yet.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export { ExerciseCard };