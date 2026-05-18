import { useEffect, useSyncExternalStore } from "react";

export type Lang = "en" | "fa";

const KEY = "mp_lang";
const listeners = new Set<() => void>();

function read(): Lang {
  const v = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) || "";
  return v === "fa" ? "fa" : "en";
}

function apply(lang: Lang) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }
}

export function setLang(lang: Lang) {
  localStorage.setItem(KEY, lang);
  apply(lang);
  listeners.forEach((l) => l());
}

export function useLang(): Lang {
  const lang = useSyncExternalStore<Lang>(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    read,
    () => "en" as Lang,
  );
  useEffect(() => { apply(lang); }, [lang]);
  return lang;
}

type Dict = Record<string, string>;

const en: Dict = {
  brand: "mepaste",
  brand_sub: "می‌پیست",
  give_name: "give it a name?",
  placeholder_hint: "// paste anything. or type it.",
  placeholder_line_2: "no signup. no tracking.",
  placeholder_line_3: "it ripens, then it's gone.",
  words: "words",
  fresh_off_vine: "fresh off the vine",
  publish: "Publish",
  publish_sub: "and grow a link",
  publishing: "smashing…",
  published: "published ✓",
  cmd_ripe: "⌘↩ when ripe",
  public: "public",
  unlisted: "unlisted",
  private: "private",
  wilts_in_a_day: "wilts in a day",
  wilts_in_an_hour: "wilts in an hour",
  wilts_never: "never wilts",
  password: "password",
  burn_after_read: "burn after read",
  burns_on_first_read: "burns on first read",
  burns_on_open: "burns\non open",
  my_pastes: "my pastes",
  search_pastes: "search pastes",
  all: "all",
  new_paste: "new",
  pastes: "pastes",
  settings: "settings",
  settings_what_is: "what is mepaste?",
  settings_manifesto: "one person, one textarea, one short link.\nno signup, no ads, no analytics. your paste\nripens, then it goes away.",
  settings_signature: "— nima, 2026 · tehran",
  profile: "profile",
  defaults_section: "defaults for new pastes",
  who_can_see: "who can see it",
  how_long_ripens: "how long it ripens",
  colour_the_code: "colour the code",
  look_feel: "look & feel",
  theme: "theme",
  language: "language",
  language_value: "english · فارسی",
  workshop: "the workshop",
  current_vintage: "current vintage",
  vintage_value: "v0.4.2 · batch #042",
  changelog: "changelog",
  changelog_value: "42 entries",
  peek_source: "peek the source",
  github: "github",
  guestbook: "guestbook",
  guestbook_value: "217 signatures",
  three_promises: "three promises",
  promise_1: "no trackers, no ads, no fingerprints",
  promise_2: "your paste wilts when you said it would",
  promise_3: "deletion means deletion",
  visitors: "visitors:",
  page_weight: "this page · 14kb · 0 cookies · hand-built",
  made_with: "one person · one textarea · tehran",
  copy: "copy",
  open_it: "open it →",
  smash_another: "smash another",
  your_paste_live: "your paste is live.",
  reading_now: "reading right now",
  visitors_so_far: "visitors so far",
  unlock: "unlock",
  this_one_needs_password: "this paste needs a password",
  paste_wilted: "this paste has wilted.",
  paste_burned: "this paste was burned after its first read.",
  paste_not_found: "paste not found.",
  go_home: "back to mepaste",
  default_title_placeholder: "give it a name?",
  back: "back",
  raw: "raw",
};

const fa: Dict = {
  ...en,
  brand: "mepaste",
  brand_sub: "می‌پیست",
  give_name: "بی‌نام",
  placeholder_hint: "// هر چیزی را بنویس یا بچسبان.",
  placeholder_line_2: "بدون ثبت‌نام، بدون ردیابی.",
  placeholder_line_3: "می‌رسد، بعد می‌رود.",
  words: "کلمه",
  fresh_off_vine: "تازه از تاک",
  publish: "انتشار",
  publish_sub: "و یک لینک کوتاه بسازیم",
  publishing: "در حال له کردن…",
  published: "منتشر شد ✓",
  cmd_ripe: "⌘↩ برای انتشار",
  public: "عمومی",
  unlisted: "فهرست‌نشده",
  private: "خصوصی",
  wilts_in_a_day: "یک روز",
  wilts_in_an_hour: "یک ساعت",
  wilts_never: "هرگز پژمرده نمی‌شود",
  password: "رمز عبور",
  burn_after_read: "پس از خواندن، حذف",
  burns_on_first_read: "پس از اولین خواندن می‌سوزد",
  burns_on_open: "می‌سوزد\nهنگام باز شدن",
  my_pastes: "یادداشت‌های من",
  search_pastes: "جستجوی یادداشت‌ها",
  all: "همه",
  new_paste: "جدید",
  pastes: "یادداشت‌ها",
  settings: "تنظیمات",
  settings_what_is: "می‌پیست چیست؟",
  settings_manifesto: "یک نفر، یک کادر متن، یک لینک کوتاه.\nبدون ثبت‌نام، بدون آگهی، بدون آنالیتیکس.\nیادداشت می‌رسد، سپس می‌رود.",
  settings_signature: "— نیما، ۲۰۲۶ · تهران",
  profile: "نمایه",
  defaults_section: "پیش‌فرض‌های یادداشت‌های جدید",
  who_can_see: "چه کسی می‌تواند ببیند",
  how_long_ripens: "چه مدت می‌رسد",
  colour_the_code: "رنگ کردن کد",
  look_feel: "ظاهر و حس",
  theme: "تم",
  language: "زبان",
  language_value: "english · فارسی",
  workshop: "کارگاه",
  current_vintage: "نسخه‌ی فعلی",
  vintage_value: "v0.4.2 · batch #042",
  changelog: "تغییرات",
  changelog_value: "۴۲ ثبت",
  peek_source: "نگاهی به منبع",
  github: "github",
  guestbook: "دفتر یادبود",
  guestbook_value: "۲۱۷ امضا",
  three_promises: "سه قول",
  promise_1: "بدون ردیاب، بدون آگهی، بدون اثرانگشت",
  promise_2: "یادداشت شما درست زمانی که گفتید پژمرده می‌شود",
  promise_3: "حذف یعنی حذف",
  visitors: "بازدید:",
  page_weight: "این صفحه · ۱۴kb · ۰ کوکی · دست‌ساز",
  made_with: "یک نفر · یک کادر متن · تهران",
  copy: "کپی",
  open_it: "بازش کن ←",
  smash_another: "یکی دیگر له کن",
  your_paste_live: "یادداشت شما زنده شد.",
  reading_now: "هم‌اکنون در حال خواندن",
  visitors_so_far: "بازدیدکننده تاکنون",
  unlock: "باز کن",
  this_one_needs_password: "این یادداشت رمز می‌خواهد",
  paste_wilted: "این یادداشت پژمرده شده است.",
  paste_burned: "این یادداشت بعد از خواندن سوخته شد.",
  paste_not_found: "یادداشت پیدا نشد.",
  go_home: "بازگشت به می‌پیست",
  default_title_placeholder: "بی‌نام",
  back: "بازگشت",
  raw: "خام",
};

export function t(lang: Lang, key: keyof typeof en): string {
  const d = lang === "fa" ? fa : en;
  return d[key] ?? en[key] ?? key;
}
