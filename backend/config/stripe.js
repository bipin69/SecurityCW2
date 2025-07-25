import Stripe from "stripe";

// TODO: Replace with process.env.STRIPE_SECRET_KEY in production
const stripe = new Stripe("sk_test_51RkrHLQsP0gioHTLkMeen6iJ8AmtBxcyXcrruYTYDYaZc0EZqFZMvSVMizWVWBSoGFK5D2fjsc3g068lRPyxm84L00IihV1NEv");

export default stripe; 