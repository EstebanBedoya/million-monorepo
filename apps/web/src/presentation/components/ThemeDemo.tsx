'use client';

import { useTheme } from '../hooks/useTheme';

export const ThemeDemo = () => {
  const { 
    theme, 
    themeInfo, 
    toggleTheme, 
    setTheme, 
    isDark, 
    isLight, 
    isMcDonalds,
    getAllThemes,
    getNextTheme 
  } = useTheme();

  const isCyberpunk = theme === 'cyberpunk';

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header with theme toggle */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            Theme Demo
          </h1>
          <div className="flex gap-2">
            {getAllThemes().map((themeConfig) => {
              const isActive = theme === themeConfig.name;
              return (
                <button
                  key={themeConfig.name}
                  onClick={() => setTheme(themeConfig.name)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent text-white shadow-lg' 
                      : 'bg-card border border-border text-foreground hover:bg-accent hover:text-white'
                  }`}
                >
                  {themeConfig.displayName}
                </button>
              );
            })}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-accent hover:text-white transition-all duration-200"
              title={`Next: ${getAllThemes().find(t => t.name === getNextTheme(theme))?.displayName}`}
            >
              🔄 Next
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Card Example
            </h2>
            <p className="text-foreground mb-4">
              This is an example card that adapts to the current theme.
            </p>
            <button className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Action Button
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Color Palette
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-background border border-border rounded"></div>
                <span className="text-foreground">Background</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-foreground rounded"></div>
                <span className="text-foreground">Text</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent rounded"></div>
                <span className="text-foreground">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-border rounded"></div>
                <span className="text-foreground">Border</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Current Theme
            </h2>
            <div className="space-y-2">
              <p className="text-foreground">
                <strong>Theme:</strong> {themeInfo.displayName}
              </p>
              <p className="text-foreground">
                <strong>Next Theme:</strong> {getAllThemes().find(t => t.name === getNextTheme(theme))?.displayName}
              </p>
              <p className="text-foreground">
                <strong>Classes:</strong> {themeInfo.classes.join(', ')}
              </p>
              <p className="text-foreground">
                <strong>Is Default:</strong> {themeInfo.isDefault ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* McDonald's special section */}
        {isMcDonalds && (
          <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
              🍟 Welcome to McDonald's Theme! 🍔
            </h2>
            <div className="text-center space-y-4">
              <p className="text-foreground text-lg">
                "I'm lovin' it!" - This theme is pure gold! 🏆
              </p>
              <div className="flex justify-center gap-4 text-2xl">
                <span>🍟</span>
                <span>🍔</span>
                <span>🥤</span>
                <span>🍦</span>
                <span>🍟</span>
              </div>
              <p className="text-foreground">
                Perfect for when you need that fast-food aesthetic in your app! 😄
              </p>
            </div>
          </div>
        )}

        {/* Cyberpunk special section */}
        {isCyberpunk && (
          <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
              🤖 Welcome to the Cyberpunk Theme! ⚡
            </h2>
            <div className="text-center space-y-4">
              <p className="text-foreground text-lg">
                "Wake up, samurai. We have a website to build." 🗡️
              </p>
              <div className="flex justify-center gap-4 text-2xl">
                <span>🤖</span>
                <span>⚡</span>
                <span>💻</span>
                <span>🔮</span>
                <span>🌃</span>
              </div>
              <p className="text-foreground">
                Perfect for futuristic apps and cyberpunk aesthetics! The future is now! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Form example */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Form Example
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-foreground mb-2">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="bg-accent text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              {isMcDonalds ? '🍟 Order Now!' : isCyberpunk ? '🤖 Hack the System!' : 'Submit'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
