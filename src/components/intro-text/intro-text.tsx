import styles from './intro-text.module.css';

export interface IntroTextProps {
  text?: string;
}

export function IntroText({
  text = "I'm a Product Designer and Engineer based in Berlin. Currently at Ostrom."
}: IntroTextProps) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>
        Denis Kopylov · Berlin, Germany
      </p>
      <h1 className={styles.text}>
        I'm a product designer by day and an engineer by night. I bring ideas to life in code, sweat over details, and strive for a joyful user experience. I'm also a proficient mentor and a design leader. Now leading design at Ostrom.
      </h1>
      <h1 className={styles.text}>
        Outside work I dance contemporary, brew ungodly amounts of V60, and survive Berlin's winter.
      </h1>
    </div>
  );
}


