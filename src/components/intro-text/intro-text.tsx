import styles from './intro-text.module.css';

export interface IntroTextProps {
  text?: string;
}

export function IntroText({
  text = "Product Designer and Engineer based in Berlin. Currently at Ostrom."
}: IntroTextProps) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>
        Denis Kopylov
      </p>
      <h1 className={styles.text}>
        {text}
      </h1>
    </div>
  );
}
