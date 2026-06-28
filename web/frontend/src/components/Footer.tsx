import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 border-t border-slate-200 text-slate-500 text-sm bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Authix | All rights reserved.</p>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <Link href="/terms" className="hover:text-slate-900 transition-colors font-medium">Terms and Condition</Link>
          <Link href="/privacy" className="hover:text-slate-900 transition-colors font-medium">Privacy Policy</Link>
          <Link href="/security" className="hover:text-slate-900 transition-colors font-medium">Security</Link>
          <Link href="/support" className="hover:text-slate-900 transition-colors font-medium">Support</Link>
        </div>
      </div>
    </footer>
  );
}
