"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/lib/redux/slices/languageSlice";

const translations = {
  en: {
    brand_name: "ShopEase",
    loading: "Loading data...",
    errors: {
      fetch_products: "Error fetching products",
    },
    actions: {
      try_again: "Try again",
    },
    home: {
      hero: {
        title: "Latest technologies at unbeatable prices",
        subtitle:
          "Discover the latest screens, computers, and technical accessories with high quality and best prices",
        browse_products: "Browse Products",
      },
      featured: {
        title: "Featured Products",
        subtitle: "The most requested products by our customers",
        view_all: "View All Products",
        no_products: "No products available currently",
      },
      categories: {
        title: "Browse Categories",
        subtitle:
          "Discover our diverse products in various technical categories",
        products: "products",
        no_categories: "No categories available currently",
      },
      new_arrivals: {
        title: "New Arrivals",
        subtitle: "The latest products that arrived in our store",
        view_all: "View All Products",
        no_products: "No new products currently",
      },
    },
    products: {
      title: "All Products",
      show_filters: "Show Filters",
      hide_filters: "Hide Filters",
      search_placeholder: "Search products...",
      category: "Category",
      all_categories: "All Categories",
      sort_by: "Sort by",
      latest: "Latest",
      price_low_high: "Price: Low to High",
      price_high_low: "Price: High to Low",
      no_results: "No products match your search",
      filters: "filters",
    },
    categories: {
      pre_builds: "Pre Builds",
      new: "New",
      used: "Used",
      pc_parts: "PC Parts",
      memory: "Memory",
      storage: "Storage",
      accessories: "Accessories",
      keyboards: "Keyboards",
      mice: "Mice",
      headphones: "Headphones",
      gaming_accessories: "Gaming Accessories",
      adapters: "Adapters/Converters",
      speakers: "Speakers",
      webcams: "Webcams",
      networking: "Networking",
      power: "Power",
      cleaning: "Cleaning",
    },
    aria_labels: {
      toggle_menu: "Toggle menu",
      search: "Search",
      cart: "Cart",
      account: "Account",
      toggle_theme: "Toggle theme",
      close_search: "Close search",
    },
    account: {
      my_account: "My Account",
      orders: "Orders",
    },
    theme: {
      light: "Light",
      dark: "Dark",
      theme: "Theme",
    },
    language: "Language",
    search: {
      placeholder: "Search products...",
    },
    product: {
      no_image: "No image available",
      reviews: "reviews",
      add_to_cart: "Add to Cart",
      category: "Category",
      availability: "Availability",
      in_stock: "In Stock",
      out_of_stock: "Out of Stock",
      sku: "SKU",
      save_percent: "Save {{percent}}%",
      recommended: "Recommended Products",
      description: "description",
      added_to_cart: "Added to cart",
      in_cart: "In Cart",
      highlights: "Product Highlights",
      details: "Product Details",
      premium_quality: "Premium quality materials",
      brand_placeholder: "Generic Brand",
      weight: "Weight",
      free_shipping: "Free Shipping",
      free_shipping_details: "Free shipping on orders over $50",
      ships_in: "Ships in",
      days: "days",
      save_amount: "You save ${{amount}}",
      write_review: "Write a review",
      view_all: "View All",
    },
    wishlist: {
      added: "Added to wishlist",
      removed: "Removed from wishlist",
    },
    errors: {
      fetch_products: "Error fetching products",
      product_not_found: "Product not found",
    },
    actions: {
      try_again: "Try again",
      back_to_home: "Back to Home",
      back_to_products: "Back to Products",
    },
    currency: "EGP",
    price_prefix: "EGP",
    about: {
      title: "About Us",
      content:
        "We are a tech store passionate about bringing you the latest gadgets and electronics at competitive prices. Our team of experts carefully selects each product to ensure quality and value.",
      team: "Our Team",
      mission: "Our Mission",
      vision: "Our Vision",
      values: "Our Values",
    },
    contact: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you",
      form: {
        name: "Your Name",
        email: "Email Address",
        phone: "Phone Number",
        message: "Your Message",
        submit: "Send Message",
        success: "Thank you! Your message has been sent.",
      },
      info: {
        address: "123 Tech Street, Cairo, Egypt",
        phone: "+20 123 456 7890",
        email: "info@shopease.com",
        hours: "Sunday-Thursday: 9AM-5PM",
      },
    },
    wishlist: {
      title: "My Wishlist",
      empty: "Your wishlist is empty",
      items: "items",
      move_to_cart: "Move to Cart",
      remove: "Remove",
      added: "Added to wishlist",
      removed: "Removed from wishlist",
    },
    cart: {
      title: "Cart",
      items: "Cart items",
      clear_cart: "Clear cart",
      total: "total",
      subtotal: "subtotal",
      shipping: "shipping",
      order_summary: "Order Summary",
      continue_shopping: "Continue shopping",
      empty: "Cart is empty",
      free: "free",
      checkout: "Checkout",
    },
    checkout: {
      title: "Complete Your Order",
      shipping_info: "Shipping Information",
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      state: "State/Province",
      zip: "ZIP/Postal Code",
      payment_method: "Payment Method",
      credit_card: "Credit Card",
      card_number: "Card Number",
      expiry_date: "Expiry Date",
      cvv: "CVV",
      card_name: "Name on Card",
      card_name_placeholder: "As shown on card",
      cash_on_delivery: "Cash on Delivery",
      order_summary: "Order Summary",
      place_order: "Place Order",
      success: "Order placed successfully!",
      error: "Failed to place order. Please try again.",
      validation: {
        required: "This field is required",
        invalid_email: "Please enter a valid email",
        invalid_phone: "Please enter a valid phone number",
        invalid_zip: "Please enter a valid ZIP code",
        too_short: "This field is too short",
      },
    },
  },
  ar: {
    brand_name: "متجر تِك",
    loading: "جاري تحميل البيانات...",
    errors: {
      fetch_products: "حدث خطأ أثناء جلب المنتجات",
    },
    actions: {
      try_again: "حاول مرة أخرى",
    },
    home: {
      hero: {
        title: "أحدث التقنيات بأسعار لا تقبل المنافسة",
        subtitle:
          "اكتشف أحدث الشاشات، أجهزة الكمبيوتر، والاكسسوارات التقنية بجودة عالية وأفضل الأسعار",
        browse_products: "تصفح المنتجات",
      },
      featured: {
        title: "المنتجات المميزة",
        subtitle: "أفضل المنتجات الأكثر طلباً من عملائنا",
        view_all: "عرض جميع المنتجات",
        no_products: "لا توجد منتجات متاحة حالياً",
      },
      categories: {
        title: "تصفح الفئات",
        subtitle: "اكتشف منتجاتنا المتنوعة في مختلف الفئات التقنية",
        products: "منتج",
        no_categories: "لا توجد فئات متاحة حالياً",
      },
      new_arrivals: {
        title: "وصل حديثاً",
        subtitle: "أحدث المنتجات التي وصلت لمتجرنا",
        view_all: "عرض جميع المنتجات",
        no_products: "لا توجد منتجات جديدة حالياً",
      },
    },
    products: {
      title: "جميع المنتجات",
      show_filters: "عرض الفلاتر",
      hide_filters: "إخفاء الفلاتر",
      search_placeholder: "ابحث عن المنتجات...",
      category: "الفئة",
      all_categories: "كل الفئات",
      sort_by: "ترتيب حسب",
      latest: "الأحدث",
      price_low_high: "السعر: من الأقل للأعلى",
      price_high_low: "السعر: من الأعلى للأقل",
      no_results: "لا توجد منتجات مطابقة لبحثك",
      filters: "فلاتر",
    },
    categories: {
      pre_builds: "أجهزة مسبقة التجميع",
      new: "جديد",
      used: "مستعمل",
      pc_parts: "قطع الكمبيوتر",
      memory: "الذاكرة",
      storage: "التخزين",
      accessories: "ملحقات",
      keyboards: "لوحات المفاتيح",
      mice: "الفأرة",
      headphones: "سماعات الرأس",
      gaming_accessories: "ملحقات الألعاب",
      adapters: "المحولات",
      speakers: "مكبرات الصوت",
      webcams: "كاميرات الويب",
      networking: "الشبكات",
      power: "الطاقة",
      cleaning: "التنظيف",
    },
    aria_labels: {
      toggle_menu: "تبديل القائمة",
      search: "بحث",
      cart: "عربة التسوق",
      account: "الحساب",
      toggle_theme: "تبديل السمة",
      close_search: "إغلاق البحث",
    },
    account: {
      my_account: "حسابي",
      orders: "الطلبات",
    },
    theme: {
      light: "فاتح",
      dark: "داكن",
      theme: "السمة",
    },
    language: "اللغة",
    search: {
      placeholder: "ابحث عن المنتجات...",
    },
    product: {
      no_image: "لا توجد صورة متاحة",
      reviews: "تقييمات",
      add_to_cart: "أضف إلى السلة",
      category: "الفئة",
      availability: "التوفر",
      in_stock: "متوفر",
      out_of_stock: "غير متوفر",
      sku: "رمز المنتج",
      save_percent: "وفر {{percent}}%",
      recommended: "منتجات مقترحة",
      description: "وصف المنتج",
      added_to_cart: "تمت الإضافة إلى السلة",
      in_cart: "في السلة",
      highlights: "أبرز المميزات",
      details: "تفاصيل المنتج",
      premium_quality: "مواد عالية الجودة",
      brand_placeholder: "ماركة عامة",
      weight: "الوزن",
      free_shipping: "شحن مجاني",
      free_shipping_details: "شحن مجاني للطلبات فوق 50 دولار",
      ships_in: "التوصيل خلال",
      days: "أيام",
      save_amount: "وفرت ${{amount}}",
      write_review: "اكتب تقييمك",
      view_all: "عرض الكل",
    },
    wishlist: {
      added: "تمت الإضافة إلى المفضلة",
      removed: "تم الإزالة من المفضلة",
    },
    errors: {
      fetch_products: "حدث خطأ أثناء جلب المنتجات",
      product_not_found: "المنتج غير موجود",
    },
    actions: {
      try_again: "حاول مرة أخرى",
      back_to_home: "العودة إلى الصفحة الرئيسية",
      back_to_products: "العودة إلى المنتجات",
    },
    currency: "جنيه",
    price_prefix: "ج.م",
    about: {
      title: "من نحن",
      content:
        "نحن متجر تقني نحرص على توفير أحدث الأجهزة والإلكترونيات بأسعار تنافسية. يقوم فريقنا من الخبراء باختيار كل منتج بعناية لضمان الجودة والقيمة.",
      team: "فريقنا",
      mission: "مهمتنا",
      vision: "رؤيتنا",
      values: "قيمنا",
    },
    contact: {
      title: "اتصل بنا",
      subtitle: "نحن نرحب بتواصلك معنا",
      form: {
        name: "اسمك",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        message: "رسالتك",
        submit: "إرسال الرسالة",
        success: "شكراً لك! تم إرسال رسالتك بنجاح.",
      },
      info: {
        address: "123 شارع التقنية، القاهرة، مصر",
        phone: "+20 123 456 7890",
        email: "info@shopease.com",
        hours: "الأحد-الخميس: 9ص-5م",
      },
    },
    wishlist: {
      title: "قائمة الرغبات",
      empty: "قائمة الرغبات فارغة",
      items: "منتجات",
      move_to_cart: "نقل إلى السلة",
      remove: "إزالة",
      added: "تمت الإضافة إلى المفضلة",
      removed: "تمت الإزالة من المفضلة",
    },
    cart: {
      title: "سلة التسوق",
      items: "عناصر السلة",
      clear_cart: "إفراغ السلة",
      total: "الإجمالي",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      order_summary: "ملخص الطلب",
      continue_shopping: "متابعة التسوق",
      empty: "السلة فارغة",
      free: "مجاني",
      checkout: "الدفع",
    },
    checkout: {
      title: "إتمام الطلب",
      shipping_info: "معلومات الشحن",
      first_name: "الاسم الأول",
      last_name: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      address: "العنوان",
      city: "المدينة",
      state: "المنطقة/المحافظة",
      zip: "الرمز البريدي",
      payment_method: "طريقة الدفع",
      credit_card: "بطاقة ائتمانية",
      card_number: "رقم البطاقة",
      expiry_date: "تاريخ الانتهاء",
      cvv: "CVV",
      card_name: "اسم صاحب البطاقة",
      card_name_placeholder: "كما هو مدون على البطاقة",
      cash_on_delivery: "الدفع عند الاستلام",
      order_summary: "ملخص الطلب",
      place_order: "تأكيد الطلب",
      success: "تم تقديم الطلب بنجاح!",
      error: "فشل تقديم الطلب. يرجى المحاولة مرة أخرى.",
      validation: {
        required: "هذا الحقل مطلوب",
        invalid_email: "يرجى إدخال بريد إلكتروني صحيح",
        invalid_phone: "يرجى إدخال رقم هاتف صحيح",
        invalid_zip: "يرجى إدخال رمز بريدي صحيح",
        too_short: "هذا الحقل قصير جداً",
      },
    },
  },
};

export const useTranslation = () => {
  const dispatch = useDispatch();
  const { currentLanguage, isRTL } = useSelector((state) => state.language);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language");
      const browserLang = navigator.language?.split("-")[0].toLowerCase();

      // Set initial language
      const initialLang =
        savedLang && translations[savedLang]
          ? savedLang
          : translations[browserLang]
          ? browserLang
          : "en";

      dispatch(setLanguage(initialLang));
      document.documentElement.lang = initialLang;
      document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
    }
  }, [dispatch]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      dispatch(setLanguage(lang));
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("language", lang);
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return value;
  };

  return { t, changeLanguage, currentLanguage, isRTL };
};
