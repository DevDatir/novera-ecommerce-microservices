import type { AddressResponse } from "../../types/address";
import Button from "../ui/Button";

interface AddressCardProps {
  address: AddressResponse;
  onEdit: () => void;
  onDelete: () => void;
}


const AddressCard = ({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) => {
  return (
    <div className="rounded-2xl border p-6 shadow-sm bg-white">
      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h3 className="text-lg font-semibold">
              {address.fullName}
            </h3>

           <div
                className={`rounded-2xl border p-6 shadow-sm transition ${
                    address.isDefault
                    ? "border-blue-600 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
                >

          </div>

          <p className="mt-2 text-gray-600">
            {address.phone}
          </p>

          <div className="mt-4 space-y-1 text-gray-700">

            <p>{address.addressLine1}</p>

            {address.addressLine2 && (
              <p>{address.addressLine2}</p>
            )}

            <p>
              {address.city}, {address.state}
            </p>

            <p>
              {address.postalCode}
            </p>

            <p>{address.country}</p>

          </div>

        </div>

        <div className="flex gap-2">

          <Button
            variant="secondary"
            onClick={onEdit}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={onDelete}
          >
            Delete
          </Button>

        </div>

      </div>
    </div>
    </div>
  );
};

export default AddressCard;