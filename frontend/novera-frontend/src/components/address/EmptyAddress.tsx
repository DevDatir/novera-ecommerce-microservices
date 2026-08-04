import Button from "../ui/Button";

interface EmptyAddressProps {
  onAdd: () => void;
}

const EmptyAddress = ({
  onAdd,
}: EmptyAddressProps) => {
  return (
    <div className="flex flex-col items-center py-24">

      <h2 className="text-2xl font-bold">
        No Saved Addresses
      </h2>

      <p className="mt-3 text-gray-500">
        Add your first delivery address.
      </p>

      <Button
        className="mt-8"
        onClick={onAdd}
      >
        Add Address
      </Button>

    </div>
  );
};

export default EmptyAddress;