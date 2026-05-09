import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTA() {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-linear-to-br from-purple-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="p-12 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                Ready to start your journey?
                            </h2>

                            <p className="text-xl text-purple-100">
                                Join millions of people already connecting on Connectify.
                            </p>

                            <div className="flex gap-4">
                                <Link to="/register">
                                    <button className="px-8 py-4 bg-white text-purple-600 rounded-lg flex items-center gap-2">
                                        Get Started Free
                                        <ArrowRight size={20} />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1758979107810-817db9b3c419"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}