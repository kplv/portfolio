import styles from './media-label.module.css';

export interface MediaLabelProps {
    label?: string;
    color: string;
}

export function MediaLabel({ label, color }: MediaLabelProps) {
    return (
        <div className={styles.container}>
            <div className={styles.controlContainer}>
                <div className={styles.buttonContainer}></div>
                <div className={styles.counterContainer}></div>

            </div>
            <p className={styles.label}>{label}</p>
        </div>
    );
}

