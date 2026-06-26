import RelEmiCnvClient from "./RelEmiCnvClient";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <RelEmiCnvClient
      datIni={params.datIni ?? ""}
      datFin={params.datFin ?? ""}
      cnvId={params.id ?? ""}
    />
  );
}
