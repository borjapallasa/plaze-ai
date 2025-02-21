
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, ShoppingBag, Briefcase, Users, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FooterSection = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            to={link.href}
            className="text-muted-foreground hover:text-foreground transition-colors"
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
  
  // Don't show footer on community or classroom pages
  if (location.pathname.includes('/community') || location.pathname.includes('/classroom')) {
    return null;
  }

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ];

  const resources = [
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQ", href: "/faq" },
  ];

  const platform = [
    { label: "Become a Seller", href: "/sell" },
    { label: "Affiliate Program", href: "/affiliates" },
    { label: "Partnership", href: "/partnership" },
    { label: "Community Guidelines", href: "/guidelines" },
  ];

  return (
    <footer className="mt-auto bg-background">
      <div className="border-t">
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full justify-start h-14 bg-background">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="experts" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Experts
              </TabsTrigger>
              <TabsTrigger value="communities" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Communities
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FooterSection title="Quick Links" links={quickLinks} />
            <FooterSection title="Resources" links={resources} />
            <FooterSection title="Platform" links={platform} />
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 NoCodeClick. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
