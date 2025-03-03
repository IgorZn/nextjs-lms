import { SignInButton, SignOutButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className={'flex flex-row gap-4'}>
      <SignInButton />
      <SignOutButton />
    </div>
  )
}
