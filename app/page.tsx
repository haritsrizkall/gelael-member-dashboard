import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gelael Member Dashboard",
  description: "Gelael Member Dashboard",
  // other metadata
};

export default function Home() {
  redirect("/dashboard");
  return (
    <>
      
    </>
  );
}
