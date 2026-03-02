import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import styles from './page.module.css';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.content}>
      <Link href="/" className={styles.backLink}>
        ← Back to home
      </Link>

      <article className={styles.project}>
        <header className={styles.header}>
          <h1 className={styles.title}>{project.name}</h1>
        </header>

        <div className={styles.imageContainer}>
          <Image
            src={project.image}
            alt={project.name}
            width={1200}
            height={750}
            quality={95}
            priority
            unoptimized
            className={styles.image}
          />
        </div>

        <div className={styles.description}>
          <p className={styles.text}>{project.description}</p>
        </div>
      </article>
    </main>
  );
}
