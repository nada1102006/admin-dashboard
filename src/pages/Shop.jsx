import Header from "./Header";
import Footer from "./Footr";

export default function Shop() {
  return (
    <>
    <Header />
    <div className="bg-white text-black dark:bg-black dark:text-white">
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-slate-800">
        OSAMA TASK
      </h1>
    </div>
    </div>
    <Footer />
    </>
  );
}
// export default Shop ;