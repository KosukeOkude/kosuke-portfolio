import { sanityClient } from '@/sanity/client';

const aboutPageQuery = `*[_type == "aboutPage"][0]{
    name,
    tagLine,
    intro,
    encounterTitle,
    encounterBody,
    themeTitle,
    themeBody,
    achievementsTitle,
    achievementsIntro,
    achievementsList,
    contactMessage,
    contactEmail
}`;

export interface AboutPageContent {
  name?: string;
  tagline?: string;
  intro?: string;
  encounterTitle?: string;
  encounterBody?: string;
  themeTitle?: string;
  themeBody?: string;
  achievementsTitle?: string;
  achievementsIntro?: string;
  achievementsList?: string[];
  contactMessage?: string;
  contactEmail?: string;
}

export async function getAboutPageContent(): Promise<AboutPageContent | null> {
  return sanityClient.fetch(aboutPageQuery);
}
