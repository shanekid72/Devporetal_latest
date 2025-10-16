import type React from "react"
import { PlaceholdersAndVanishInput } from "./PlaceholdersAndVanishInput"

export default function PlaceholdersAndVanishInputCustomerDemo() {
  const placeholders = [
    "What's the main process for electronic KYC onboarding?",
    "What does API 1 do?",
    "Which APIs need an access token?",
    "Just Type Ask Me",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
    window.open("https://notebooklm.google.com/notebook/c5073bf6-a045-4407-8c15-faba048be2fd?authuser=7", "_blank")
  }

  return (
    <div className="flex flex-col justify-center items-center px-4 py-8">
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center italic">
        * Type. Ask. Submit. Unlock the full AI experience.
      </p>
    </div>
  )
}
