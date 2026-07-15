import type { Service } from "@/lib/types";
import { ServiceIcon } from "@/components/icons";
import Reveal from "@/components/Reveal";

export default function ServicesGrid({ services }: { services: Service[] }) {
  if (!Array.isArray(services) || services.length === 0) {
    return null;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <Reveal key={service.title} delay={(i % 3) * 0.08}>
          <article className="group flex h-full flex-col rounded-2xl border border-charcoal/10 bg-white p-7 transition-all duration-300 hover:border-teal/40 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal transition-colors group-hover:bg-teal group-hover:text-cream">
              <ServiceIcon name={service.icon} width={24} height={24} />
            </div>
            <h3 className="mt-5 font-playfair text-xl font-semibold text-charcoal">
              {service.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">
              {service.description}
            </p>
            {service.price && (
              <p className="mt-5 text-sm font-medium text-teal">
                {service.price}
              </p>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}
