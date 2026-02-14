import { IntroText } from "@/components/intro-text";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/data/projects";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.content}>
      <IntroText />
      <ProjectList projects={projects} />
    </main>
  );
}
