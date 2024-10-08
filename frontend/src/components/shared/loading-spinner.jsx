import { Loader } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader className="w-10 text-green-500 h-10 animate-spin" />
    </div>
  );
}
