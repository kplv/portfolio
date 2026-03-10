import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { HomeClient } from '@/components/home-client';
import { projects } from '@/data/projects';
import styles from '../page.module.css';

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

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Denis Kopylov`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <HomeClient
      projects={projects}
      className={styles.content}
      initialProjectSlug={slug}
    />
  );
}
