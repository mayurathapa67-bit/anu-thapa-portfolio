import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <Reveal>
      <div className={`flex flex-col ${alignment}`}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 font-playfair text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/70">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
