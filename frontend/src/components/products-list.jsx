import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
export default function ProductsList() {
  const { products, toggleFeaturedProduct, deleteProduct } = useProductStore();
  return (
    <motion.div
      className="bg-gray-800 shadow-lg  w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Category</th>
            <th scope="col">Featured</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-600">
              <td>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white">
                      {product.name}
                    </p>
                  </div>
                </div>
              </td>

              <td>
                <p>{product?.price?.toFixed(2)}</p>
              </td>
              <td>
                <p>{product.category}</p>
              </td>
              <td>
                <button
                  className={`p-1 rounded-full ${
                    product.isFeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  }`}
                  onClick={() => toggleFeaturedProduct(product._id)}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
