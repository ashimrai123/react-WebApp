import Image from "next/image";
import Link from "next/link";
import ProductCard from "./components/ProductCard";
import DashBoard from "./components/dashboard/page";

export default function Home() {
  return (
    <main>
      <DashBoard />
      {/* <Link href="/components/users">Users</Link> */}
      {/* <ProductCard /> */}
    </main>
  );
}
