
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FooterSection = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-base">{title}</h3>
    <ul className="space-y-1.5">
      {links.map((link, index) => (
        <li key={index}>
          <Link 
            to={link.href}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
    <footer className="mt-auto bg-background pt-20">
      <div className="border-t">
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-background border-none p-0">
              <TabsTrigger value="products" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Products
              </TabsTrigger>
              <TabsTrigger value="jobs" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Jobs
              </TabsTrigger>
              <TabsTrigger value="experts" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Experts
              </TabsTrigger>
              <TabsTrigger value="communities" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Communities
              </TabsTrigger>
              <TabsTrigger value="education" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Education
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Enterprise
              </TabsTrigger>
              <TabsTrigger value="support" className="text-base px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Support
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
