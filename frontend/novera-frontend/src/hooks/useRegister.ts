import { useMutation } from "@tanstack/react-query";
import { register } from "../service/authService";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};