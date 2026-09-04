import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRegister } from "../../hooks/useRegister";
import { useAuth } from "../../contexts/AuthContexts";
import type { RegisterRequest } from "../../types/auth";
import shoeImage from "../../assets/novera_login_image.png";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

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
    } catch {
      toast.error("Registration failed. Check your details and try again.");
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
          <h2 className="font-display text-3xl text-ink-900">Create account</h2>

          <p className="text-ink-500 mt-3 mb-8">Create your account to start shopping.</p>

          <Input
            label="First name"
            {...register("firstName", { required: "First name is required" })}
            error={errors.firstName?.message}
          />

          <Input
            label="Last name"
            {...register("lastName", { required: "Last name is required" })}
            error={errors.lastName?.message}
          />

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

          <Button className="w-full mt-3" loading={registerMutation.isPending}>
            Create account
          </Button>

          <p className="text-center mt-8 text-ink-500">
            Already have an account?
            <Link to="/login" className="ml-2 text-primary-500 font-semibold hover:text-primary-600">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
