import type { Tool } from "@/lib/types";
import Reveal from "@/components/Reveal";

export default function ToolsSection({ tools }: { tools: Tool[] }) {
  if (!Array.isArray(tools) || tools.length === 0) {
    return null;
  }
  return (
    <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
      {tools.map((tool, i) => (
        <Reveal key={tool.name} delay={(i % 2) * 0.08}>
          <div>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-medium text-charcoal">{tool.name}</p>
                <p className="text-xs text-charcoal/50">{tool.category}</p>
              </div>
              <p className="text-sm font-medium text-teal">
                {tool.proficiency}%
              </p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
              <div
                className="h-full rounded-full bg-teal"
                style={{ width: `${tool.proficiency}%` }}
              />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
