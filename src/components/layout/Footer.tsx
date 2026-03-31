import React from 'react';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Made with ❤️</span>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://github.com/omshrihari/spendwise"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={16} />
            Github
          </a>
        </div>
      </div>
    </footer>
  );
}
