import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Santa Picker Wheel',
  description: 'Spin the wheel to find this year\'s Santa!',
}

export default function Home() {
  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Christmas Party Santa Picker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Spin the wheel to find out who will be Santa this year! The chosen one gets free drinks at the bar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border">
              <div className="text-6xl mb-4">🎄</div>
              <h2 className="text-2xl font-bold mb-2">How It Works</h2>
              <ol className="text-left space-y-2 text-muted-foreground">
                <li>1. Add all party guests in the admin panel</li>
                <li>2. Toggle who is eligible to be Santa</li>
                <li>3. Spin the wheel to select this year's Santa</li>
                <li>4. The chosen one gets free drinks at the bar!</li>
              </ol>
              <div className="mt-6">
                <a 
                  href="/admin" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                  Go to Admin Panel
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border">
              <div className="text-6xl mb-4">🎡</div>
              <h2 className="text-2xl font-bold mb-2">Ready to Spin?</h2>
              <p className="text-center text-muted-foreground mb-6">
                Click below to go to the wheel and find this year's Santa!
              </p>
              <div className="mt-2">
                <a 
                  href="/wheel" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                  Spin the Wheel
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Hosted by you and your girlfriend for an unforgettable Christmas party!</p>
          </div>
        </div>
      </section>
    </div>
  )
}
