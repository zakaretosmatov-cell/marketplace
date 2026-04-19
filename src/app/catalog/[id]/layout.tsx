import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const snap = await getDoc(doc(db, 'products', params.id));
    if (!snap.exists()) return { title: 'Product Not Found' };
    const p = snap.data();
    return {
      title: p.name,
      description: p.description?.slice(0, 160),
      openGraph: {
        title: `${p.name} | TechNova`,
        description: p.description?.slice(0, 160),
        images: p.image ? [{ url: p.image, width: 800, height: 800, alt: p.name }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: p.name,
        description: p.description?.slice(0, 160),
        images: p.image ? [p.image] : [],
      },
    };
  } catch {
    return { title: 'TechNova' };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
