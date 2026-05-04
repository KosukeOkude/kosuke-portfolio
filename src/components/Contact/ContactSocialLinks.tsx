import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";

interface ContactSocialLinksProps {
  email?: string;
  className?: string;
}

export function ContactSocialLinks({
  email,
  className = "text-black",
}: ContactSocialLinksProps) {
  return (
    <div className={`mt-6 inline-flex flex-col gap-3 text-sm ${className}`}>
      <a
        href={`mailto:${email}`}
        className="inline-flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <FaEnvelope size={18} />
        <span>okina794@gmail.com</span>
      </a>
      <a
        href="https://www.instagram.com/okonono95/?hl=ja"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <FaInstagram size={18} />
        <span>Instagram: okonono95</span>
      </a>
      <a
        href="https://x.com/photo_okina"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <FaXTwitter size={18} />
        <span>X / Twitter: photo_okina</span>
      </a>
    </div>
  );
}
