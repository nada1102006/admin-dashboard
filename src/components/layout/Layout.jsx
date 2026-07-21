import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className=" grid grid-cols-12 h-screen ">
      {/* side bar */}

      <div className="side-bar hidden md:flex  md:col-span-2 bg-white">
        <h1 className="text-center text-lg font-bold">side bar</h1>
      </div>

      {/* -------------------- */}

      {/* main content & nav bar */}

      <div className="nav flex flex-col  col-span-12 md:col-span-10">
        {/* nav bar */}

        <div className="bar bg-amber-50 py-6">
          <h1 className="text-center text-lg font-bold">nav bar</h1>
        </div>

        {/* main content */}

        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
