export function SupportPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Support 24/7</h1>
      <p className="mt-3 text-muted">
        FreshCart support is available around the clock. Reach us at support@freshcart.com or +1 (800) 123-4567.
      </p>
      <div className="mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Shipping info</h2>
          <p className="mt-2 text-muted">Free shipping on orders over 500 EGP. Same-day delivery is available in selected cities.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Returns & refunds</h2>
          <p className="mt-2 text-muted">Return unused items within 14 days. Refunds follow the original payment method after inspection.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Track order</h2>
          <p className="mt-2 text-muted">Open Order History after signing in to see payment and delivery status from the orders API.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Privacy, terms & cookies</h2>
          <p className="mt-2 text-muted">
            This demo store uses the Route e-commerce API. Account data is stored on that backend. Tokens are kept in
            your browser local storage only.
          </p>
        </section>
      </div>
    </div>
  )
}
