import { Headphones, RefreshCcw, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-slate-50">
      <div className="container-page grid gap-6 border-b border-line py-8 sm:grid-cols-2 lg:grid-cols-4">
        <Benefit icon={<Truck className="h-5 w-5 text-brand" />} title="Free Shipping" text="On orders over 500 EGP" />
        <Benefit icon={<RefreshCcw className="h-5 w-5 text-brand" />} title="Easy Returns" text="14-day return policy" />
        <Benefit icon={<ShieldCheck className="h-5 w-5 text-brand" />} title="Secure Payment" text="100% secure checkout" />
        <Benefit icon={<Headphones className="h-5 w-5 text-brand" />} title="24/7 Support" text="Contact us anytime" />
      </div>
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="h-6 w-6 text-brand" /> FreshCart
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">
            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the
            best brands at competitive prices with a seamless shopping experience.
          </p>
          <p className="mt-4 text-sm text-muted">+1 (800) 123-4567</p>
          <p className="text-sm text-muted">support@freshcart.com</p>
        </div>
        <FooterCol
          title="Shop"
          links={[
            ['All Products', '/products'],
            ['Categories', '/categories'],
            ['Brands', '/brands'],
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            ['My Account', '/account'],
            ['Order History', '/allorders'],
            ['Wishlist', '/wishlist'],
            ['Shopping Cart', '/cart'],
            ['Sign In', '/login'],
            ['Create Account', '/register'],
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            ['Contact Us', '/support'],
            ['Help Center', '/support'],
            ['Shipping Info', '/support'],
            ['Returns & Refunds', '/support'],
            ['Track Order', '/allorders'],
          ]}
        />
      </div>
      <div className="border-t border-line py-4 text-center text-sm text-muted">
        © {new Date().getFullYear()} FreshCart. All rights reserved.
      </div>
    </footer>
  )
}

function Benefit({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted">{text}</p>
      </div>
    </div>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm text-muted">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="hover:text-brand">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
