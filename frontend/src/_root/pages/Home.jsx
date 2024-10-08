import { CATEGORIES } from "../../constants";
import CategoryItem from "../../components/shared/category-item";

export default function Home() {
  return (
    <div className="relative text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore our categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          From classics to modern trends, find your perfect fit.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
