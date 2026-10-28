import { z } from "npm:zod@4.6.7";
export const stages = [
  "Grade 12",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Professional course",
  "Looking for a job",
  "Working, considering a change",
];
export const services = [
  "",
  "discovery",
  "planning",
  "employability",
  "profile-evaluation",
  "online-tests",
  "psychometric",
  "counselling",
  "university",
  "workshops",
  "overseas",
];
export const interests = [
  "Knowing my strengths",
  "Choosing a career",
  "Course or specialisation",
  "Choosing a college",
  "Scholarships and loans",
  "Interview preparation",
  "Resume and LinkedIn",
  "Finding a job",
];
const text = (max: number) => z.string().trim().max(max);
export const enquirySchema = z
  .object({
    id: z.uuid(),
    student: text(120).min(2),
    parent: text(120).default(""),
    phone: text(25)
      .regex(/^[+\d\s()-]{10,25}$/)
      .refine(
        (value) =>
          value.replace(/\D/g, "").length >= 10 &&
          value.replace(/\D/g, "").length <= 15,
      ),
    email: z
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    city: text(120).default(""),
    stage: z.enum(stages),
    service: z.enum(services).default(""),
    help: z.array(z.enum(interests)).max(8).default([]),
    message: text(4000).default(""),
    website: text(200).default(""),
  })
  .strict();
