import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { toStopwatchStr } from "@/lib/time";

function Stopwatch(
    {elapsed, setElapsed}:
    {
        elapsed: number,
        setElapsed: (value: number | ((prev: number) => number)) => void
    }) {
    const [running, setRunning] = useState<boolean>(false);
    const prev_time = useRef<number | null>(null);

    useEffect(() => {
        if (!running) return;

        let id = 0;

        function tick() {
            if (prev_time.current == null) return;

            const now = performance.now();
            const dt = now - prev_time.current;

            prev_time.current = now;
            setElapsed((prev) => prev + dt);

            id = requestAnimationFrame(tick);
        }

        id = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(id);
    }, [running]);

    function toggle() {
        if (!running) {
            prev_time.current = performance.now();
        } else {
            prev_time.current = null;
        }
        setRunning((prev) => !prev);
        return;
    }

    return (
        <div className="flex flex-col items-center py-5 gap-4">
            {/* Time */}
            <div className="text-center">
                <span className="text-5xl font-mono tracking-widest">
                    {toStopwatchStr(elapsed)}
                </span>
            </div>

            {/* Controls */}
            <div className="flex flex-row items-center gap-12">
                <Button
                    onClick={toggle}
                    size="lg"
                    className="h-8 w-15 rounded-full text-lg"
                    variant={running ? "default" : "outline"}
                >
                    {running ? "Stop" : "Start"}
                </Button>

                <Button
                    variant="destructive" onClick={() => setElapsed(0)}
                    className="h-8 w-15 rounded-full text-lg"
                >
                    Reset
                </Button>
            </div>
        </div>

    );
}

export default Stopwatch;