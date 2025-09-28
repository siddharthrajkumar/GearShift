import { Cog } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen">
        {/* Left side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

        {/* Right side - Welcome Section */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent" />
          <div className="absolute top-20 right-20 w-32 h-32 border border-gray-700 rounded-lg rotate-12 opacity-30" />
          <div className="absolute bottom-40 right-10 w-24 h-24 border border-gray-600 rounded-lg -rotate-12 opacity-20" />

          <div className="relative z-10 flex flex-col justify-center items-center p-12 max-w-md mx-auto text-center">
            {/* Logo */}
            <div className="mb-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Cog className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Welcome content */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Welcome to GearShift
              </h1>
              <p className="text-gray-300 leading-relaxed">
                GearShift is a digital platform designed for motorcycle garages
                to streamline daily operations by replacing traditional
                paper-based processes with efficient digital workflows.
              </p>
              <p className="text-sm text-gray-400">
                Join motorcycle garages who have already digitized their
                operations
              </p>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <h3 className="text-lg font-semibold mb-2">
                Ready to digitize your garage operations?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Transform your motorcycle garage with digital tools that
                eliminate paperwork and streamline your daily workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
