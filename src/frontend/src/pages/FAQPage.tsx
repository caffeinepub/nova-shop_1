import { Link } from "@tanstack/react-router";
import { useState } from "react";

const faqs = [
  {
    id: "returns",
    question: "What is your return and exchange policy?",
    answer:
      "We accept returns and exchanges within 30 days of purchase. Items must be unworn, unwashed, and in their original condition with all tags attached. To start a return, contact our support team with your order number and we'll guide you through the process.",
  },
  {
    id: "shipping",
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 5\u20137 business days. Express shipping (2\u20133 business days) is available at checkout for an additional fee. Once your order is dispatched, you'll receive a tracking number via email.",
  },
  {
    id: "sizing",
    question: "Are the watch and clothing sizes true to size?",
    answer:
      "Yes, our clothing runs true to standard sizing. Each product page includes a detailed size guide. For watches, the dial diameter and strap width are listed in the product description. If you're unsure, feel free to reach out to our support team for a personalized recommendation.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards including Visa, Mastercard, American Express, Discover, and Maestro. All transactions are encrypted and processed securely.",
  },
  {
    id: "cancel",
    question: "Can I modify or cancel my order after placing it?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placement. After that window, the order enters processing and changes may not be possible. Please contact our customer support team as soon as possible if you need to make changes.",
  },
];

export function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-16 px-4 text-center">
        <h1 className="font-editorial text-4xl font-bold tracking-widest uppercase mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm opacity-60 font-body tracking-wide">
          Everything you need to know about shopping at Nova Shop.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-foreground/10 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-foreground/5 transition-colors"
              >
                <span className="font-body font-semibold text-foreground text-base pr-4">
                  {faq.question}
                </span>
                <span className="text-foreground/40 text-xl flex-shrink-0">
                  {openId === faq.id ? "\u2212" : "+"}
                </span>
              </button>
              {openId === faq.id && (
                <div className="px-6 pb-5">
                  <p className="font-body text-foreground/70 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-body text-sm text-foreground/50 mb-4">
            Didn't find your answer?
          </p>
          <Link
            to="/support"
            className="inline-block bg-foreground text-background px-8 py-3 text-sm font-body font-semibold tracking-widest uppercase hover:opacity-80 transition-opacity rounded"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
