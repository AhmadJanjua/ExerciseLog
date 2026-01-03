import Dexie, { type Collection } from "dexie";

import { db } from "../database";
import type { Exercise, ExerciseSet, WeightSI } from "../types";

import { randomUUID } from "@/lib/wrappers";
import { updateWorkoutTimestamp } from "./workout";

// --- Create
async function createSet(
    exercise_id: string, rest: number, reps: number, weight?: number, unit?: WeightSI
): Promise<ExerciseSet> {
    // vars
    let exercise_set!: ExerciseSet;
    const id: string = randomUUID();

    await db.transaction("rw", db.workouts, db.exercises, db.sets, async () => {
        // ensure exercise exists
        const exercise: Exercise | undefined = await db.exercises.get(exercise_id);
        if (exercise === undefined) {
            throw new Error(`Exercise ${exercise_id} not found`);
        }

        // get the order
        const last: ExerciseSet | undefined = await db.sets
            .where("[exercise_id+order]")
            .between([exercise_id, Dexie.minKey], [exercise_id, Dexie.maxKey])
            .last();
        const order: number = last ? last.order + 1 : 0;

        // create a set
        exercise_set = { id, exercise_id, order, rest, reps, weight, unit };
        await db.sets.add(exercise_set);

        await updateWorkoutTimestamp(exercise.workout_id);
    });

    return exercise_set;
}

// --- Read
async function getExerciseSets(
    exercise_id: string, desc: boolean = true, limit?: number
): Promise<ExerciseSet[]> {
    // get sets
    let query: Collection<ExerciseSet, string, ExerciseSet> = db.sets
        .where("[exercise_id+order]")
        .between([exercise_id, Dexie.minKey], [exercise_id, Dexie.maxKey]);

    // sort order
    query = desc ? query.reverse() : query;

    // return all
    if (limit === undefined) return query.toArray();
    // return truncated
    if (limit > 0) return query.limit(limit).toArray();
    // return empty
    return [];
}

// --- Update
type MutableSetKeys = Exclude<keyof ExerciseSet, "id" | "exercise_id" | "order">;

async function updateSet<K extends MutableSetKeys>(
    id: string, key: K, value: ExerciseSet[K]
): Promise<void> {
    // ensure set exists
    const e_set: ExerciseSet | undefined = await db.sets.get(id);
    if (e_set === undefined) return;

    // update key-value pair
    const update_val: Partial<ExerciseSet> = { [key]: value };

    await db.transaction("rw", db.workouts, db.exercises, db.sets, async () => {
        // ensure exercise exists
        const exercise: Exercise | undefined = await db.exercises.get(e_set.exercise_id);

        // if it doesnt remove
        if (exercise === undefined) {
            await db.sets.delete(id);
            return;
        }

        // otherwise update
        await db.sets.update(id, update_val);
        await updateWorkoutTimestamp(exercise.workout_id);
    });
}

// --- Delete
async function deleteSet(id: string)
    : Promise<void> {
    // ensure set exists
    const e_set: ExerciseSet | undefined = await db.sets.get(id);
    if (e_set === undefined) return;

    await db.transaction("rw", db.workouts, db.exercises, db.sets, async () => {
        // delete set
        await db.sets.delete(id);

        // ensure that the exercise exists
        const exercise: Exercise | undefined = await db.exercises.get(e_set.exercise_id);
        if (exercise !== undefined) {
            // update order
            await db.sets
                .where("[exercise_id+order]")
                .between([e_set.exercise_id, e_set.order + 1], [e_set.exercise_id, Dexie.maxKey])
                .modify((e) => { e.order -= 1; });

            // update the timestamp
            await updateWorkoutTimestamp(exercise.workout_id);

            // otherwise remove all sets for non-existant set
        } else {
            await db.sets
                .where("exercise_id")
                .equals(e_set.exercise_id)
                .delete();
        }
    });
}

export { createSet, getExerciseSets, updateSet, deleteSet }
