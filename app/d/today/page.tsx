import { viewState } from "@/lib/screens";
import { TodayView } from "./view";

export default function Page({ searchParams }: { searchParams: { state?: string } }) {
  return <TodayView state={viewState(searchParams)} />;
}
