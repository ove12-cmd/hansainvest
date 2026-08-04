import Image from "next/image";
import { Text } from "@/components/ui/Text";
import type { ServiceDetail } from "@/lib/data/services";

export function ServiceDetailRow({ service }: { service: ServiceDetail }) {
  const textBlock = (
    <div className="flex flex-col justify-center rounded-panel bg-white p-8 sm:p-12">
      <div className="mb-4.5 font-display text-[13px] font-bold text-brand">{service.number}</div>
      <h2 className="mb-4 font-display text-[32px] font-semibold leading-[1.12] tracking-tight">{service.title}</h2>
      <Text variant="bodyLg" className="mb-6">
        {service.description}
      </Text>
      <ul className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <li key={tag} className="rounded-pill bg-panel px-4 py-2.5 text-[13px] font-semibold">
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );

  const imageBlock = (
    <div className="min-h-85 overflow-hidden rounded-panel bg-panel">
      {service.image ? (
        <Image
          src={service.image.src}
          alt={service.image.alt}
          width={720}
          height={480}
          className="h-full w-full object-cover object-[center_bottom]"
        />
      ) : (
        <div className="flex h-full min-h-85 items-center justify-center px-6 text-center text-xs font-semibold text-muted-3">
          {service.title}
        </div>
      )}
    </div>
  );

  return (
    <section className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
      {service.imageFirst ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
