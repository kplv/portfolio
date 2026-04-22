import { HomeClient } from '@/components/home-client';
import { projects } from '@/data/projects';
import styles from '../page.module.css';

export default function AboutPage() {
  return <HomeClient projects={projects} className={styles.content} />;
}
