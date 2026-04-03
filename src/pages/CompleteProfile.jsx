import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

function CompleteProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    classLevel: "",
    batch: "",
    targetYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { phone, classLevel, batch } = form;
    if (!phone || !classLevel || !batch) {
      return handleError("Please fill all required fields.");
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE}/users/complete-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        // Update localStorage with the fresh full user object
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("currentStudent", JSON.stringify(result.user));

        handleSuccess("Profile complete! Welcome to HybridX 🎉");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        handleError(result.message || "Something went wrong");
      }
    } catch (err) {
      handleError("Failed to save profile. Try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form
          className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Just a few more details before we get you started.
          </p>

          <label className="text-white text-sm">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            placeholder="e.g. 9876543210"
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <label className="text-white text-sm">Class</label>
          <select
            name="classLevel"
            value={form.classLevel}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          >
            <option value="">Select Class</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
            <option value="Dropper">Dropper</option>
          </select>

          <label className="text-white text-sm">Stream</label>
          <select
            name="batch"
            value={form.batch}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded bg-slate-700 text-white"
          >
            <option value="">Select Stream</option>
            <option value="Batch 1">Engineering (JEE)</option>
            <option value="Batch 2">Medical (NEET)</option>
          </select>

          <label className="text-white text-sm">Target Year (optional)</label>
          <input
            name="targetYear"
            value={form.targetYear}
            onChange={handleChange}
            type="number"
            placeholder={new Date().getFullYear() + 1}
            className="w-full mb-6 px-4 py-3 rounded bg-slate-700 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-colors"
          >
            Save & Continue
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default CompleteProfile;
