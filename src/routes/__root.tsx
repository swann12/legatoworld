import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LegatoProvider } from "@/lib/legato-state";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="font-serif text-[30px] font-light text-dusk">Une pièce calme, vide.</h1>
        <p className="mt-4 text-[14px] text-dusk/65">
          Cette page n'a pas encore été plantée.
        </p>
        <div className="mt-8">
          <Link to="/home" className="btn-primary inline-block">
            Revenir à l'accueil
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
      { property: "og:description", content: "Inner Bloom is a premium mobile app offering a refined emotional companion for navigating grief and loss." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Legato — A quiet companion through grief" },
      { name: "description", content: "Inner Bloom is a premium mobile app offering a refined emotional companion for navigating grief and loss." },
      { name: "twitter:description", content: "Inner Bloom is a premium mobile app offering a refined emotional companion for navigating grief and loss." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7139190c-31c4-4d64-9e2c-f7ec7f4c6929/id-preview-d9c3a536--d91fa4d1-1c0a-4d13-9192-56ad528792b2.lovable.app-1777895039371.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7139190c-31c4-4d64-9e2c-f7ec7f4c6929/id-preview-d9c3a536--d91fa4d1-1c0a-4d13-9192-56ad528792b2.lovable.app-1777895039371.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap",
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
