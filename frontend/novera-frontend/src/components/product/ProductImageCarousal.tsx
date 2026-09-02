import { useState } from "react";

interface Props {
    images: string[];
}

const ProductImageCarousel = ({ images }: Props) => {

    const [selectedImage, setSelectedImage] = useState(0);

    const selected = images[selectedImage] || "/placeholder-shoe.jpg";

    return (

        <div>

            <div className="rounded-3xl bg-slate-100 h-[500px] flex items-center justify-center">

                <img

                    src={selected}

                    alt="Selected product view"

                    className="object-contain h-full transition"

                />

            </div>

            <div className="flex gap-4 mt-5">

                {images.map((image, index) => (

                    <button

                        key={index}

                        onClick={() => setSelectedImage(index)}

                        aria-label={`View product image ${index + 1}`}
                        className={`min-h-11 min-w-11 border rounded-xl overflow-hidden transition

                        ${
                            selectedImage === index
                                ? "border-primary-600 border-2"
                                : "border-gray-200"
                        }

                        `}

                    >

                        <img

                            src={image}

                            alt="Thumbnail"

                            className="w-24 h-24 object-cover"

                        />

                    </button>

                ))}

            </div>

        </div>

    );

};

export default ProductImageCarousel;
