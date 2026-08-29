import type { SimpleIcon } from "simple-icons";
import { siInstagram, siWhatsapp } from "simple-icons";

type SocialIconProps = {
  icon: SimpleIcon;
  size?: number;
  className?: string;
};

function SocialIcon({ icon, size = 20, className }: SocialIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}

export function InstagramIcon(props: Omit<SocialIconProps, "icon">) {
  return <SocialIcon icon={siInstagram} {...props} />;
}

export function WhatsAppIcon(props: Omit<SocialIconProps, "icon">) {
  return <SocialIcon icon={siWhatsapp} {...props} />;
}
