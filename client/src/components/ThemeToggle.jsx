import { useEffect } from 'react';
import DayniteJs from 'daynitejs';

const ThemeToggle = () => {
    useEffect(() => {
        if (!window.daynite) {
            window.daynite = new DayniteJs({
                themes: ['light', 'dark'],
                defaultTheme: 'light',
            });
            
            // Explicitly sync DayniteJs output to Tailwind's native dark class
            window.daynite.onThemeChange(theme => {
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });

            window.daynite.init(); 
        }
    }, []);

    return (
        <button 
            onClick={() => window.daynite && window.daynite.toggle()}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:shadow-md transition-all text-xl shadow-sm hover:scale-110 cursor-pointer"
            title="Toggle Theme powered by DayniteJs"
            aria-label="Toggle Theme"
        >
            🌓
        </button>
    );
};

export default ThemeToggle;
