import { db } from "../database";
import type { Energy, Workout } from "../types";

import { dtIsoStr } from "@/lib/date";
import { toTitleCase } from "@/lib/string";
import { randomUUID } from "@/lib/wrappers";
import type { Collection } from "dexie";

// --- Create
async function createWorkout(
    name: string, date: string, energy: Energy
): Promise<Workout> {
    const now: string = dtIsoStr();
    const id: string = randomUUID();

    // format name
    name = toTitleCase(name);

    if (!name) throw new Error(`Error invalid name passed to create workout`);
    // TODO: error check date

    // create new workout
    const workout: Workout = {
        id, name, date, energy,
        created_at: now,
        updated_at: now,
    };

    // wait -> throw errors if fails and does not return workout
    await db.workouts.add(workout)
    return workout;
}

// --- Read
async function getWorkout(id: string)
    : Promise<Workout | undefined> {
    return db.workouts.get(id);
}

async function getWorkoutList(
    desc: boolean = true, limit?: number
): Promise<Workout[]> {
    let query: Collection<Workout, string, Workout> = db.workouts.orderBy("date");

    // descending or ascending order
    query = desc ? query.reverse() : query;

    // return entire list
    if (limit === undefined) return query.toArray();

    // return limitted list
    if (limit > 0) return query.limit(limit).toArray();

    // returns empty list
    return [];
}

async function getUniqueWorkoutNames(): Promise<string[]> {
    const names = new Set<string>();

    await db.workouts.each((w) => {
        if (typeof w.name === "string") {
            names.add(w.name);
        }
    });

    return Array.from(names).sort();
}

// --- Update
type MutableWorkoutKeys = Exclude<
    keyof Workout, "id" | "created_at" | "updated_at"
>;

async function updateWorkout<K extends MutableWorkoutKeys>(
    id: string, key: K, value: Workout[K]
): Promise<number> {
    // format name values
    if (key === "name") {
        value = toTitleCase(value) as Workout[K];
        if (!value) throw new Error("Updating workout name with invalid value")
    }

    // update value and timestamp
    const update_val: Partial<Workout> = {
        [key]: value, updated_at: dtIsoStr()
    }

    // returns the number of fields updated (should be 0|1)
    return db.workouts.update(id, update_val);
}

async function updateWorkoutTimestamp(id: string): Promise<number> {
    return db.workouts.update(id, { updated_at: dtIsoStr() });
}

// --- Delete
async function deleteWorkout(id: string) {
    return await db.transaction("rw", db.workouts, db.exercises, db.sets, async () => {
        const exercise_ids: string[] = await db.exercises
            .where("workout_id")
            .equals(id)
            .primaryKeys();

        if (exercise_ids.length > 0) {
            await db.sets
                .where("exercise_id")
                .anyOf(exercise_ids)
                .delete();

            await db.exercises
                .where("workout_id")
                .equals(id)
                .delete();
        }
        await db.workouts.delete(id);
    });
}

export { createWorkout, deleteWorkout, updateWorkout, updateWorkoutTimestamp, getWorkout, getWorkoutList, getUniqueWorkoutNames };