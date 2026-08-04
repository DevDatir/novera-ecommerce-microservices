import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../contexts/AuthContexts";
import type { LoginRequest } from "../../types/auth";
import shoeImage from "../../assets/novera_login_image.png";
import Button from "../../components/ui/Button";

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
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT */}

      <div
        className="hidden lg:flex bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${shoeImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">

          <h1 className="text-6xl font-bold">
            NOVERA
          </h1>

          <p className="mt-6 text-xl max-w-md leading-8">
            Premium footwear designed for every journey.
            Move better. Feel better.
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex justify-center items-center px-8">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md"
        >

          <h2 className="text-4xl font-bold">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-3 mb-10">
            Login to continue shopping.
          </p>

          <div className="mb-5">

            <label>Email</label>

            <input
              {...register("email", {
                required: "Email is required",
              })}
              className="mt-2 w-full border rounded-xl p-4"
            />

            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>

          </div>

          <div className="mb-8">

            <label>Password</label>

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="mt-2 w-full border rounded-xl p-4"
            />

            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>

          </div>

          <Button loading={loginMutation.isPending}>
            Sign In
          </Button>

          <p className="text-center mt-8">

            Don't have an account?

            <Link
              to="/register"
              className="ml-2 text-blue-600 font-semibold"
            >
              Register
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default LoginPage;