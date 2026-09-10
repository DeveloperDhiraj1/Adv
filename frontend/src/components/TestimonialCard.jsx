import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import RatingStars from "./RatingStars";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="flex h-full flex-col rounded-xl2 border border-line bg-card p-7 shadow-card">
      <HiOutlineChatBubbleBottomCenterText className="h-7 w-7 text-emerald/40" />
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
        “{testimonial.quote}”
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.category}</p>
        </div>
        <div className="ml-auto">
          <RatingStars rating={testimonial.rating} showValue={false} />
        </div>
      </div>
    </div>
  );
}
