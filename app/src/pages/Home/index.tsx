import { Link } from "react-router-dom";
import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex flex-col p-6 gap-5">
            <Title>Exercise Log</Title>

            <p className="text-muted-foreground">
                A platform agnostic, offline exercise tracking application
                for data driven insights for your fitness journey.
            </p>

            <p className="text-muted-foreground">
                <b>Warning:</b> Browsers may delete caches, therefore it is
                important to backup data.
            </p>

            <div className="flex gap-5">
                <Button><Link to="/log">
                    Start Workout
                </Link></Button>
                <Button variant="outline"><Link to="/stats">
                    View History
                </Link></Button>
            </div>
        </div>
    );
}

