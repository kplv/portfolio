import { IntroText } from "@/components/intro-text";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/data/projects";
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { Button } from '@/components/button';
import { ReloadIcon } from '@/components/icons/reload-icon';
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.content}>
      <IntroText />
      <SocialLinkList>

        <SocialLink href="" text="LinkedIn" />
        <SocialLink href="" text="E-Mail" />
      </SocialLinkList>
      <Button label="Shuffle" icon={<ReloadIcon size={28} />} />
      <ProjectList projects={projects} />
    </main>
  );
}
