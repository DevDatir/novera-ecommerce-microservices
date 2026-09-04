import type { AddressResponse } from "../../types/address";
import Button from "../ui/Button";

interface AddressCardProps {
  address: AddressResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  return (
    <div
      className={`border p-6 bg-white transition-colors ${
        address.isDefault ? "border-primary-500" : "border-ink-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-ink-900">{address.fullName}</h3>
            {address.isDefault && (
              <span className="bg-primary-500 px-2 py-0.5 text-xs font-semibold text-white">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-ink-500">{address.phone}</p>

          <div className="mt-3 space-y-1 text-ink-700">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state}</p>
            <p>{address.postalCode}</p>
            <p>{address.country}</p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
