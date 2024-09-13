export interface Skill {
  name: string;
  description: string;
  color: string;
}

export interface CardData {
  name: string;
  location: string;
  tags: string[];
  recentFocus: string;
  highlights: string[];
  skills: Skill[];
  hobbies: string[];
  motto: string;
  headerGradient: string;
  icons: {
    recentFocus: string;
    highlights: string;
    skills: string;
    hobbies: string;
  };
  avatarUrl: string | null;
  qrCodeUrl: string | null;
}