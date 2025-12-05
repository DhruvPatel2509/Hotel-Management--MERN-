// src/pages/RoomAdd.jsx
import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite", "Family", "Dorm"];

const AMENITIES = [
  "Free WiFi",
  "Free Breakfast",
  "Room Service",
  "Mountain View",
  "Pool Access",
];

const AddRoom = () => {
  const { axios, getToken, navigate } = useAppContext();

  const [roomType, setRoomType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("0");
  const [amenities, setAmenities] = useState([]);
  const [files, setFiles] = useState([null, null, null, null]); // 4 tiles
  const [loading, setLoading] = useState(false);

  // preview URLs
  const previews = useMemo(
    () => files.map((f) => (f ? URL.createObjectURL(f) : null)),
    [files]
  );

  const toggleAmenity = (value) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    );
  };

  const onPickFile = (index) => (e) => {
    const file = e.target.files?.[0] || null;
    setFiles((arr) => {
      const copy = [...arr];
      copy[index] = file;
      return copy;
    });
  };

  const removeFile = (index) => {
    setFiles((arr) => {
      const copy = [...arr];
      copy[index] = null;
      return copy;
    });
  };

  const validate = () => {
    if (!roomType) return "Please select a room type";
    const price = Number(pricePerNight);
    if (Number.isNaN(price) || price < 0) return "Enter a valid price";
    if (!files.some(Boolean)) return "Please upload at least one image";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("roomType", roomType);
      fd.append("pricePerNight", String(Number(pricePerNight)));
      fd.append("amenities", JSON.stringify(amenities));
      files.forEach((f) => {
        if (f) fd.append("images", f); // multer field name
      });

      const token = await getToken();
      const response = await axios.post("/api/rooms", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      toast.success("Room created successfully");
      // reset
      setRoomType("");
      setPricePerNight("0");
      setAmenities([]);
      setFiles([null, null, null, null]);
    //   navigate(-1); // go back, or navigate("/owner/rooms")
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
          Add Room
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
          Fill in the details carefully and accurate room details, pricing, and
          amenities, to enhance the user booking experience.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 sm:p-8"
        >
          {/* Images */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Images
            </h3>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <label
                  key={i}
                  className="group relative flex aspect-video items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer overflow-hidden"
                >
                  {/* Preview */}
                  {previews[i] ? (
                    <>
                      <img
                        src={previews[i]}
                        alt={`room ${i + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="absolute top-2 right-2 rounded-lg bg-black/60 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500 dark:text-slate-300">
                      <CloudIcon className="w-8 h-8" />
                      <span className="mt-1 text-sm">Upload</span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={onPickFile(i)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Room type & price */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room Type</option>
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Price <span className="text-slate-400">/night</span>
              </label>
              <input
                type="number"
                min="0"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                className="mt-2 w-40 sm:w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Amenities
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AMENITIES.map((a) => (
                <label
                  key={a}
                  className="inline-flex items-center gap-3 text-slate-700 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    checked={amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CloudIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7 18h10a4 4 0 0 0 0-8h-.5A5.5 5.5 0 0 0 6 9.5V10a4 4 0 0 0 1 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity=".7"
    />
    <path
      d="M12 8v8m0 0 3-3m-3 3-3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AddRoom;
