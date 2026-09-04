import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../contexts/AuthContexts";
import type { LoginRequest } from "../../types/auth";
import shoeImage from "../../assets/novera_login_image.png";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login: saveUser } = useAuth();

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await loginMutation.mutateAsync(data);

      saveUser(response);

      navigate("/");
    } catch {
      toast.error("Invalid email or password. Check your details and try again.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT */}
      <div
        className="hidden lg:flex bg-cover bg-center relative"
        style={{ backgroundImage: `url(${shoeImage})` }}
      >
        <div className="absolute inset-0 bg-ink-900/60" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h1 className="font-display text-5xl">NOVERA</h1>
          <p className="mt-6 text-xl max-w-md leading-8 text-white/85">
            Premium footwear designed for every journey.
            Move better. Feel better.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex justify-center items-center px-6 sm:px-8 py-16">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
          <h2 className="font-display text-3xl text-ink-900">Welcome back</h2>

          <p className="text-ink-500 mt-3 mb-8">Sign in to continue shopping.</p>

          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />

          <Button className="w-full mt-3" loading={loginMutation.isPending}>
            Sign in
          </Button>

          <p className="text-center mt-8 text-ink-500">
            Don't have an account?
            <Link to="/register" className="ml-2 text-primary-500 font-semibold hover:text-primary-600">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
