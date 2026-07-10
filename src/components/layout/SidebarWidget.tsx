export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-sm`}
    >
      <h3 className="mb-2 font-semibold text-foreground">
        #1 Tailwind CSS Dashboard
      </h3>
      <p className="mb-4 text-muted-foreground text-theme-sm">
        Leading Tailwind CSS Admin Template with 400+ UI Component and Pages.
      </p>
      <a
        href="#!"
        rel="nofollow"
        className="flex items-center justify-center rounded-lg bg-primary px-3 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Upgrade To Pro
      </a>
    </div>
  );
}
