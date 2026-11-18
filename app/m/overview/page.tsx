import { viewState } from "@/lib/screens";
import { OverviewView } from "./view";

export default function Page({ searchParams }: { searchParams: { state?: string } }) {
  return <OverviewView state={viewState(searchParams)} />;
}
