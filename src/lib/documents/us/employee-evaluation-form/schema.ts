// src/lib/documents/us/employee-evaluation-form/schema.ts
import { z } from 'zod';

export const EmployeeEvaluationFormSchema = z.object({
  // Company and Employee Information
  companyName: z.string().min(1, 'Company name is required'),
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  
  // Evaluation Details
  evaluationPeriod: z.string().min(1, 'Evaluation period is required'),
  evaluationDate: z.string().min(1, 'Evaluation date is required'),
  evaluatorName: z.string().min(1, 'Evaluator name is required'),
  evaluatorTitle: z.string().optional(),
  
  // Review Type
  reviewType: z.enum(['annual', 'semi-annual', 'quarterly', 'probationary', 'special']),
  
  // Rating Scale
  ratingScale: z.enum(['1-5', '1-10', 'letter-grade', 'descriptive']),
  
  // Performance Categories
  jobKnowledge: z.boolean().default(true),
  workQuality: z.boolean().default(true),
  productivity: z.boolean().default(true),
  reliability: z.boolean().default(true),
  communication: z.boolean().default(true),
  teamwork: z.boolean().default(true),
  leadership: z.boolean().default(false),
  problemSolving: z.boolean().default(true),
  initiative: z.boolean().default(true),
  customerService: z.boolean().default(false),
  
  // Custom Categories
  customCategories: z.array(z.object({
    category: z.string(),
    description: z.string().optional(),
  })).default([]),
  
  // Goal Setting
  includeGoalSetting: z.boolean().default(true),
  goalReview: z.boolean().default(true),
  newGoals: z.boolean().default(true),
  
  // Development Planning
  includeDevelopmentPlan: z.boolean().default(true),
  trainingNeeds: z.boolean().default(true),
  careerDiscussion: z.boolean().default(true),
  
  // Overall Assessment
  overallRating: z.boolean().default(true),
  strengths: z.boolean().default(true),
  areasForImprovement: z.boolean().default(true),
  accomplishments: z.boolean().default(true),
  
  // Action Items
  actionItems: z.boolean().default(true),
  followUpDate: z.boolean().default(true),
  improvementPlan: z.boolean().default(false),
  
  // Employee Input
  employeeComments: z.boolean().default(true),
  employeeSelfAssessment: z.boolean().default(false),
  employeeGoals: z.boolean().default(true),
  
  // Signatures
  requireEmployeeSignature: z.boolean().default(true),
  requireEvaluatorSignature: z.boolean().default(true),
  requireHRSignature: z.boolean().default(false),
  
  // Additional Sections
  attendanceReview: z.boolean().default(false),
  disciplinaryActions: z.boolean().default(false),
  promotionRecommendation: z.boolean().default(false),
  salaryRecommendation: z.boolean().default(false),
});