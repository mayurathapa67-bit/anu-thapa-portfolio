export interface NavLink {
  label: string;
  href: string;
}

export interface Nav {
  logo: string;
  links: NavLink[];
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface Hero {
  title: string;
  role: string;
  subtitle: string;
  headline: string;
  cta_primary: HeroCta;
  cta_secondary: HeroCta;
  image: string;
}

export interface Expertise {
  title: string;
  description: string;
  icon: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Tool {
  name: string;
  category: string;
  proficiency: number;
}

export interface About {
  headline: string;
  bio: string;
  philosophy: string;
  expertise: Expertise[];
  experience: Experience[];
  certifications: Certification[];
  tools: Tool[];
  image: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  price: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  content: string;
  client: string;
  published_date: string;
  read_time: string;
  featured_image: string;
  download_link: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published_date: string;
  read_time: string;
  category: string;
  featured_image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface Social {
  platform: string;
  url: string;
}

export interface Contact {
  email: string;
  phone: string;
  location: string;
  socials: Social[];
}

export interface SiteContent {
  nav: Nav;
  hero: Hero;
  about: About;
  services: Service[];
  portfolio: PortfolioItem[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  contact: Contact;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
