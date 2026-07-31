import type { OptionGroup } from "@/types/options";
import OptionCard from "./OptionCard";

type Props = {
  groups: OptionGroup[];
};

export default function OptionGrid({ groups }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <OptionCard
          key={group.id}
          item={group}
        />
      ))}
    </div>
  );
}