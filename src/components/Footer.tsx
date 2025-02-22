
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FooterSection = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div className="space-y-2">
    <h3 className="font-medium text-[14px]">{title}</h3>
    <ul className="space-y-4">
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
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-background border-none p-0">
              <TabsTrigger value="products" className="text-[14px] px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Products
              </TabsTrigger>
              <TabsTrigger value="jobs" className="text-[14px] px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Jobs
              </TabsTrigger>
              <TabsTrigger value="experts" className="text-[14px] px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Experts
              </TabsTrigger>
              <TabsTrigger value="communities" className="text-[14px] px-6 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none">
                Communities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-8 grid grid-cols-3 gap-x-16 gap-y-6">
              <Link to="/products/templates" className="text-[14px] text-muted-foreground hover:text-foreground">Website Templates</Link>
              <Link to="/products/ecommerce" className="text-[14px] text-muted-foreground hover:text-foreground">E-commerce Solutions</Link>
              <Link to="/products/mobile" className="text-[14px] text-muted-foreground hover:text-foreground">Mobile Apps</Link>
              <Link to="/products/landing" className="text-[14px] text-muted-foreground hover:text-foreground">Landing Pages</Link>
              <Link to="/products/cms" className="text-[14px] text-muted-foreground hover:text-foreground">Content Management</Link>
              <Link to="/products/analytics" className="text-[14px] text-muted-foreground hover:text-foreground">Analytics Tools</Link>
              <Link to="/products/marketing" className="text-[14px] text-muted-foreground hover:text-foreground">Marketing Solutions</Link>
              <Link to="/products/automation" className="text-[14px] text-muted-foreground hover:text-foreground">Automation Tools</Link>
              <Link to="/products/integrations" className="text-[14px] text-muted-foreground hover:text-foreground">Integrations</Link>
            </TabsContent>

            <TabsContent value="jobs" className="mt-8 grid grid-cols-3 gap-x-16 gap-y-6">
              <Link to="/jobs/development" className="text-[14px] text-muted-foreground hover:text-foreground">Web Development</Link>
              <Link to="/jobs/design" className="text-[14px] text-muted-foreground hover:text-foreground">UI/UX Design</Link>
              <Link to="/jobs/marketing" className="text-[14px] text-muted-foreground hover:text-foreground">Digital Marketing</Link>
              <Link to="/jobs/content" className="text-[14px] text-muted-foreground hover:text-foreground">Content Creation</Link>
              <Link to="/jobs/seo" className="text-[14px] text-muted-foreground hover:text-foreground">SEO Management</Link>
              <Link to="/jobs/social" className="text-[14px] text-muted-foreground hover:text-foreground">Social Media</Link>
              <Link to="/jobs/analytics" className="text-[14px] text-muted-foreground hover:text-foreground">Data Analytics</Link>
              <Link to="/jobs/project" className="text-[14px] text-muted-foreground hover:text-foreground">Project Management</Link>
              <Link to="/jobs/consulting" className="text-[14px] text-muted-foreground hover:text-foreground">Consulting</Link>
            </TabsContent>

            <TabsContent value="experts" className="mt-8 grid grid-cols-3 gap-x-16 gap-y-6">
              <Link to="/experts/developers" className="text-[14px] text-muted-foreground hover:text-foreground">Developer Experts</Link>
              <Link to="/experts/designers" className="text-[14px] text-muted-foreground hover:text-foreground">Design Experts</Link>
              <Link to="/experts/marketers" className="text-[14px] text-muted-foreground hover:text-foreground">Marketing Experts</Link>
              <Link to="/experts/content" className="text-[14px] text-muted-foreground hover:text-foreground">Content Strategists</Link>
              <Link to="/experts/seo" className="text-[14px] text-muted-foreground hover:text-foreground">SEO Specialists</Link>
              <Link to="/experts/analytics" className="text-[14px] text-muted-foreground hover:text-foreground">Analytics Experts</Link>
              <Link to="/experts/security" className="text-[14px] text-muted-foreground hover:text-foreground">Security Specialists</Link>
              <Link to="/experts/automation" className="text-[14px] text-muted-foreground hover:text-foreground">Automation Experts</Link>
              <Link to="/experts/consulting" className="text-[14px] text-muted-foreground hover:text-foreground">Business Consultants</Link>
            </TabsContent>

            <TabsContent value="communities" className="mt-8 grid grid-cols-3 gap-x-16 gap-y-6">
              <Link to="/communities/developers" className="text-[14px] text-muted-foreground hover:text-foreground">Developer Community</Link>
              <Link to="/communities/designers" className="text-[14px] text-muted-foreground hover:text-foreground">Design Community</Link>
              <Link to="/communities/marketing" className="text-[14px] text-muted-foreground hover:text-foreground">Marketing Network</Link>
              <Link to="/communities/creators" className="text-[14px] text-muted-foreground hover:text-foreground">Content Creators</Link>
              <Link to="/communities/entrepreneurs" className="text-[14px] text-muted-foreground hover:text-foreground">Entrepreneurs</Link>
              <Link to="/communities/freelancers" className="text-[14px] text-muted-foreground hover:text-foreground">Freelancers</Link>
              <Link to="/communities/startups" className="text-[14px] text-muted-foreground hover:text-foreground">Startups</Link>
              <Link to="/communities/agencies" className="text-[14px] text-muted-foreground hover:text-foreground">Agencies</Link>
              <Link to="/communities/educators" className="text-[14px] text-muted-foreground hover:text-foreground">Educators</Link>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="border-t">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FooterSection title="Quick Links" links={quickLinks} />
            <FooterSection title="Resources" links={resources} />
            <FooterSection title="Platform" links={platform} />
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[14px] text-muted-foreground">
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
