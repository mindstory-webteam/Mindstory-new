import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getRelated, getService, serviceAliases, services } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

/** Pre-build one page per service (plus the alias URLs, which redirect). */
export function generateStaticParams() {
  return [...services.map((s) => s.slug), ...Object.keys(serviceAliases)].map((slug) => ({ slug }));
}

/** Any slug not in lib/services.ts → 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seo.title,
    description: service.seo.description,
    openGraph: { title: service.seo.title, description: service.seo.description },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  // old / alternative names → the real page (e.g. /services/branding → /services/identity-design)
  if (serviceAliases[slug]) permanentRedirect(`/services/${serviceAliases[slug]}`);
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ServiceDetail service={service} related={getRelated(service)} />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}