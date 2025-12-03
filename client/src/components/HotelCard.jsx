import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index = 0 }) => {
  const image = room?.images?.[0] || assets?.roomPlaceholder;
  const hotelName = room?.hotel?.name || room?.name || "Hotel";
  const address = room?.hotel?.address || "—";
  const price = room?.pricePerNight ?? 0;

  return (
    <Link
      to={`/rooms/${room?._id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="relative block max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
    >
      {/* Image */}
      <img
        src={image}
        alt={`${hotelName} room`}
        className="w-full h-56 object-cover"
      />

      {/* Badge */}
      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
          Best Seller
        </p>
      )}

      {/* Content */}
      <div className="p-4 pt-5">
        {/* Top row: name + rating */}
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-medium text-gray-800">
            {hotelName}
          </p>
          <div className="flex items-center gap-1">
            <img
              src={assets.starIconFilled}
              alt="star-icon"
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">4.5</span>
          </div>
        </div>

        {/* Address */}
        <div className="mt-2 flex items-center gap-2">
          <img
            src={assets.locationIcon}
            alt="location-icon"
            className="h-4 w-4"
          />
          <span className="text-sm">{address}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-xl text-gray-800">${price}</span>
            <span className="text-gray-800">/night</span>
          </p>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
