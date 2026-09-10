import { expertAvatar } from "../assets/images";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUserGroup,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineVideoCamera,
  HiOutlineBanknotes,
  HiOutlineCheckBadge,
} from "react-icons/hi2";

export const howItWorks = [
  {
    step: "1",
    title: "Tell Us What You Need",
    description: "Choose your category or search for a specific expert.",
    icon: HiOutlineMagnifyingGlass,
  },
  {
    step: "2",
    title: "Find Your Expert",
    description: "Compare experts based on experience, ratings, price and availability.",
    icon: HiOutlineUserGroup,
  },
  {
    step: "3",
    title: "Book Your Session",
    description: "Select a convenient date and time.",
    icon: HiOutlineCalendarDays,
  },
  {
    step: "4",
    title: "Get Personalized Guidance",
    description: "Connect through video call or chat.",
    icon: HiOutlineChatBubbleLeftRight,
  },
];

export const whyChooseUs = [
  {
    title: "Verified Professionals",
    description: "Only approved experts can offer sessions.",
    icon: HiOutlineCheckBadge,
  },
  {
    title: "Personalized Advice",
    description: "Get guidance based on your specific situation.",
    icon: HiOutlineAdjustmentsHorizontal,
  },
  {
    title: "Flexible Sessions",
    description: "Choose video calls, chat or other available session formats.",
    icon: HiOutlineVideoCamera,
  },
  {
    title: "Transparent Pricing",
    description: "See the session price before booking.",
    icon: HiOutlineBanknotes,
  },
  {
    title: "Secure Platform",
    description: "Keep user information and communication protected.",
    icon: HiOutlineShieldCheck,
  },
  {
    title: "Easy Booking",
    description: "Find and book an expert in a few simple steps.",
    icon: HiOutlineCalendarDays,
  },
];

export const verificationSteps = [
  "Submit credentials",
  "Identity verification",
  "Professional verification",
  "Profile approval",
  "Start advising",
];

export const testimonials = [
  {
    name: "Priya Raghavan",
    category: "Career",
    photo: expertAvatar(5),
    rating: 5,
    quote:
      "Finding the right mentor completely changed how I approached my career transition. I booked a session the same day and had a plan within a week.",
  },
  {
    name: "Aditya Kulkarni",
    category: "Investment",
    photo: expertAvatar(22),
    rating: 5,
    quote:
      "Clear, honest financial guidance without any sales pitch. My advisor explained every option in language I actually understood.",
  },
  {
    name: "Sneha Reddy",
    category: "Therapy",
    photo: expertAvatar(9),
    rating: 5,
    quote:
      "The verification badges gave me confidence before I even booked. The session itself felt safe, professional and genuinely helpful.",
  },
];
