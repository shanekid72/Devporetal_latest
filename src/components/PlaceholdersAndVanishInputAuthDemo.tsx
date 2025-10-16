import type React from "react"
import { PlaceholdersAndVanishInput } from "./PlaceholdersAndVanishInput"

export default function PlaceholdersAndVanishInputAuthDemo() {
  const placeholders = [
    "How does Digit9 API secure access?",
    "What payload fields are required?",
    "How do I gain DPS API access?",
    "Just Type Ask Me",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
    window.open("https://notebooklm.google.com/notebook/3bd02d69-f3b5-4c91-9a7c-35180f7893c8?authuser=7", "_blank")
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
