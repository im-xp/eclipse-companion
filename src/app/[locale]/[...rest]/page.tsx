import { notFound } from "next/navigation";

// The proxy rewrites EVERY extensionless path into the locale tree, so an
// unknown URL like /nope arrives here as /en/nope — this catch-all turns it
// into the branded [locale]/not-found instead of the default 404.
export default function CatchAll(): never {
  notFound();
}
