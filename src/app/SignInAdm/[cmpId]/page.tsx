import SignInAdmClient from "./SignInAdmClient";

interface PageProps {
  params: Promise<{ cmpId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { cmpId } = await params; 

  return <SignInAdmClient cmpId={cmpId} />;
}