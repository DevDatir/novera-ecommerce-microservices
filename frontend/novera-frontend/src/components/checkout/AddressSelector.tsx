import type { AddressResponse } from "../../types/address";

interface Props {

    addresses: AddressResponse[];

    selectedId?: number;

    onSelect: (
        id: number
    ) => void;
}

const AddressSelector = ({
    addresses,
    selectedId,
    onSelect,
}: Props) => {

    return (

        <div className="space-y-4">

            {addresses.map(address => (

                <label
                    key={address.id}
                    className={`
                    block
                    cursor-pointer
                    rounded-xl
                    border
                    p-5

                    ${
                        selectedId === address.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }
                    `}
                >

                    <input

                        type="radio"

                        checked={
                            selectedId
                            === address.id
                        }

                        onChange={() =>
                            onSelect(address.id)
                        }

                        className="mr-3"
                    />

                    <strong>

                        {address.fullName}

                    </strong>

                    {address.isDefault && (
                        <span
                            className="
                            ml-3
                            rounded
                            bg-blue-600
                            px-2
                            py-1
                            text-xs
                            text-white
                            "
                        >
                            Default
                        </span>
                    )}

                    <p>
                        {address.addressLine1}
                    </p>

                    {address.addressLine2 && (
                        <p>
                            {address.addressLine2}
                        </p>
                    )}

                    <p>

                        {address.city},

                        {" "}

                        {address.state}

                    </p>

                    <p>

                        {address.postalCode}

                    </p>

                    <p>

                        {address.phone}

                    </p>

                </label>

            ))}

        </div>
    );
};

export default AddressSelector;