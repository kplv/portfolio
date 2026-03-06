import styles from './intro-text.module.css';

export interface IntroTextProps {
  header: string;
  text: string;
  color?: string;
}

export function IntroText({ header, text, color }: IntroTextProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.header} style={color ? { color } : undefined}>
        {header}
      </h1>
      <p className={styles.text}>
        {text}
      </p>
    </div>
  );
}


