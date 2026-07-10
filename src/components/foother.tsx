import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const CATALOGUE_LINKS = [
  { name: "Barebones Kits", to: "/?category=keyboards#popular" },
  { name: "Switches", to: "/?category=switches#popular" },
  { name: "Keycaps", to: "/?category=keycaps#popular" },
  { name: "Accessories", to: "/?category=accessories#popular" },
  { name: "Desk Mats", to: "/?category=deskmat#popular" },
];

const SUPPORT_LINKS = [
  { name: "Build guides", to: "#" },
  { name: "Shipping", to: "#" },
  { name: "Returns", to: "#" },
  { name: "FAQ", to: "#" },
  { name: "Order tracking", to: "#" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background pt-16 pb-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-24">
          <nav aria-label="Catalogue links" className="order-2 space-y-6 md:order-1">
            <h2 className="inline-block border-b border-primary/20 pb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              Catalogue
            </h2>
            <ul className="m-0 list-none space-y-3 p-0">
              {CATALOGUE_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    <div
                      className="h-1 w-1 scale-0 rounded-full bg-primary transition-transform group-hover:scale-100"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="order-1 flex flex-col items-center space-y-5 text-center md:order-2">
            <div className="space-y-2">
              <Link to="/" aria-label="Keysthetix - Home">
                <span className="inline-block border-x-2 border-primary px-4 text-3xl font-semibold tracking-[0.18em] text-foreground">
                  KEYSTHETIX
                </span>
              </Link>
              <p className="pt-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Mechanical parts for daily boards
              </p>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A small, focused shop for keyboards, switches, and keycap sets.
              Clear selection, practical details, no drama.
            </p>

            <address className="flex w-full max-w-[220px] flex-col items-center gap-3 border-t border-dashed border-border pt-4 not-italic">
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
                <span>SAN FRANCISCO, CA</span>
              </div>
              <a
                href="mailto:support@keysthetix.com"
                className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80 transition-colors hover:text-foreground"
              >
                <Mail className="h-3 w-3 text-primary" aria-hidden="true" />
                <span>SUPPORT@KEYSTHETIX.COM</span>
              </a>
            </address>
          </div>

          <nav aria-label="Support links" className="order-3 space-y-6 text-left md:text-right">
            <h2 className="inline-block border-b border-primary/20 pb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 md:ml-auto">
              Support
            </h2>
            <ul className="m-0 list-none space-y-3 p-0">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="group flex items-center justify-start gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground md:justify-end"
                  >
                    <div
                      className="h-1 w-1 scale-0 rounded-full bg-primary transition-transform group-hover:scale-100"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center justify-center border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KEYSTHETIX
          </p>
        </div>
      </div>
    </footer>
  );
}
