import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegister } from "../../hooks/useRegister";
import { useAuth } from "../../contexts/AuthContexts";
import type { RegisterRequest } from "../../types/auth";
import shoeImage from "../../assets/novera_login_image.png";
import Button from "../../components/ui/Button";


const RegisterPage = () => {
  const navigate = useNavigate();

  const { login: saveUser } = useAuth();

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const response = await registerMutation.mutateAsync(data);

      saveUser(response);

      navigate("/");
    } catch (error) {
      alert("Registration failed");
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
            Create Account
          </h2>

          <p className="text-gray-500 mt-3 mb-10">
            Create your account to start shopping.
          </p>

          {/* First Name */}

          <div className="mb-5">
            <label>First Name</label>

            <input
              {...register("firstName", {
                required: "First name is required",
              })}
              className="mt-2 w-full border rounded-xl p-4"
            />

            <p className="text-red-500 text-sm">
              {errors.firstName?.message}
            </p>
          </div>

          {/* Last Name */}

          <div className="mb-5">
            <label>Last Name</label>

            <input
              {...register("lastName", {
                required: "Last name is required",
              })}
              className="mt-2 w-full border rounded-xl p-4"
            />

            <p className="text-red-500 text-sm">
              {errors.lastName?.message}
            </p>
          </div>

          {/* Email */}

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

          {/* Password */}

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

          <Button loading={registerMutation.isPending}>
            Create Account
          </Button>

          <p className="text-center mt-8">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-blue-600 font-semibold"
            >
              Sign In
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default RegisterPage;