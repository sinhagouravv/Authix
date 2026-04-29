export function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-2xl lg:mx-0 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Mission</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            At Authix, we believe that security shouldn't be a trade-off for user experience. Our goal is to provide enterprise-grade 3-factor authentication that is easy to integrate and delightful to use.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div className="glass-card p-8 bg-white/40 border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold leading-7 text-slate-900">Innovation</h3>
            <p className="mt-4 text-sm leading-6 text-slate-500">Constantly pushing the boundaries of what's possible in web security.</p>
          </div>
          <div className="glass-card p-8 bg-white/40 border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold leading-7 text-slate-900">Privacy</h3>
            <p className="mt-4 text-sm leading-6 text-slate-500">Your data is yours. We use zero-knowledge architecture where possible.</p>
          </div>
          <div className="glass-card p-8 bg-white/40 border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold leading-7 text-slate-900">Reliability</h3>
            <p className="mt-4 text-sm leading-6 text-slate-500">99.9% uptime guarantee for all our authentication services.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const tiers = [
    {
      name: 'Hobby',
      id: 'tier-hobby',
      price: '$0',
      description: 'The essentials for personal projects.',
      features: ['2FA support', 'Up to 1k users', 'Standard support'],
    },
    {
      name: 'Pro',
      id: 'tier-pro',
      price: '$29',
      description: 'Advanced features for growing teams.',
      features: ['Full 3FA support', 'Up to 50k users', 'Priority support', 'Custom branding'],
    },
    {
      name: 'Enterprise',
      id: 'tier-enterprise',
      price: 'Custom',
      description: 'Scale without limits.',
      features: ['Unlimited users', 'Dedicated account manager', 'SLA guarantees', 'On-premise option'],
    },
  ];

  return (
    <section id="pricing" className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">Choose the plan that fits your security needs.</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div key={tier.id} className="glass-card flex flex-col justify-between p-8 xl:p-10 bg-white/40 border-slate-200 shadow-sm hover:border-indigo-500/50 transition-all">
              <div>
                <h3 className="text-lg font-semibold leading-8 text-slate-900">{tier.name}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-500">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-sm font-semibold leading-6 text-slate-500">/month</span>}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <span className="text-indigo-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-8 block w-full rounded-full bg-slate-900 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-slate-800 transition-all">
                Get started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    {
      body: "Authix has completely transformed how we handle user security. The 3FA implementation was seamless.",
      author: { name: 'Sarah Chen', handle: 'CTO at TechFlow' },
    },
    {
      body: "The best authentication service I've ever used. The developer experience is top-notch.",
      author: { name: 'James Wilson', handle: 'Lead Dev at SecureScale' },
    },
    {
      body: "Finally, a 3FA system that doesn't frustrate my users. Highly recommended!",
      author: { name: 'Elena Rodriguez', handle: 'Founder of CloudGuard' },
    },
  ];

  return (
    <section id="reviews" className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Trusted by Security Professionals</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">Hear from teams who have upgraded their security with Authix.</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.author.name} className="glass-card p-8 bg-white/40 border-slate-200 shadow-sm hover:-translate-y-1 transition-all">
              <blockquote className="text-slate-600 italic">
                <p>"{review.body}"</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <div className="font-semibold text-slate-900">{review.author.name}</div>
                  <div className="text-slate-500">{review.author.handle}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Get in Touch</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">Have questions about our 3FA system? Our security experts are here to help.</p>
        </div>
        <div className="mx-auto mt-16 max-w-xl glass-card p-10 bg-white/60 border-slate-200 shadow-md">
          <form className="space-y-6">
            <div>
              <label htmlFor="full-name" className="block text-sm font-semibold leading-6 text-slate-900">Full Name</label>
              <input type="text" id="full-name" className="mt-2 block w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">Email Address</label>
              <input type="email" id="email" className="mt-2 block w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900">Message</label>
              <textarea id="message" rows={4} className="mt-2 block w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="w-full rounded-full bg-indigo-600 px-4 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
