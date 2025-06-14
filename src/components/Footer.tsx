
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FooterSection = ({
  title,
  links
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}) => <div className="space-y-3">
    <h3 className="font-semibold text-[16px] text-foreground">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => <li key={index}>
          <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-[14px]">
            {link.label}
          </Link>
        </li>)}
    </ul>
  </div>;

export function Footer() {
  const location = useLocation();
  
  if (location.pathname.includes('/community') || location.pathname.includes('/classroom')) {
    return null;
  }

  const shopLinks = [{
    label: "Products",
    href: "/products"
  }, {
    label: "Communities",
    href: "/communities"
  }, {
    label: "Sitemap",
    href: "/sitemap"
  }, {
    label: "Blog",
    href: "/blog"
  }];

  const sellLinks = [{
    label: "Sell on Plaze",
    href: "/sell"
  }, {
    label: "Plaze University",
    href: "/university"
  }, {
    label: "Affiliates",
    href: "/affiliates"
  }];

  const aboutLinks = [{
    label: "About Plaze",
    href: "/about"
  }, {
    label: "Careers",
    href: "/careers"
  }, {
    label: "Investors",
    href: "/investors"
  }, {
    label: "Privacy Policy",
    href: "/privacy"
  }, {
    label: "Terms of Service",
    href: "/terms"
  }];

  return <footer className="mt-auto bg-background border-t">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Content - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 min-h-[160px]">
          {/* Left side - Logo moved up */}
          <div className="flex flex-col items-center lg:items-start lg:min-w-[200px] flex-shrink-0 pt-8">
            <div className="flex flex-col items-center space-y-2">
              <img src="/lovable-uploads/80716e7b-7544-445b-b37e-00d4372310cd.png" alt="Plaze AI" className="h-12 w-12 rounded-lg" />
              <span className="text-xl font-bold text-center">Plaze AI</span>
            </div>
          </div>

          {/* Center - Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 lg:max-w-4xl">
            <FooterSection title="Shop" links={shopLinks} />
            <FooterSection title="Sell" links={sellLinks} />
            <div className="space-y-6">
              <FooterSection title="About" links={aboutLinks} />
              
              {/* Social Links without "Follow Us" text */}
              <div className="space-y-3">
                <div className="flex gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md" aria-label="Follow us on Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md" aria-label="Follow us on Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md" aria-label="Follow us on Pinterest">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.16 6.84 9.49-.09-.8-.17-2.03.04-2.91.18-.79 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1.01.51 1.83 1.5 1.83 1.8 0 3.19-1.9 3.19-4.64 0-2.43-1.75-4.13-4.25-4.13-2.89 0-4.59 2.17-4.59 4.41 0 .87.34 1.81.76 2.32.08.1.09.19.07.29-.08.31-.25 1.02-.28 1.17-.04.19-.14.23-.33.14-1.26-.59-2.05-2.43-2.05-3.91 0-3.19 2.32-6.12 6.68-6.12 3.51 0 6.24 2.5 6.24 5.85 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.54-2.32-1.18 0 0-.51 1.94-.63 2.41-.23.89-.85 2.01-1.27 2.69.96.3 1.98.46 3.04.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md" aria-label="Follow us on YouTube">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="text-center">
          <p className="text-[14px] text-muted-foreground">
            © 2024 Plaze AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}
