import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <React.Fragment>
      <Head>
        <title>About - UPBITO</title>
      </Head>

      <div className="relative flex min-h-screen flex-col bg-background">
        <div className="w-full h-screen flex flex-col items-center justify-center px-4">
          <SiteHeader />

          <div className="flex-1 flex flex-col justify-center items-center w-full space-y-8">
            <div>
              <Image
                className="ml-auto mr-auto rounded-full"
                src="/images/dog.jpeg"
                alt="Dog image"
                width={256}
                height={256}
              />
            </div>

            <p className="text-2xl">
              This application UPBIT trade helper{" "}
              <a
                href="https://github.com/coyaSONG"
                target="_blank"
                rel="noreferrer"
              >
                <b className="text-[#ff9f68]">coyaSONG</b>
              </a>
            </p>

            <ol className="text-center text-2xl">
              <li className="font-bold">
                <a
                  href="https://github.com/saltyshiomix/nextron"
                  target="_blank"
                  rel="noreferrer"
                >
                  ⚡ Nextron ⚡
                </a>
              </li>
            </ol>

            <div className="grid grid-cols-2 gap-6">
              <Link href="/home" className={buttonVariants()}>
                Back To Home Page
              </Link>

              <a
                href="https://github.com/coyaSONG/upbito"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "secondary",
                })}
              >
                Go To This Repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
