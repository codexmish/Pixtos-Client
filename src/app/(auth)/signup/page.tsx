import SignupForm from "@/components/form/SignupForm";
import Image from "next/image";
import React from "react";

const SignupPage = () => {
  return (
    <div className="w-full bg-white h-screen rounded-[30px] sm:rounded-[38px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-160 lg:min-h-180">
      {/* -------banner */}
      <div className="relative lg:col-span-6 p-2 sm:p-3 flex flex-col">
        <div className="relative size-full rounded-[26px] sm:rounded-4xl overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white bg-black">
          <Image
            src={"/login_ribbon.png"}
            alt="Pixtos banner"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black" />
          <div className="relative z-10 mt-auto pt-24 sm:pt-32">
            <h2 className="text-4xl">Pixtos</h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm mt-4 sm:mt-5">
              Safely store and organize your HD photos and videos
            </p>
          </div>
        </div>
      </div>
      {/* -----form */}
      <div className="lg:col-span-6 bg-white px-8 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 flex flex-col justify-between">
        {/* ----logo */}
        <Image
          src={"/logo.png"}
          alt="logo"
          width={16}
          height={20}
          className="h-16 xl:h-20 xl:mt-10 w-auto object-contain"
        />
        {/* ----heading */}
        <div className="max-w-md w-full mx-auto my-auto py-2">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 font-normal tracking-tight">
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Join Pixtos to organize your album
            </p>
          </div>

          {/* ----form component */}
          <SignupForm/>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
