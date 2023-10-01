import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/">Clique Me</UserButton>
    </div>
  )
}
