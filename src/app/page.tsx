import { IntroText } from "@/components/intro-text";
import { InfoTable } from "@/components/info-table";
import { ProjectList } from "@/components/project-list";
import { projects } from "@/data/projects";
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { Button } from '@/components/button';
import { ReloadIcon } from '@/components/icons/reload-icon';
import { InfoIcon } from '@/components/icons/info-icon';
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.content}>
      <IntroText
        header="Ostrom"
        text="Energy start-up from Berlin with expat friendly mobile application and the first virtual power plant in Germany. Series B with € 30 millions market evaluation."
        color="var(--mint-500)"
      />
      <InfoTable
        role="Design Lead"
        year="2025–26"
        contribution="Strategy & Processes, Product Design, Frontend"
        color="var(--mint-600)"
      />
      <IntroText
        header="Denis Kopylov"
        text="I'm a product designer by day and an engineer by night. I bring ideas to life in code, sweat over details, and strive for a joyful user experience. I'm also a proficient mentor and a design leader. Now leading design at Ostrom."
      />
      <SocialLinkList>

        <SocialLink href="" text="LinkedIn" />
        <SocialLink href="https://www.are.na/your-username" text="Are.na" />
        <SocialLink href="" text="E-Mail" />
      </SocialLinkList>

      <ProjectList projects={projects} />
    </main>
  );
}
