import { viewState } from "@/lib/screens";
import { QueueView } from "./view";

export default function Page({ searchParams }: { searchParams: { state?: string; new?: string; arrived?: string } }) {
  return <QueueView state={viewState(searchParams)} newSerial={searchParams.new ? Number(searchParams.new) : undefined} arrived={searchParams.arrived ? Number(searchParams.arrived) : undefined} />;
}
