import { NotFound } from '../presentation/components/organisms/NotFound';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-3">
              MILLION
            </h1>
            <p className="text-xl text-secondary">
              Luxury Real Estate
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <NotFound 
          title="Page Not Found"
          message="The page you're looking for doesn't exist or has been moved. Let's help you find what you're looking for."
        />
      </main>

      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-secondary">
              © 2024 MILLION. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
