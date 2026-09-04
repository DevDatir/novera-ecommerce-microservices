import type { AddressResponse } from "../../types/address";

interface Props {
  addresses: AddressResponse[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

const AddressSelector = ({ addresses, selectedId, onSelect }: Props) => {
  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <label
          key={address.id}
          className={`block cursor-pointer border p-5 transition-colors ${
            selectedId === address.id
              ? "border-primary-500 bg-primary-50"
              : "border-ink-200 bg-white hover:border-ink-400"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              checked={selectedId === address.id}
              onChange={() => onSelect(address.id)}
              className="mt-1 accent-primary-500"
            />
            <div className="text-sm text-ink-600">
              <div className="flex items-center gap-2">
                <strong className="text-ink-900">{address.fullName}</strong>
                {address.isDefault && (
                  <span className="rounded-sm bg-ink-900 px-2 py-0.5 text-xs text-white">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1">{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>{address.city}, {address.state}</p>
              <p>{address.postalCode}</p>
              <p>{address.phone}</p>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default AddressSelector;
