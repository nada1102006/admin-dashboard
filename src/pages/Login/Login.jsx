import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./login.css";
import KodaLogo from "../../assets/images/KodaLogo2.png";
import googleLogo from "../../assets/images/Logo-google-icon-PNG.png";
import { FiShoppingBag } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { useState } from "react";
import api from "../../api/api.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { LuLoaderCircle } from "react-icons/lu";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "admin@gmail.com",
    password: "admin1212",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await api.post("auth/login", credentials);
      if (response.data.success) {
        const admin = response.data;
        localStorage.setItem("userToken", JSON.stringify(admin.token));

        toast.info("Logged in successfully");
        setTimeout(() => {
          const x = navigate("/dashboard");
          return () => clearTimeout(x);
        }, 2500);
      }
    } catch (error) {
      toast.error("Login credentials are incorrect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login relative min-h-[100vh]">
      {/* زر تبديل الوضع المظلم */}
      <ThemeToggle />
      <div className="mx-auto py-20 min-[500px]:py-24  min-[1024px]:py-30 px-0 min-[500px]:px-8 min-[800px]:px-20">
        <ToastContainer
          position="top-center"
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          className=""
        />
        <div>
          {/* الخلفيات الضبابية */}
          <div className="absolute top-0 left-0 h-full w-[35%]  min-[500px]:w-72 bg-blue-500/30 min-[500px]:bg-blue-500/20 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 h-full w-[35%] min-[500px]:w-72 bg-cyan-500/30 min-[500px]:bg-cyan-500/20 blur-[120px]"></div>

          {/* البطاقة الرئيسية */}
          <div className="loginMain flex justify-center items-center mx-auto w-[90%] min-[270px]:w-[80%] min-[500px]:w-[90%] min-[630px]:w-[80%] min-[800px]:w-[80%] min-[850px]:w-[75%] min-[900px]:w-[70%] min-[950px]:w-[65%] min-[1024px]:w-full">
            <div className="w-full shadow-xs shadow-sky-100 grid overflow-hidden rounded-2xl min-[500px]:rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl grid-cols-1 lg:grid-cols-2">
              {/* الجانب الأيسر - المعلومات */}
              <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                <div className="max-w-md">
                  <div className="mb-6 flex items-center gap-3">
                    <FiShoppingBag className="text-[32px] min-[1200px]:text-[40px]" />
                    <h2 className=" text-3xl font-bold">Koda Commerce</h2>
                  </div>
                  <h1 className="text-4xl min-[1200px]:text-5xl font-bold leading-tight">
                    Manage Your Store Like a Pro
                  </h1>
                  <p className="mt-6 text-lg text-white/90">
                    Control products, orders, users, carts and analytics from a
                    modern dashboard experience.
                  </p>
                  <div className="mt-10 space-y-4">
                    <div className="rounded-2xl bg-white/10 p-4  backdrop-blur flex items-center gap-1.5 ">
                      <FaCheck /> Product Management
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur flex items-center gap-1.5">
                      <FaCheck /> Order Tracking
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur flex items-center gap-1.5">
                      <FaCheck /> Customer Insights
                    </div>
                  </div>
                </div>
              </div>

              {/* الجانب الأيمن - نموذج تسجيل الدخول */}
              <div className="flex items-center justify-center px-4 py-3 min-[430px]:px-8 min-[500px]:py-8 min-[800px]:py-6 min-[1024px]:py-10 min-[1024px]:px-10">
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-md mt-6 min-[1024px]:mt-0"
                >
                  <div className="mb-8 text-center">
                    <img
                      src={KodaLogo}
                      alt="Koda Logo"
                      className="mx-auto h-12 min-[270px]:h-14 min-[500px]:h-[75px] min-[750px]:h-[85px] min-[850px]:h-[90px] min-[1024px]:h-24 w-auto  dark:brightness-90 "
                    />
                    <h2 className="mt-2 min-[1024px]:mt-4 text-lg min-[500px]:text-2xl  min-[600px]:text-3xl font-bold text-slate-900 dark:text-white">
                      Welcome Back
                    </h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs min-[500px]:text-[16px]">
                      Sign in to your admin dashboard
                    </p>
                  </div>

                  {/* حقل البريد الإلكتروني */}
                  <div className="mb-5">
                    <label className="mb-2 block text-xs min-[500px]:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <MdOutlineEmail className="absolute left-2.5 min-[500px]:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm min-[500px]:text-xl" />
                      <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="text-xs min-[500px]:text-[16px] w-full rounded-lg min-[500px]:rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 min-[500px]:py-3 pl-7 min-[500px]:pl-11 pr-2 min-[500px]:pr-4 text-slate-900 dark:text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        required
                      />
                    </div>
                  </div>

                  {/* حقل كلمة المرور */}
                  <div className="mb-6">
                    <label className="mb-2 block text-xs min-[500px]:text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <IoLockClosedOutline className="absolute left-2.5 min-[500px]:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm min-[500px]:text-xl" />
                      <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="text-xs min-[500px]:text-[16px] w-full rounded-lg min-[500px]:rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 min-[500px]:py-3 pl-7 min-[500px]:pl-11 pr-2 min-[500px]:pr-4 text-slate-900 dark:text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                        required
                      />
                    </div>
                  </div>

                  {/* زر تسجيل الدخول */}
                  <button
                    disabled={loading}
                    className="cursor-pointer relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-2 min-[500px]:px-5 py-1.5 min-[500px]:py-3 text-xs min-[500px]:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 select-none bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-400 hover:shadow-[0_0_28px_rgba(6,182,212,0.35)] dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] w-full rounded-2xl text-base font-semibold"
                    type="submit"
                  >
                    {loading ? (
                      <div className="flex gap-2 items-center justify-center">
                        <LuLoaderCircle className="animate-spin text-lg" />
                        <span>Sign In...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>

                  {/* الفاصل */}
                  <div className="my-6 flex items-center">
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
                    <span className="px-4 text-xs min-[500px]:text-sm text-slate-500">
                      OR
                    </span>
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
                  </div>

                  {/* زر Google */}
                  <a
                    href="https://google.com"
                    target="_blank"
                    className="text-[11px] min-[500px]:text-[16px] flex w-full items-center justify-center gap-1 min-[500px]:gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 min-[500px]:px-0 py-2.5 min-[500px]:py-3 font-medium text-slate-700 dark:text-slate-200 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] dark:hover:bg-slate-700"
                  >
                    <img
                      src={googleLogo}
                      alt="google"
                      className="h-4 w-4  min-[500px]:h-5 min-[500px]:w-5"
                    />
                    Continue with Google
                  </a>

                  <p className="mt-5 mb-2 min-[500px]:mt-8 text-center text-xs min-[500px]:text-sm text-slate-500">
                    Secure Admin Access
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
