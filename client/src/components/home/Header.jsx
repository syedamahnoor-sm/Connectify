import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from "react-router-dom"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-brrom-purple-600 to-pink-600 rounded-lg"></div>
                        <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Connectify
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
                            Features
                        </a>
                        <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
                            About
                        </a>
                        <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                            Contact
                        </a>
                        <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            Sign In
                        </button>
                        <Link to="/register">
                            <button className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden py-4 space-y-3">
                        <a href="#features" className="block text-gray-700 hover:text-purple-600 transition-colors">
                            Features
                        </a>
                        <a href="#about" className="block text-gray-700 hover:text-purple-600 transition-colors">
                            About
                        </a>
                        <a href="#contact" className="block text-gray-700 hover:text-purple-600 transition-colors">
                            Contact
                        </a>
                        <button className="w-full px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-left">
                            Sign In
                        </button>
                        <button className="w-full px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                            Get Started
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}
