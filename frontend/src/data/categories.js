import {
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineChartBar,
  HiOutlineAcademicCap,
  HiOutlineScale,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

const categories = [
  {
    slug: "career",
    name: "Career",
    icon: HiOutlineBriefcase,
    description:
      "Career planning, job guidance, resume reviews, interviews and professional growth.",
    experts: 128,
  },
  {
    slug: "therapy",
    name: "Therapy",
    icon: HiOutlineHeart,
    description: "Mental wellness, counselling and personal guidance.",
    experts: 94,
  },
  {
    slug: "investment",
    name: "Investment",
    icon: HiOutlineChartBar,
    description: "Financial planning, investment guidance and wealth-related advice.",
    experts: 76,
  },
  {
    slug: "exams",
    name: "Exams",
    icon: HiOutlineAcademicCap,
    description: "Competitive exam preparation, mentoring and study strategy.",
    experts: 61,
  },
  {
    slug: "legal",
    name: "Legal",
    icon: HiOutlineScale,
    description: "Legal consultation and professional legal guidance.",
    experts: 53,
  },
  {
    slug: "business",
    name: "Business",
    icon: HiOutlineBuildingOffice2,
    description: "Business strategy, entrepreneurship and professional consulting.",
    experts: 88,
  },
];

export default categories;
