import { useState } from "react";

interface Props {
  images: string[];
}

const ProductImageCarousel = ({ images }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const selected = images[selectedImage] || "/placeholder-shoe.jpg";

  return (
    <div>
      <div className="bg-sand-100 aspect-square flex items-center justify-center">
        <img
          src={selected}
          alt="Selected product view"
          className="object-contain h-full w-full p-10"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              aria-label={`View product image ${index + 1}`}
              className={`min-h-11 min-w-11 border overflow-hidden transition-colors ${
                selectedImage === index
                  ? "border-ink-900 border-2"
                  : "border-ink-100"
              }`}
            >
              <img
                src={image}
                alt="Thumbnail"
                className="w-20 h-20 object-cover bg-sand-100"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
