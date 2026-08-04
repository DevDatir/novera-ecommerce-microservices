import { useMutation } from "@tanstack/react-query";

import paymentService
from "../service/paymentService";

export const usePayment = () => {

    const createPaymentMutation =
        useMutation({

            mutationFn:
                paymentService.createPayment,

        });

    const verifyPaymentMutation =
        useMutation({

            mutationFn:
                paymentService.verifyPayment,

        });

    return {

        createPaymentMutation,

        verifyPaymentMutation,

    };

};