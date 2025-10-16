import type React from "react"
import { PlaceholdersAndVanishInput } from "./PlaceholdersAndVanishInput"

export default function PlaceholdersAndVanishInputRemittanceDemo() {
  const placeholders = [
    "What are the key steps & APIs for a full transaction lifecycle?",
    "How is a quote identifier used in transactions?",
    "What's the first step in processing a transaction?",
    "Just Type Ask Me",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
    window.open("https://notebooklm.google.com/notebook/30bf5a6e-362f-44c1-a939-461a6ad5002a?authuser=7", "_blank")
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
