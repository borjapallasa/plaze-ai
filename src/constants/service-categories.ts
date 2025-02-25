
export const CATEGORIES = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "business", label: "Business" },
] as const;

export const SUBCATEGORIES = {
  development: [
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile Development" },
    { value: "desktop", label: "Desktop Development" },
    { value: "database", label: "Database" },
    { value: "devops", label: "DevOps" },
  ],
  design: [
    { value: "ui", label: "UI Design" },
    { value: "ux", label: "UX Design" },
    { value: "graphic", label: "Graphic Design" },
    { value: "brand", label: "Brand Design" },
  ],
  marketing: [
    { value: "social", label: "Social Media" },
    { value: "content", label: "Content Marketing" },
    { value: "seo", label: "SEO" },
    { value: "email", label: "Email Marketing" },
  ],
  business: [
    { value: "strategy", label: "Business Strategy" },
    { value: "consulting", label: "Consulting" },
    { value: "analytics", label: "Analytics" },
    { value: "planning", label: "Planning" },
  ],
} as const;

export const SERVICE_TYPES = [
  { value: "one time", label: "One Time" },
  { value: "monthly", label: "Monthly" }
] as const;

export type CategoryType = typeof CATEGORIES[number]['value'];
export type ServiceType = typeof SERVICE_TYPES[number]['value'];
