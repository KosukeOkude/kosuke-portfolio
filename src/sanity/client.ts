import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';


const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('SANITY_PROJECT_ID と SANITY_DATASET を .env に設定してください');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: { _ref?: string; _id?:string; } | undefined) {
    if (!source?._ref && !source?._id) return null;
    return builder.image(source);
  }