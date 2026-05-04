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
      { property: "og:title", content: "Legato — A quiet companion" },
      { property: "og:description", content: "Soft, premium support for grief and loss." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
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
