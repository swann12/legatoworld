import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LegatoProvider } from "@/lib/legato-state";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl font-light text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-xl italic text-foreground">A quiet, empty room</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page hasn't been planted yet.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Legato — A quiet companion through grief" },
      {
        name: "description",
        content:
          "Legato is a refined, emotionally intelligent companion for grief, loss, and the fear of losing someone — with a living garden at its center.",
      },
      { name: "author", content: "Legato" },
      { property: "og:title", content: "Legato — A quiet companion through grief" },
      { property: "og:description", content: "Legato is a refined emotional companion to navigate grief, support, practical steps and remembrance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Legato — A quiet companion through grief" },
      { name: "description", content: "Legato is a refined emotional companion to navigate grief, support, practical steps and remembrance." },
      { name: "twitter:description", content: "Legato is a refined emotional companion to navigate grief, support, practical steps and remembrance." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7139190c-31c4-4d64-9e2c-f7ec7f4c6929/id-preview-d9c3a536--d91fa4d1-1c0a-4d13-9192-56ad528792b2.lovable.app-1777895039371.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7139190c-31c4-4d64-9e2c-f7ec7f4c6929/id-preview-d9c3a536--d91fa4d1-1c0a-4d13-9192-56ad528792b2.lovable.app-1777895039371.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LegatoProvider>
      <Outlet />
    </LegatoProvider>
  );
}
