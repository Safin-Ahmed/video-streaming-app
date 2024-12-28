import { authConfig } from "@/amplify-cognito-config";
import { Amplify } from "aws-amplify";
import {
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";
import { redirect } from "next/navigation";

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true }
);

export async function handleSignUp(formData: any) {
  try {
    const { nextStep, isSignUpComplete } = await signUp({
      username: String(formData.email),
      password: String(formData.password),
      options: {
        userAttributes: {
          email: String(formData.email),
        },
      },
    });

    return { nextStep, isSignUpComplete };
  } catch (error) {
    console.error("error during sign up", error);
  }
}

export async function handleVerificationCode(formData: any) {
  try {
    await resendSignUpCode({
      username: String(formData.email),
    });

    return { message: "Code sent successfully" };
  } catch (error) {
    console.error("Error during resend code: ", error);
    return { message: error };
  }
}

export async function handleConfirmSignUp(formData: any) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: String(formData.email),
      confirmationCode: String(formData.code),
    });

    return { isSignUpComplete, nextStep };
  } catch (error) {
    console.log(error);
    console.error("Error during confirm signup", error);
  }
}

export async function handleSignIn(formData: any) {
  try {
    const result = await signIn({
      username: String(formData.email),
      password: String(formData.password),
    });

    console.log({ result });

    if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.email),
      });
    } else {
      // Retrieve tokens after successful sign-in
      const session = await fetchAuthSession({ forceRefresh: true });

      const idToken = session.tokens?.idToken;
      const accessToken = session.tokens?.accessToken;
      const jwtToken = accessToken?.toString();

      return { idToken, accessToken, jwtToken };
    }
  } catch (err) {
    console.error("Error during login", err);
  }
}

export async function handleSignOut() {
  try {
    await signOut({ global: true });
  } catch (error) {
    console.error("Error during signout", error);
  }
}
