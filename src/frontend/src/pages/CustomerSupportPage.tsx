export function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-16 px-4 text-center">
        <h1 className="font-editorial text-4xl font-bold tracking-widest uppercase mb-3">
          Customer Support
        </h1>
        <p className="text-sm opacity-60 font-body tracking-wide">
          We're here to help — always.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        {/* About Nova Shop */}
        <div className="mb-12 text-center">
          <h2 className="font-editorial text-2xl font-bold tracking-wide uppercase mb-5">
            About Nova Shop
          </h2>
          <p className="font-body text-foreground/70 text-base leading-relaxed max-w-2xl mx-auto">
            Nova Shop is a premium online destination for curated fashion,
            accessories, and timepieces. Founded with a commitment to quality
            and timeless style, we source the finest watches, clothing, and
            footwear to bring you pieces that last beyond trends. Our mission is
            simple: offer exceptional products with an equally exceptional
            shopping experience — from the first click to the moment it arrives
            at your door.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-foreground/10 mb-12" />

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Phone */}
          <div className="border border-foreground/10 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <title>Phone</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </div>
            <h3 className="font-body font-bold text-foreground uppercase tracking-widest text-xs mb-2">
              Phone
            </h3>
            <p className="font-editorial text-xl font-semibold text-foreground mb-1">
              +1 (847) 392-5501
            </p>
            <p className="font-body text-xs text-foreground/50">
              Mon – Fri, 9 AM – 6 PM (EST)
            </p>
          </div>

          {/* Email */}
          <div className="border border-foreground/10 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <title>Email</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h3 className="font-body font-bold text-foreground uppercase tracking-widest text-xs mb-2">
              Email
            </h3>
            <p className="font-editorial text-xl font-semibold text-foreground mb-1">
              support@novashop.store
            </p>
            <p className="font-body text-xs text-foreground/50">
              We respond within 24 hours
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-foreground/4 rounded-xl p-8 text-center">
          <h3 className="font-body font-bold uppercase tracking-widest text-xs text-foreground/50 mb-3">
            Our Commitment
          </h3>
          <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-xl mx-auto">
            At Nova Shop, every customer matters. Whether you have a question
            about sizing, need help tracking an order, or want advice on a gift
            — our team is always ready to assist. Your satisfaction is our top
            priority.
          </p>
        </div>
      </div>
    </div>
  );
}
