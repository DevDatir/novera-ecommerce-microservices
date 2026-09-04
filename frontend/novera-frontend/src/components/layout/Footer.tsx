import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="mt-auto bg-ink-900 text-ink-200">
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:px-8 md:grid-cols-[1.35fr_1fr_1.2fr] md:gap-16 lg:px-10 lg:py-16">
      <div className="max-w-sm">
        <Link to="/" className="font-display text-xl text-white">
          NOVERA
        </Link>
        <p className="mt-4 text-sm leading-6 text-ink-300">
          Everyday footwear, selected for comfort, fit, and easy movement.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-bold text-white">Shop</h2>
        <ul className="mt-4 space-y-3 text-sm text-ink-300">
          <li><Link to="/products?gender=MALE" className="hover:text-primary-400">Men</Link></li>
          <li><Link to="/products?gender=FEMALE" className="hover:text-primary-400">Women</Link></li>
          <li><Link to="/products?gender=UNISEX" className="hover:text-primary-400">Unisex</Link></li>
          <li><Link to="/products?sort=unitsSold,desc" className="hover:text-primary-400">Best sellers</Link></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-bold text-white">Customer care</h2>
        <ul className="mt-4 space-y-3 text-sm text-ink-300">
          <li><Link to="/orders" className="hover:text-primary-400">Your orders</Link></li>
          <li><Link to="/addresses" className="hover:text-primary-400">Saved addresses</Link></li>
          <li><a href="tel:+919876543210" className="inline-flex items-center gap-2 hover:text-primary-400"><Phone size={16} aria-hidden="true" /> +91 98765 43210</a></li>
          <li><a href="mailto:hello@novera.com" className="inline-flex items-center gap-2 hover:text-primary-400"><Mail size={16} aria-hidden="true" /> hello@novera.com</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-ink-400 sm:px-8">
      © {new Date().getFullYear()} Novera. All rights reserved.
    </div>
  </footer>
);

export default Footer;
