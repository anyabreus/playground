import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Link href="/big-table">Big Table</Link>
      <Link href="/big-table-infinite-scroll">
        Big Table with infinite scroll
      </Link>
    </>
  );
}
