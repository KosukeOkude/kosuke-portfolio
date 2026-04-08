import aboutBackgroundImage from "@/assets/images/about-background-image.jpg";
import aboutReveal1 from "@/assets/images/about-reveal-image-1.jpg";
import aboutReveal2 from "@/assets/images/about-reveal-image-2.jpg";
import aboutReveal3 from "@/assets/images/about-reveal-image-3.png";
import aboutReveal4 from "@/assets/images/about-reveal-image-4.jpg";
import aboutReveal5 from "@/assets/images/about-reveal-image-5.jpg";
import aboutReveal6 from "@/assets/images/about-reveal-image-6.png";

export const aboutPageConfig = {
  backgroundImage: aboutBackgroundImage,
  backgroundAlt: "雲のストラクチャ",
};

interface Frame {
  src: ImageMetadata;
  alt: string;
}

export const aboutFilmStripFrames: Frame[] = [
  { src: aboutReveal1, alt: "About ギャラリー画像 1" },
  { src: aboutReveal2, alt: "About ギャラリー画像 2" },
  { src: aboutReveal3, alt: "About ギャラリー画像 3" },
  { src: aboutReveal4, alt: "About ギャラリー画像 4" },
  { src: aboutReveal5, alt: "About ギャラリー画像 5" },
  { src: aboutReveal6, alt: "About ギャラリー画像 6" },
];
