export default function Footer() {
  return (
    <footer className="border-t border-borderGray bg-surface text-textMuted py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} VulnScan. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm mt-3">
          <a href="/docs" className="hover:text-primary">Docs</a>
          <a href="/contact" className="hover:text-primary">Contact</a>
          <a href="/privacy" className="hover:text-primary">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
