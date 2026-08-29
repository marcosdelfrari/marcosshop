import { InstagramIcon, WhatsAppIcon } from "@/components/social-icons";
import { siteConfig } from "@/lib/site";

export function SocialLinks({ className }: { className?: string }) {
  const items = [
    {
      href: siteConfig.social.instagram,
      label: "Instagram",
      icon: InstagramIcon,
    },
    {
      href: `https://wa.me/${siteConfig.whatsappNumber}`,
      label: "WhatsApp",
      icon: WhatsAppIcon,
    },
  ] as const;

  return (
    <ul className={`flex items-center gap-5 ${className ?? ""}`}>
      {items.map(({ href, label, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-foreground transition-opacity hover:opacity-60"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
