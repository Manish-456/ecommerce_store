import React from "react";

export default function InputField({
  onChange,
  value,
  type = "text",
  name,
  label,
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {name === "description" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows="3"
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
          required
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      )}
    </div>
  );
}
