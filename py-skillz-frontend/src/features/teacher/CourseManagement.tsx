import React from 'react';
import { BackButton } from '../../components/shared/BackButton';
import { CourseList } from '../courses/CourseList';

export const TeacherCourseManagement = () => (
  <div className="container mx-auto p-4">
    <BackButton />
    <CourseList isAdmin={false} />
  </div>
);
