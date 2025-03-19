import { getPeriods, Period } from "@/actions/analytics/getPeriods";
import { Suspense } from "react";
import PeriodSelector from "./_components/periodSelector";
import { Skeleton } from "@/components/ui/skeleton";

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
