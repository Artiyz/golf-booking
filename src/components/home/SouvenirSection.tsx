import Image from "next/image";
import Link from "next/link";

export default function SouvenirSection() {
    return (
        <section id="souvenirs" className="mx-auto max-w-7xl px-4 py-14">
            {/* Main container with gradient background */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-3xl p-6 md:p-10">
                {/* Heading and introduction */}
                <div className="text-center mb-10">
                    <div className="heading-wrap">
                        <div className="heading-bar"></div>
                        <h2 className="heading-text">Shop Celtic Souvenirs</h2>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 max-w-2xl mx-auto">
                        Discover our curated line of Celtic merchandise—plushies, polos, towels, keychains
                        and more. All items available for in-store purchase only.
                    </p>
                </div>

                {/* Featured product - Owl Plush (largest) */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Left: Image */}
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/golf/merch/owlwithlogo.svg"
                                    alt="Owl Plush Mascot"
                                    width={350}
                                    height={350}
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Right: Description */}
                            <div className="text-center md:text-left">
                                <div className="mb-2">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Limited</span>
                                </div>
                                <h4 className="text-xl md:text-2xl font-semibold text-emerald-700 mb-2">
                                    Owl Plush (Mascot)
                                </h4>
                                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                                    Soft plush with logo tee — fan favourite! This adorable mascot
                                    is the perfect companion for any Celtic Golf enthusiast.
                                    Limited quantities available.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        Premium Quality
                                    </span>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        Collector's Item
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medium items - Polo and Towel (same size) */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Polo shirt */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                        <div className="flex flex-col sm:flex-row gap-4 items-center h-full">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/golf/merch/polowithlogo.svg"
                                    alt="Celtic Logo Polo"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="mb-1">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">In-store only</span>
                                </div>
                                <h4 className="text-base font-semibold text-emerald-700 mb-1">
                                    Celtic Logo Polo
                                </h4>
                                <p className="text-sm text-slate-700">
                                    Breathable pique knit, unisex sizes S–XL.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Towel */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                        <div className="flex flex-col sm:flex-row gap-4 items-center h-full">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/golf/merch/towelwithlogo.svg"
                                    alt="Celtic Golf Towel"
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="mb-1">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">New</span>
                                </div>
                                <h4 className="text-base font-semibold text-emerald-700 mb-1">
                                    Golf Towel
                                </h4>
                                <p className="text-sm text-slate-700">
                                    Premium cotton terry, embroidered logo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small item - Keychain (smallest) */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 max-w-md mx-auto">
                        <div className="flex items-center gap-5">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/golf/merch/keychainwithlogo.svg"
                                    alt="Metal Keychain"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="mb-2">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Popular</span>
                                </div>
                                <h4 className="text-base font-semibold text-emerald-700 mb-1">
                                    Metal Keychain
                                </h4>
                                <p className="text-sm text-slate-700">
                                    Brushed finish, laser-etched crest.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to action text */}
                <div className="text-center">
                    <p className="text-sm text-slate-700">
                        Visit the Celtic Golf Centre to browse our full collection and pick up your favourites!
                    </p>
                </div>
            </div>
        </section>
    );
}