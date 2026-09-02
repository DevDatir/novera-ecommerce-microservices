import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-6 py-12 sm:px-8 md:grid-cols-[1.35fr_1fr_1.2fr] md:gap-16 lg:px-10 lg:py-14">
      <div className="max-w-sm">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-950">
          NOVERA
        </Link>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Everyday footwear, selected for comfort, fit, and easy movement.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-950">Shop</h2>
        <ul className="mt-4 space-y-3 text-sm font-semibold">
          <li><Link to="/products?gender=MALE" className="hover:text-primary-700">Men</Link></li>
          <li><Link to="/products?gender=FEMALE" className="hover:text-primary-700">Women</Link></li>
          <li><Link to="/products?gender=UNISEX" className="hover:text-primary-700">Unisex</Link></li>
          <li><Link to="/products?sort=unitsSold,desc" className="hover:text-primary-700">Best sellers</Link></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-950">Customer care</h2>
        <ul className="mt-4 space-y-3 text-sm font-semibold">
          <li><Link to="/orders" className="hover:text-primary-700">Your orders</Link></li>
          <li><Link to="/addresses" className="hover:text-primary-700">Saved addresses</Link></li>
          <li><a href="tel:+919876543210" className="inline-flex items-center gap-2 hover:text-primary-700"><Phone size={16} aria-hidden="true" /> +91 98765 43210</a></li>
          <li><a href="mailto:hello@novera.com" className="inline-flex items-center gap-2 hover:text-primary-700"><Mail size={16} aria-hidden="true" /> hello@novera.com</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-200 px-6 py-5 text-center text-xs font-medium text-slate-600 sm:px-8">
      © {new Date().getFullYear()} Novera. All rights reserved.
    </div>
  </footer>
);

export default Footer;
