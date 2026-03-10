'use client';

import { motion } from 'motion/react';
import { Avatar } from '@/components/project/avatar';
import type { TeamMember } from '@/data/projects';
import styles from './team-list.module.css';

export interface TeamListProps {
  members: TeamMember[];
  color: string;
}

export function TeamList({ members, color }: TeamListProps) {
  return (
    <motion.div layout className={styles.list}>
      {members.map((member, index) => (
        <Avatar
          key={member.name}
          name={member.name}
          avatar={member.avatar}
          href={member.href}
          color={color}
          zIndex={members.length - index}
        />
      ))}
    </motion.div>
  );
}
