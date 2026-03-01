import { IntroText } from "@/components/intro-text";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/data/projects";
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.content}>
      <IntroText />
      <SocialLinkList>

        <SocialLink href="" text="LinkedIn" />
        <SocialLink href="" text="E-Mail" />
      </SocialLinkList>
      <ProjectList projects={projects} />
    </main>
  );
}
