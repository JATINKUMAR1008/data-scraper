import { getPeriods, Period } from "@/actions/analytics/getPeriods";
import { Suspense } from "react";
import PeriodSelector from "./_components/periodSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValue } from "@/actions/analytics/getStatsCardsValue";
import { StatsCard } from "./_components/StatsCard";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import { ExecutionStatusChart } from "./_components/ExecutionStatusChart";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import { CreditConsumptionChart } from "../billing/_components/CreditUsageChart";

interface HomeProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const peroids = await getPeriods();

  return <PeriodSelector periods={peroids} selectedPeriod={selectedPeriod} />;
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValue(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow Executions"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase Executions"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}

async function CreditUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditUsageInPeriod(selectedPeriod);
  return (
    <CreditConsumptionChart
      data={data}
      title="Daily credits spent"
      description="Daily credit consumed in selected period"
    />
  );
}
