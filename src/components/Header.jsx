export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-borderGray shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
       <a href="/" className="flex items-center gap-2">
  <img
    src="/logo1.png"
    alt="VulnScan Logo"
    className="h-12 w-12 object-contain drop-shadow-sm"
  />
  <span className="text-xl font-extrabold text-primary tracking-tight hover:text-secondary transition">
    VulnScan
  </span>
</a>



        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-textSecondary">
          <a href="/" className="hover:text-primary transition">Home</a>
          <a href="/features" className="hover:text-primary transition">Features</a>
          <a href="/docs" className="hover:text-primary transition">Docs</a>
          <a href="/pricing" className="hover:text-primary transition">Pricing</a>
          <a href="/contact" className="hover:text-primary transition">Contact</a>
          <a href="/about" className="hover:text-primary transition">About</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
           <a href="/signin" className="px-4 py-2 bg-primary rounded text-white font-semibold shadow hover:bg-secondary transition">
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
}
