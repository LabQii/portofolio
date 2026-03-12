import { Github, Linkedin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-light-blue" id="contact">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Left Column: Socials */}
          <div>
            <h2 className="text-[2rem] font-bold text-navy mb-4 leading-tight">
              Connect with me:
            </h2>
            <p className="text-slate-600 text-lg mb-8">
              Satisfied with me? Please contact me
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white p-2.5 rounded hover:bg-black/80 transition-colors"
                >
                  <link.icon className="h-6 w-6 stroke-[1.5]" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <h3 className="text-[1.25rem] font-medium text-slate-800 mb-6">
              Contact me, let's make magic together
            </h3>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name" className="sr-only">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Name" 
                  className="bg-white border-slate-300 focus-visible:ring-navy/20 text-base h-12"
                />
              </div>
              <div>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="Email" 
                  className="bg-white border-slate-300 focus-visible:ring-navy/20 text-base h-12"
                />
              </div>
              <div>
                <Label htmlFor="message" className="sr-only">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Message" 
                  className="bg-white border-slate-300 focus-visible:ring-navy/20 resize-none min-h-[120px] text-base"
                />
              </div>
              <Button type="submit" className="bg-navy hover:bg-navy/90 text-white min-w-[120px] rounded h-11 text-base font-semibold">
                Send
              </Button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
