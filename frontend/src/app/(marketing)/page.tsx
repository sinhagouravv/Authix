import Link from 'next/link';
import { AboutSection, PricingSection, ReviewsSection, ContactSection } from '@/components/Sections';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Security Redefined with 3-Factor Auth
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Beyond passwords. Beyond 2FA. Experience the future of security with Authix. Password, Email OTP, and Authenticator App — all in one seamless flow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
                Start Securely
              </Link>
              <Link href="#about" className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-20 flow-root sm:mt-24">
            <div className="glass-card p-2 p-10 lg:p-20 bg-white/40 border-slate-200 shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">🔐</div>
                  <h3 className="text-xl font-semibold text-slate-900">Factor 1</h3>
                  <p className="text-slate-500 text-sm">Something you know. Advanced password hashing with Argon2id.</p>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">📧</div>
                  <h3 className="text-xl font-semibold text-slate-900">Factor 2</h3>
                  <p className="text-slate-500 text-sm">Something you have. Secure email OTP verification.</p>
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">📱</div>
                  <h3 className="text-xl font-semibold text-slate-900">Factor 3</h3>
                  <p className="text-gray-400 text-sm">Something you possess. TOTP via Google Authenticator or Authy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <AboutSection />
      <PricingSection />
      <ReviewsSection />
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
