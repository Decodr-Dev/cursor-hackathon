import Image from "next/image";

type EvidenceRow = {
  id: string;
  type: string;
  fileUrl: string;
};

export function ProblemEvidenceList({ evidence }: { evidence: EvidenceRow[] }) {
  if (evidence.length === 0) return null;

  return (
    <section className="mt-6">
      <ul className="flex flex-col gap-3">
        {evidence.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-xl border border-[var(--kasa-divider)] bg-black/[0.03]"
          >
            {item.type === "photo" ? (
              <Image
                src={item.fileUrl}
                alt="Evidence"
                width={1200}
                height={675}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <a
                href={item.fileUrl}
                className="block px-4 py-5 text-sm font-semibold text-[var(--kasa-forest)] hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Open document
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
