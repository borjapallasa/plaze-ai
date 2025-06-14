
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FooterSection = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-[16px] text-foreground">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            to={link.href}
            className="text-muted-foreground hover:text-foreground transition-colors text-[14px]"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export function Footer() {
  const location = useLocation();
  
  if (location.pathname.includes('/community') || location.pathname.includes('/classroom')) {
    return null;
  }

  const shopLinks = [
    { label: "Products", href: "/products" },
    { label: "Templates", href: "/products/templates" },
    { label: "Communities", href: "/communities" },
    { label: "Experts", href: "/experts" },
  ];

  const sellLinks = [
    { label: "Start Selling", href: "/sell" },
    { label: "Seller Dashboard", href: "/seller" },
    { label: "Seller Guidelines", href: "/seller-guidelines" },
    { label: "Commission Structure", href: "/commission" },
  ];

  const aboutLinks = [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/story" },
    { label: "Team", href: "/team" },
    { label: "Careers", href: "/careers" },
  ];

  const helpLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Contact Support", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="mt-auto bg-background border-t">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <FooterSection title="Shop" links={shopLinks} />
          <FooterSection title="Sell" links={sellLinks} />
          <FooterSection title="About" links={aboutLinks} />
          <FooterSection title="Help" links={helpLinks} />
        </div>

        {/* Social Links Section */}
        <div className="mb-8">
          <h3 className="font-semibold text-[16px] text-foreground mb-4">Follow Us</h3>
          <div className="flex items-center gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-accent rounded-md"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[14px] text-muted-foreground text-center md:text-left">
            © 2024 Plaze AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[14px]">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
