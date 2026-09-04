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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink-900">{title}</h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-ink-400 hover:text-ink-900"
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
