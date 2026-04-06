import { Link } from "react-router-dom"
import { MapPin, Mail } from "lucide-react"

const CATALOGUE_LINKS = [
  { name: "Barebones Kits", to: "/?category=keyboards#popular" },
  { name: "Switches", to: "/?category=switches#popular" },
  { name: "Keycaps", to: "/?category=keycaps#popular" },
  { name: "Accessories", to: "/?category=accessories#popular" },
  { name: "Desk Mats", to: "/?category=deskmat#popular" },
]

const SUPPORT_LINKS = [
  { name: "Build Guides", to: "#" },
  { name: "Shipping Config", to: "#" },
  { name: "Returns & Refunds", to: "#" },
  { name: "FAQ", to: "#" },
  { name: "Order Tracking", to: "#" },
]

export function Footer() {
  return (
    <footer className="bg-background border-t-2 border-foreground/10 pt-16 pb-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-12">

          {/* Catalogue */}
          <nav aria-label="Catalogue links" className="space-y-6 order-2 md:order-1">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 border-b border-primary/20 pb-2 inline-block">
              Catalogue
            </h2>
            <ul className="space-y-3 list-none p-0 m-0">
              {CATALOGUE_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-primary scale-0 group-hover:scale-100 transition-transform rounded-full" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Brand center */}
          <div className="flex flex-col items-center text-center space-y-6 order-1 md:order-2">
            <div className="space-y-2">
              <Link to="/" aria-label="Keysthetix — Home">
                <span className="text-3xl font-bold italic border-x-4 border-primary px-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">
                  KEYSTHETIX
                </span>
              </Link>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest pt-2">
                Mechanical Excellence
              </p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Crafting the ultimate typing experience. Premium enthusiast tools for those who demand excellence.
            </p>

            <address className="flex flex-col items-center gap-3 pt-4 border-t border-dashed border-border w-full max-w-[200px] not-italic">
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                <MapPin className="w-3 h-3 text-primary" aria-hidden="true" />
                <span>SILICON VALLEY, CA</span>
              </div>
              <a
                href="mailto:support@keysthetix.com"
                className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80 hover:text-foreground transition-colors"
              >
                <Mail className="w-3 h-3 text-primary" aria-hidden="true" />
                <span>SUPPORT@KEYSTHETIX.COM</span>
              </a>
            </address>
          </div>

          {/* Support */}
          <nav aria-label="Support links" className="space-y-6 order-3 text-left md:text-right">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 border-b border-primary/20 pb-2 inline-block md:ml-auto">
              Support
            </h2>
            <ul className="space-y-3 list-none p-0 m-0">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:-translate-x-1 transition-all duration-200 flex items-center justify-start md:justify-end gap-2 group"
                  >
                    {item.name}
                    <div className="w-1 h-1 bg-primary scale-0 group-hover:scale-100 transition-transform rounded-full" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-border pt-8 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KEYSTHETIX // ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}