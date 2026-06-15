import styles from './AmbientMesh.module.css';

/** Sfondo decorativo stile linear.app — mesh + griglia + glow */
export function AmbientMesh() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.mesh} />
      <div className={styles.grid} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
    </div>
  );
}
