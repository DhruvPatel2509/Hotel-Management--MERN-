// src/pages/Hotelreg.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const initialForm = {
  name: "",
  address: "",
  contact: "",
  city: "",
};

const Hotelreg = () => {
  const { axios, getToken, navigate } = useAppContext();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Hotel name is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.contact.trim()) return "Contact is required";
    const phone = form.contact.replace(/\s+/g, "");
    if (!/^\+?\d{7,15}$/.test(phone)) return "Enter a valid phone number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      const token = await getToken();
      const res = await axios.post(
        `/api/hotels/register`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);

      toast.success("Hotel registered successfully ✅");
      setForm(initialForm);
      //   navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 mb-30  flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 text-center">
          🏨 Register Your Hotel
        </h2>
        <p className="mt-1 text-center text-slate-500 dark:text-slate-400">
          Add your hotel details to get started
        </p>

        {/* Hotel Name */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Hotel Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="My Test Hotel"
            className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none ring-0 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            placeholder="Mumbai 400001"
            className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Contact
          </label>
          <input
            type="tel"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="+91 9876543210"
            className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add country code if possible.
          </p>
        </div>

        {/* City */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            City
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Mumbai"
            className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white font-semibold py-3 transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Register Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Hotelreg;
