"use client"

import Link from "next/link"
import { Show, SignInButton, SignUpButton, SignOutButton, UserButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
    { href: "/", label: "Home" },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="w-full flex justify-center py-3 px-4 md:py-5">
            <div className="w-full max-w-4xl border border-lime-500/20 backdrop-blur-xl rounded-2xl bg-lime-700/30 shadow-lg">

                {/* Desktop & Mobile top row */}
                <div className="px-5 py-3 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-black font-bold w-9 h-9 rounded-full bg-lime-400 flex items-center justify-center text-sm select-none">
                            LO
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                        <Show when="signed-in">
                            <Link
                                href="/pricing"
                                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        </Show>
                    </div>

                    {/* Desktop auth buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="text-white/80 hover:text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                    Sign in
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="text-black text-sm font-semibold px-4 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 transition-colors">
                                    Sign up
                                </button>
                            </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                            <UserButton />
                        </Show>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {isOpen && (
                    <div className="md:hidden border-t border-lime-500/20 px-5 py-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                                >
                                    {label}
                                </Link>
                            ))}
                            <Show when="signed-in">
                                <Link
                                    href="/pricing"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </Show>
                        </div>
                        <div className="flex flex-col gap-2 pt-2 border-t border-lime-500/20">
                            <Show when="signed-out">
                                <SignInButton mode="modal">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-full text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                                    >
                                        Sign in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-full text-black text-sm font-semibold px-4 py-2 rounded-lg bg-lime-400 hover:bg-lime-300 transition-colors text-center"
                                    >
                                        Sign up
                                    </button>
                                </SignUpButton>
                            </Show>
                            <Show when="signed-in">
                                <div className="flex items-center gap-3">
                                    <UserButton />
                                    <SignOutButton>
                                        <button className="text-white/70 hover:text-white text-sm transition-colors">
                                            Sign out
                                        </button>
                                    </SignOutButton>
                                </div>
                            </Show>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
