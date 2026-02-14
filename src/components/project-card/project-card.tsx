'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import type { Project } from '@/data/projects';
import styles from './project-card.module.css';

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const imageVariants = {
    hidden: {
      opacity: 0,
      y: 32,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      whileHover={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.2, type: 'spring' },
      }}
      className={styles.wrapper}
    >
      <Link href={`/${project.slug}`} className={styles.link}>
        <div className={styles.card}>




          <div className={styles.body}>
            <div className={styles.description}>
              <h2 className={styles.projectHeader}>{project.name}</h2>
              <p className={styles.text}>{project.description}</p>
            </div>

            <motion.div
              variants={imageVariants}
              animate={isHovered ? 'visible' : 'hidden'}
              initial="hidden"
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
