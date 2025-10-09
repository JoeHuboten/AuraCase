# API Reference

This document describes all public APIs, components, utilities, store hooks, providers, middleware, and API routes exposed in this repository. It includes usage examples and guidance.

- Tech stack: Next.js 14 App Router, TypeScript, NextAuth.js, Prisma, TailwindCSS, Zustand, GSAP, Three.js
- Import alias: `@/*` maps to `src/*` (see `tsconfig.json`)

## Components

### Navbar
- File: `src/components/Navbar.tsx`
- Default export: React component
- Description: Site-wide navigation with cart badge, auth actions, and responsive mobile menu.
- Client: Yes (`'use client'`)

Usage:
```tsx
import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <div>
      <Navbar />
      {/* ... */}
    </div>
  );
}
```

### Footer
- File: `src/components/Footer.tsx`
- Default export: React component
- Description: Footer with brand, quick links, and social icons.

Usage:
```tsx
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div>
      {/* ... */}
      <Footer />
    </div>
  );
}
```

### ProductCard
- File: `src/components/ProductCard.tsx`
- Default export: `ProductCard(props)`
- Props:
  - `product: { id: string; name: string; slug: string; price: number; salePrice?: number | null; images: string[]; stock: number }`
- Description: Displays a product with image, price, discount badge, and add-to-cart button.
- Client: Yes

Usage:
```tsx
import ProductCard from "@/components/ProductCard";

const product = {
  id: "p_1",
  name: "Case X",
  slug: "case-x",
  price: 39.9,
  salePrice: 29.9,
  images: ["/img.jpg"],
  stock: 3,
};

export default function Example() {
  return <ProductCard product={product} />;
}
```

### LiquidEther
- File: `src/components/LiquidEther.tsx`
- Default export: `LiquidEther(props: LiquidEtherProps)`
- Props (`LiquidEtherProps`):
  - `mouseForce?: number` (default 20)
  - `cursorSize?: number` (default 100)
  - `isViscous?: boolean` (default false)
  - `viscous?: number` (default 30)
  - `iterationsViscous?: number` (default 32)
  - `iterationsPoisson?: number` (default 32)
  - `dt?: number` (default 0.014)
  - `BFECC?: boolean` (default true)
  - `resolution?: number` (default 0.5)
  - `isBounce?: boolean` (default false)
  - `colors?: string[]` (default palette)
  - `style?: React.CSSProperties`
  - `className?: string`
  - `autoDemo?: boolean` (default true)
  - `autoSpeed?: number` (default 0.5)
  - `autoIntensity?: number` (default 2.2)
  - `takeoverDuration?: number` (default 0.25)
  - `autoResumeDelay?: number` (default 1000)
  - `autoRampDuration?: number` (default 0.6)
- Description: GPU fluid simulation background with auto motion and mouse/touch interaction. Transparent output for overlay use.
- Client: Yes

Usage:
```tsx
import LiquidEther from "@/components/LiquidEther";

export default function HeroBackground() {
  return (
    <div className="relative h-[400px]">
      <LiquidEther className="absolute inset-0" colors={["#5227FF", "#FF9FFC", "#B19EEF"]} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl">AuraCase</h1>
      </div>
    </div>
  );
}
```

### MagicBento
- File: `src/components/MagicBento.tsx`
- Default export: `MagicBento(props?: BentoProps)`
- Props (`BentoProps`):
  - `textAutoHide?: boolean` (default true)
  - `enableStars?: boolean` (default true)
  - `enableSpotlight?: boolean` (default true)
  - `enableBorderGlow?: boolean` (default true)
  - `disableAnimations?: boolean` (default false)
  - `spotlightRadius?: number` (default 200)
  - `particleCount?: number` (default 8)
  - `enableTilt?: boolean` (default false)
  - `glowColor?: string` (default "34, 211, 238")
  - `clickEffect?: boolean` (default true)
  - `enableMagnetism?: boolean` (default true)
- Description: Interactive animated bento grid with spotlight, particle stars, tilt, magnetism, and ripple click effects. Mobile-safe (auto disables heavy effects).
- Client: Yes

Usage:
```tsx
import MagicBento from "@/components/MagicBento";

export default function LandingSection() {
  return (
    <section className="py-16">
      <MagicBento enableTilt glowColor="34, 211, 238" />
    </section>
  );
}
```

## App layout and providers

### RootLayout
- File: `src/app/layout.tsx`
- Exports: `metadata`, default `RootLayout({ children })`
- Description: Sets `Navbar`, `Footer`, and wraps with `Providers`.

### Providers
- File: `src/app/providers.tsx`
- Export: `Providers({ children }: { children: React.ReactNode })`
- Description: Wraps the app in `SessionProvider` for NextAuth.js.

Usage:
```tsx
import { Providers } from "@/app/providers";
```

## Utilities

### cn
- File: `src/lib/utils.ts`
- Export: `cn(...inputs: ClassValue[]) => string`
- Description: Tailwind class merger (`clsx` + `tailwind-merge`).

Usage:
```tsx
import { cn } from "@/lib/utils";

<div className={cn("p-4", condition && "bg-red-500")}></div>
```

## Authentication

### authOptions
- File: `src/lib/auth.ts`
- Export: `authOptions: NextAuthOptions`
- Providers: `Credentials`
- Session: `jwt`
- Pages: custom `signIn`, `signOut`
- Callbacks: augments JWT with `id`, `role`; augments session `user` with `id`, `role`.

Usage:
```ts
import { authOptions } from "@/lib/auth";
```

### NextAuth Route
- File: `src/app/api/auth/[...nextauth]/route.ts`
- Exports: `GET`, `POST` handlers from `NextAuth(authOptions)`

Request examples:
```http
POST /api/auth/callback/credentials
Content-Type: application/x-www-form-urlencoded

csrf=true&email=user@example.com&password=secret
```

Client usage:
```tsx
import { signIn, signOut } from "next-auth/react";
await signIn("credentials", { email, password, redirect: false });
await signOut();
```

### Middleware
- File: `src/middleware.ts`
- Exports: `default` from `next-auth/middleware`; `config.matcher = ["/admin/:path*", "/checkout/:path*"]`
- Description: Protects admin and checkout routes. Users are redirected to sign-in if unauthenticated.

## Store

### useCartStore
- File: `src/store/cartStore.ts`
- Export: `useCartStore: Zustand store`
- Types:
  - `CartItem { id, name, price, salePrice?, image, quantity, slug }`
  - Store shape: `{ items, addItem(item), removeItem(id), updateQuantity(id, quantity), clearCart(), getTotalPrice(), getTotalItems() }`
- Persistence: localStorage key `cart-storage`

Usage:
```tsx
'use client'
import { useCartStore } from "@/store/cartStore";

export default function CartButton({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const total = useCartStore(s => s.getTotalItems());

  return (
    <button onClick={() => addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice ?? undefined,
      image: product.images[0] ?? "/placeholder.jpg",
      slug: product.slug,
    })}>
      Add to cart ({total})
    </button>
  );
}
```

## API Routes

### POST /api/auth/register
- File: `src/app/api/auth/register/route.ts`
- Handler: `export async function POST(request: Request)`
- Request body (JSON):
  - `name: string`
  - `email: string`
  - `password: string` (min 6 chars)
- Responses:
  - 201: `{ message: string, user: { id, name, email } }`
  - 400: `{ error: string }` for missing fields, weak password, or email exists
  - 500: `{ error: string }` on server error

Example:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}' \
  http://localhost:3000/api/auth/register
```

## Database (Prisma)

- File: `prisma/schema.prisma`
- Models: `User`, `Account`, `Session`, `VerificationToken`, `Category`, `Product`, `Order`, `OrderItem`
- Enums: `Role { USER, ADMIN }`, `OrderStatus { PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED }`

## Type Augmentations

- File: `src/types/next-auth.d.ts`
- Augments `next-auth` and `next-auth/jwt` with `id` and `role` on `Session.user` and `JWT`.

---

Notes:
- All client components include `'use client'` and must be rendered on the client.
- Import paths use `@/*` alias.
- Ensure environment vars: `DATABASE_URL`, `NEXTAUTH_SECRET`.
