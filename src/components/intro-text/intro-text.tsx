import styles from './intro-text.module.css';

export interface IntroTextProps {
  text?: string;
}

export function IntroText({
  text = "Product designer and engineer based in Berlin. Currently at Ostrom."
}: IntroTextProps) {
  return (
    <h1 className={styles.text}>
      {text}
    </h1>
  );
}
