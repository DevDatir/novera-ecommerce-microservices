interface AddressModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const AddressModal = ({
  open,
  title,
  children,
  onClose,
}: AddressModalProps) => {

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-2xl rounded-2xl bg-white p-8">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>

        </div>

        {children}

      </div>

    </div>
  );
};

export default AddressModal;