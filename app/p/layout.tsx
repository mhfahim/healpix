import { LangProvider } from "@/components/shell/patient";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
