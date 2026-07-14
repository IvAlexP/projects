import { Header } from "@/components";
import { StabilityStatsSection, ReviewHoursStatsSection, ActivityStatsSection } from "@/features/stats/components";

function Stats() {
    
    return (
        <div>
            <Header />
            <div className="pageContent">
                <h2>Welcome to your stats!</h2>
                <ActivityStatsSection />
                <ReviewHoursStatsSection />
                <StabilityStatsSection />
            </div>
            
        </div>
    );
}

export default Stats;
