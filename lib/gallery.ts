export type GalleryCategory = "birthdays" | "events";

export type GalleryItem = {
  src: string;
  width: number;
  height: number;
  category: GalleryCategory;
  title: { en: string; cz: string };
};

// To add a photo: drop the file in public/images/gallery/, then add an entry
// here with its pixel size and a title in both languages.
export const galleryItems: GalleryItem[] = [
  {
    src: "/images/gallery/navy-gold-15th.jpg",
    width: 1086,
    height: 1448,
    category: "birthdays",
    title: { en: "Navy & Gold 15th Birthday", cz: "Námořnická modrá a zlatá – 15. narozeniny" },
  },
  {
    src: "/images/gallery/jungle-first-birthday.jpg",
    width: 1400,
    height: 1050,
    category: "birthdays",
    title: { en: "Jungle 1st Birthday", cz: "Džungle – 1. narozeniny" },
  },
  {
    src: "/images/gallery/purple-butterfly-10th.jpg",
    width: 1400,
    height: 1050,
    category: "birthdays",
    title: { en: "Purple Butterfly 10th Birthday", cz: "Fialoví motýli – 10. narozeniny" },
  },
  {
    src: "/images/gallery/gold-ivory-60th.jpg",
    width: 1086,
    height: 1448,
    category: "birthdays",
    title: { en: "Gold & Ivory 60th Birthday", cz: "Zlatá a slonová kost – 60. narozeniny" },
  },
  {
    src: "/images/gallery/minnie-first-birthday-b.jpg",
    width: 1400,
    height: 1867,
    category: "birthdays",
    title: { en: "Minnie Mouse 1st Birthday", cz: "Minnie Mouse – 1. narozeniny" },
  },
  {
    src: "/images/gallery/grand-opening-backdrop.jpg",
    width: 1400,
    height: 1867,
    category: "events",
    title: { en: "Grand Opening Backdrop", cz: "Kulisa na slavnostní otevření" },
  },
  {
    src: "/images/gallery/womens-day-backdrop.jpg",
    width: 1086,
    height: 1448,
    category: "events",
    title: { en: "Women's Day Backdrop", cz: "Kulisa na Mezinárodní den žen" },
  },
  {
    src: "/images/gallery/black-silver-white-garland.jpg",
    width: 1086,
    height: 1448,
    category: "events",
    title: { en: "Black, Silver & White Garland", cz: "Girlanda – černá, stříbrná a bílá" },
  },
];
