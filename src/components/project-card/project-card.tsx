'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { Project } from '@/data/projects';
import styles from './project-card.module.css';

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // to do: change to false after card's ready
  const [isHovered, setIsHovered] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const imageVariants = {
    hidden: {
      transform: 'translateY(12px) scale(0.95)',
      opacity: 0,
    },
    visible: {
      transform: 'translateY(0) scale(1)',
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number], // ease-out-quint
      },
    },
  };

  return (
    <motion.div
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      whileTap={{
        scale: 0.97,
        transition: { duration: 0.1, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
      }}
      className={styles.wrapper}
    >
      <Link href={`/${project.slug}`} className={styles.link}>
        <div className={styles.card}>




          <div className={styles.body}>
            <motion.div
              variants={imageVariants}
              animate={isHovered ? 'visible' : 'hidden'}
              initial={shouldReduceMotion ? false : 'hidden'}
              className={styles.imageWrapper}
            >
              <Image
                src={project.image}
                alt={project.name}
                width={364}
                height={228}
                quality={90}
                unoptimized
                className={styles.image}
              />
            </motion.div>

            <p className={styles.projectTitle}>
              <span className={styles.projectName}>{project.name}</span>
              {'. '}
              <span className={styles.projectDescription}>{project.description}</span>
            </p>



          </div>
        </div>
      </Link>
    </motion.div>
  );
}
