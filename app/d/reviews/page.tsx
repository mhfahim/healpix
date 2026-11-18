import { viewState } from "@/lib/screens";
import { InboxView } from "./view";

export default function Page({ searchParams }: { searchParams: { state?: string } }) {
  return <InboxView state={viewState(searchParams)} />;
}
