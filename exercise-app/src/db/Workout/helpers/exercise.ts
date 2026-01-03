import Dexie, { type Collection } from "dexie";

import { db } from "../database";

import type { Exercise, Workout } from "../types";
import { updateWorkoutTimestamp } from "./workout";

import { toTitleCase } from "@/lib/string";
import { randomUUID } from "@/lib/wrappers";

// --- Create
async function createExercise(
    workout_id: string, name: string
): Promise<Exercise> {
    // vars
    let exercise!: Exercise;
    const id: string = randomUUID();

    // format and ensure name is not empty
    name = toTitleCase(name);
    if (!name) {
        throw new Error("Invalid name passed to createExercise");
    }

    // ensure success means all transactions succeed
    await db.transaction("rw", db.workouts, db.exercises, async () => {
        // ensure workout exists
        const workout: Workout | undefined = await db.workouts.get(workout_id);
        if (workout === undefined) {
            throw new Error(`Workout ${workout_id} does not exist`);
        }

        // get the ordering
        const last: Exercise | undefined = await db.exercises
            .where("[workout_id+order]")
            .between([workout_id, Dexie.minKey], [workout_id, Dexie.maxKey])
            .last();

        const order: number = last ? last.order + 1 : 0;

        // create a new workout
        exercise = { id, workout_id, name, order };
        await db.exercises.add(exercise);

        // update timestamp
        await updateWorkoutTimestamp(workout_id);
    });

    return exercise;
}

// --- Read
async function getWorkoutExercises(
    workout_id: string, desc: boolean = true, limit?: number
): Promise<Exercise[]> {
    // restrict to a single workout and sort by order
    let query: Collection<Exercise, string, Exercise> = db.exercises
        .where("[workout_id+order]")
        .between([workout_id, Dexie.minKey], [workout_id, Dexie.maxKey]);

    // set descending or ascending
    query = desc ? query.reverse() : query;

    // entire array
    if (limit === undefined) return query.toArray();

    // portion of array
    if (limit > 0) return query.limit(limit).toArray();

    // empty
    return [];
}

async function getUniqueWorkoutExerciseNames(
    id: string
): Promise<string[]> {
    const workout: Workout | undefined = await db.workouts.get(id);
    if (workout === undefined) return [];

    // get ids of all workouts with given name
    const workout_ids: string[] = await db.workouts
        .where("name")
        .equals(workout.name)
        .primaryKeys();

    if (workout_ids.length === 0) return [];

    // get all exercises
    const exercise: Exercise[] = await db.exercises
        .where("workout_id")
        .anyOf(workout_ids)
        .toArray();

    // get distinct names and sort them
    return [...new Set(exercise.map(e => e.name))].sort();
}

// delete
async function deleteExercise(id: string)
    : Promise<void> {
    const exercise: Exercise | undefined = await db.exercises.get(id);

    if (exercise === undefined) return;

    const workout_id: string = exercise.workout_id;
    const order: number = exercise.order;

    return await db.transaction("rw", db.workouts, db.exercises, db.sets, async () => {
        // delete all sets related to exercise
        await db.sets
            .where("exercise_id")
            .equals(id)
            .delete();

        // delete exercise
        await db.exercises
            .delete(id);

        // update the exercise order
        await db.exercises
            .where("[workout_id+order]")
            .between([workout_id, order + 1], [workout_id, Dexie.maxKey])
            .modify((e) => { e.order -= 1; });

        // update timestamp
        await updateWorkoutTimestamp(workout_id);
    });
}

// update
type MutableExerciseKeys = Exclude<
    keyof Exercise, "id" | "workout_id | order"
>;

async function updateExercise<K extends MutableExerciseKeys>(
    id: string, key: K, value: Exercise[K]
): Promise<void> {
    // ensure exercise being updated exists
    const exercise: Exercise | undefined = await db.exercises.get(id);
    if (exercise === undefined) return;

    // format name passed
    if (key === "name") {
        value = toTitleCase(value as string) as Exercise[K];
        if (!value) throw new Error("Updating exercise name with invalid value")
    }

    const update_val: Partial<Exercise> = { [key]: value };

    await db.transaction("rw", db.exercises, db.workouts, async () => {
        // update the exercise
        await db.exercises.update(id, update_val);

        // update the timestamp
        await updateWorkoutTimestamp(exercise.workout_id);
    });
}

export { createExercise, deleteExercise, updateExercise, getWorkoutExercises, getUniqueWorkoutExerciseNames };
