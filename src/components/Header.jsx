"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/use-translation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/redux/slices/cartSlice";
const Header = () => {
  const { setTheme, theme } = useTheme();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { t, changeLanguage, currentLanguage, isRTL } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const headerRef = useRef(null);
  const router = useRouter();

  const CATEGORIES = [
    {
      name: t("categories.pre_builds"),
      subcategories: [t("categories.new"), t("categories.used")],
    },
    {
      name: t("categories.pc_parts"),
      subcategories: [t("categories.memory"), t("categories.storage")],
    },
    {
      name: t("categories.accessories"),
      subcategories: [
        t("categories.keyboards"),
        t("categories.mice"),
        t("categories.headphones"),
        t("categories.gaming_accessories"),
        t("categories.adapters"),
        t("categories.speakers"),
        t("categories.webcams"),
        t("categories.networking"),
        t("categories.accessories"),
        t("categories.power"),
        t("categories.cleaning"),
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setSearchVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = useCallback((index) => {
    setExpandedCategory((prev) => (prev === index ? null : index));
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "ar" : "en";
    changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 will-change-transform ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
      dir={isRTL === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile menu button - always on the "start" side */}
        <div
          className={`flex md:hidden ${
            currentLanguage === "ar" ? "order-3" : ""
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-full"
            aria-expanded={mobileMenuOpen}
            aria-label={t("aria_labels.toggle_menu")}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Logo - centered in mobile, start in desktop */}
        <div
          className={`flex flex-1 ${
            currentLanguage === "ar"
              ? "justify-end md:justify-start"
              : "justify-start"
          }`}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
            aria-label={t("aria_labels.home")}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {t("brand_name")}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <NavigationMenu className="hidden md:block mx-4 flex-1">
          <NavigationMenuList
            className={`flex ${
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            {CATEGORIES.map((category, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger className="bg-transparent px-3 py-2 rounded-lg">
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-xl shadow-lg border dark:border-gray-700 dark:bg-gray-900">
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {category.subcategories.map((sub, subIndex) => (
                      <NavigationMenuLink
                        key={subIndex}
                        asChild
                        className="block rounded-lg p-3 hover:bg-accent transition-colors dark:hover:bg-gray-800"
                      >
                        <Link
                          href={`/category/${sub.toLowerCase()}`}
                          className="flex items-center space-x-3 rtl:space-x-reverse"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="bg-muted w-10 h-10 rounded-lg flex items-center justify-center dark:bg-gray-800">
                            <div className="bg-muted-foreground w-6 h-6 rounded-full opacity-30 dark:bg-gray-600" />
                          </div>
                          <span className="font-medium dark:text-gray-200">
                            {sub}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Actions - always on the "end" side */}
        <div
          className={`flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse ${
            currentLanguage === "ar" ? "order-first md:order-none" : ""
          }`}
        >
          {/* Language Toggle - desktop only */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="hidden md:flex"
          >
            {currentLanguage === "en" ? "العربية" : "English"}
          </Button>

          {/* Search - mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setSearchVisible((prev) => !prev)}
            aria-label={t("aria_labels.search")}
          >
            <Search size={20} />
          </Button>

          {/* Cart */}
          <Link href="/cart" aria-label={t("aria_labels.cart")}>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs text-white">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Desktop Account Menu */}
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={t("aria_labels.account")}
                >
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={currentLanguage === "ar" ? "start" : "end"}
                className="rounded-xl shadow-lg border dark:border-gray-700 dark:bg-gray-900"
              >
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/account"
                    className="flex items-center p-2 gap-2 rtl:gap-reverse dark:hover:bg-gray-800"
                  >
                    <User size={16} />
                    {t("account.my_account")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/orders"
                    className="flex items-center p-2 gap-2 rtl:gap-reverse dark:hover:bg-gray-800"
                  >
                    <ShoppingCart size={16} />
                    {t("account.orders")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border dark:border-gray-700"
                  aria-label={t("aria_labels.toggle_theme")}
                >
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={currentLanguage === "ar" ? "start" : "end"}
                className="rounded-xl shadow-lg border dark:border-gray-700 dark:bg-gray-900"
              >
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer dark:hover:bg-gray-800"
                >
                  <div className="flex items-center p-2 gap-2 rtl:gap-reverse">
                    <Sun size={16} />
                    {t("theme.light")}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer dark:hover:bg-gray-800"
                >
                  <div className="flex items-center p-2 gap-2 rtl:gap-reverse">
                    <Moon size={16} />
                    {t("theme.dark")}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchVisible && (
        <div className="md:hidden px-4 py-3 bg-background border-y dark:border-gray-800 dark:bg-gray-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:left-auto rtl:right-3" />
            <Input
              type="search"
              placeholder={t("search.placeholder")}
              className="pl-10 rounded-full dark:bg-gray-800 dark:border-gray-700 rtl:pr-10 rtl:pl-3"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full rtl:right-auto rtl:left-1"
              onClick={() => setSearchVisible(false)}
              aria-label={t("aria_labels.close_search")}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t dark:border-gray-800 dark:bg-gray-900 animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-1">
              {CATEGORIES.map((category, index) => (
                <div key={index} className="border-b py-2 dark:border-gray-800">
                  <button
                    className="flex items-center justify-between w-full py-2 px-1 rounded-lg"
                    onClick={() => toggleCategory(index)}
                    aria-expanded={expandedCategory === index}
                  >
                    <span className="font-medium dark:text-gray-200">
                      {category.name}
                    </span>
                    {expandedCategory === index ? (
                      <ChevronUp size={20} className="dark:text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="dark:text-gray-400" />
                    )}
                  </button>

                  {expandedCategory === index && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pl-1">
                      {category.subcategories.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={`/category/${sub.toLowerCase()}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent dark:hover:bg-gray-800"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="bg-muted size-8 rounded-lg flex items-center justify-center dark:bg-gray-800">
                            <div className="bg-muted-foreground size-4 rounded-full opacity-30 dark:bg-gray-600" />
                          </div>
                          <span className="dark:text-gray-300">{sub}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Account Links */}
            <div className="mt-4 space-y-1">
              <Link
                href="/account"
                className="flex items-center p-2 rounded-lg hover:bg-accent gap-3 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} className="dark:text-gray-400" />
                <span className="dark:text-gray-300">
                  {t("account.my_account")}
                </span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center p-2 rounded-lg hover:bg-accent gap-3 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart size={20} className="dark:text-gray-400" />
                <span className="dark:text-gray-300">
                  {t("account.orders")}
                </span>
              </Link>
            </div>

            {/* Language Toggle for Mobile */}
            <div className="mt-4 p-2 flex items-center justify-between">
              <span className="font-medium dark:text-gray-300">
                {t("language")}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {currentLanguage === "en" ? "العربية" : "English"}
              </Button>
            </div>

            {/* Theme Toggle for Mobile */}
            <div className="mt-4 p-2 flex items-center justify-between">
              <span className="font-medium dark:text-gray-300">
                {t("theme.theme")}
              </span>
              <div className="flex space-x-1 bg-muted rounded-full p-1 dark:bg-gray-800">
                <Button
                  variant={theme === "light" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full dark:bg-gray-700 dark:text-gray-300"
                  onClick={() => setTheme("light")}
                >
                  {t("theme.light")}
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full dark:bg-gray-700 dark:text-gray-300"
                  onClick={() => setTheme("dark")}
                >
                  {t("theme.dark")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
