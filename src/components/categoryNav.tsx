import {
  Cable,
  Cpu,
  Hammer,
  Keyboard,
  Layers,
  Palette,
  SwitchCamera,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Barebones", icon: Keyboard },
  { name: "Keycaps", icon: Palette },
  { name: "Switches", icon: SwitchCamera },
  { name: "PCBs", icon: Cpu },
  { name: "Plates", icon: Layers },
  { name: "Cables", icon: Cable },
  { name: "Mods", icon: Hammer },
  { name: "Tools", icon: Wrench },
];

export function CategoryNav() {
  return (
    <section
      className="relative overflow-hidden bg-background py-12"
      aria-label="Shop by category"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div className="w-full text-center sm:w-auto sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Browse by category
            </h2>

            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Jump straight to the parts that matter.
            </p>
          </div>

          <div className="ml-8 hidden h-px flex-1 bg-border md:block" />
        </div>

        <nav aria-label="Product categories">
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-5 transition-[border-color,background-color] duration-200 hover:border-primary/20 hover:bg-muted/40"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background transition-colors duration-200 group-hover:bg-muted">
                    <category.icon
                      className="h-5 w-5 text-foreground/75 transition-colors duration-200 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}