import { Keyboard, Cpu, Layers, SwitchCamera, Palette, Hammer, Cable, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

const categories = [
  { name: "Barebones", icon: Keyboard },
  { name: "Keycaps", icon: Palette },
  { name: "Switches", icon: SwitchCamera },
  { name: "PCBs", icon: Cpu },
  { name: "Plates", icon: Layers },
  { name: "Cables", icon: Cable },
  { name: "Mods", icon: Hammer },
  { name: "Tools", icon: Wrench },
]

export function CategoryNav() {
  return (
    <section
      className="py-16 border-b border-border bg-background/50 backdrop-blur-sm relative overflow-hidden"
      aria-label="Shop by category"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-1">
              Explore our curated selection of keyboard components
            </p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent ml-8 hidden md:block" />
        </div>

        {/* ✅ nav > ul > li — struktur semantik yang benar untuk accessibility & SEO */}
        <nav aria-label="Product categories">
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 list-none p-0 m-0">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  to={`/?category=${category.name.toLowerCase()}`}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-3xl border border-border bg-card hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 ease-out">
                    <category.icon
                      className="w-8 h-8 text-primary transition-transform duration-500 group-hover:rotate-12"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-t-full group-hover:w-1/2 transition-all duration-500" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}