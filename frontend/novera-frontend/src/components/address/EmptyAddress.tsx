import Button from "../ui/Button";
import { MapPin } from "lucide-react";

interface EmptyAddressProps {
  onAdd: () => void;
}

const EmptyAddress = ({ onAdd }: EmptyAddressProps) => {
  return (
    <div className="flex flex-col items-center py-20 sm:py-24">
      <div className="h-20 w-20 bg-sand-100 flex items-center justify-center">
        <MapPin size={32} className="text-ink-300" />
      </div>

      <h2 className="mt-6 font-display text-2xl text-ink-900">
        No saved addresses
      </h2>

      <p className="mt-3 text-ink-500">Add your first delivery address.</p>

      <Button className="mt-8" onClick={onAdd}>
        Add address
      </Button>
    </div>
  );
};

export default EmptyAddress;
