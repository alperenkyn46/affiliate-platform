import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { id } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  redirect(`${API_URL}/go/${id}`);
}
