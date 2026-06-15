import { DecorativeGraphics } from './DecorativeGraphics';
import styles from './AmbientMesh.module.css';

/** Sfondo caldo stile replit.com — mesh + griglia + doodle */
export function AmbientMesh() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.mesh} />
      <div className={styles.grid} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <DecorativeGraphics />
    </div>
  );
}
