import { Link } from "@tanstack/react-router";
import thresholdImage from "@/assets/light-thresholds.png";

export function LightThresholdPortals() {
  return (
    <div className="light-thresholds relative h-full min-h-[34rem] overflow-hidden bg-[#020303] text-[#f4efe4]">
      <img
        src={thresholdImage}
        alt="一暖一冷、通向两篇回忆的两道光门"
        width={1600}
        height={1100}
        className="light-threshold-image absolute inset-0 h-full w-full object-cover"
      />

      <Link
        to="/letter"
        aria-label="打开《给 Lou 的一封信》"
        className="threshold-link threshold-letter group absolute inset-y-0 left-0 w-[58%] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d9a15e]"
      >
        <span className="threshold-copy absolute left-[5%] top-[44%] flex max-w-[9rem] flex-col items-start text-left md:left-[3%] lg:left-[6%]">
          <span className="font-display text-lg leading-[1.12] text-[#f3d7ad] md:text-xl">
            给 Lou 的一封信
          </span>
          <span className="mt-4 h-px w-10 bg-[#d9a15e]/65 transition-all duration-700 group-hover:w-20 group-focus-visible:w-20" />
        </span>
      </Link>

      <Link
        to="/time-capsule"
        aria-label="打开《时间胶囊》"
        className="threshold-link threshold-capsule group absolute inset-y-0 right-0 w-[47%] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-4px] focus-visible:outline-[#83a6c7]"
      >
        <span className="threshold-copy absolute right-[4%] top-[53%] flex max-w-[8rem] flex-col items-end text-right md:right-[2%] lg:right-[5%]">
          <span className="font-display text-2xl leading-[1.08] text-[#cfdeea] md:text-3xl">
            时间胶囊
          </span>
          <span className="mt-4 h-px w-10 bg-[#7396b7]/60 transition-all duration-700 group-hover:w-20 group-focus-visible:w-20" />
        </span>
      </Link>
    </div>
  );
}
