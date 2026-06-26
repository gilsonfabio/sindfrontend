import RelVctCnvClient from "./RelVctCnvClient";

interface PageProps {
  searchParams: Promise<{ datIni?: string; datFin?: string; cnvId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams; // ✅ precisa aguardar
  const datIni = params.datIni ?? "";
  const datFin = params.datFin ?? "";
  const cnvId  = params.cnvId ?? "";

  return <RelVctCnvClient datIni={datIni} datFin={datFin} cnvId={cnvId} />;
}
