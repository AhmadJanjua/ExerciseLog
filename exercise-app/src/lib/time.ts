// converts ms timestamp into seconds as a string
function msToSeconds(time: number): number {
    return Math.floor(time / 1000);
}

// ms -> Minute - Seconds - deciseconds
function msDecomposition(time: number): {min: number, sec: number, ds: number} {
    const min = Math.floor(time / 60_000);
    const sec = Math.floor((time / 1000) % 60);
    const ds = Math.floor((time % 1000) / 100);
    return {min, sec, ds};
}

// ms -> minute-second-deciseconds
function toStopwatchStr(time: number): string {
    const {min, sec, ds} = msDecomposition(time);
    const m_str = String(min).padStart(2, "0");
    const s_str = String(sec).padStart(2, "0");
    const ds_str = String(ds);

    return `${m_str}:${s_str}.${ds_str}`;
}

export {msToSeconds, toStopwatchStr}