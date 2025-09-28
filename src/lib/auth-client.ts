"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<{
      options: {
        user: {
          additionalFields: {
            role: {
              type: "string";
            };
          };
        };
      };
    }>(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
