import type React from "react"
import { PlaceholdersAndVanishInput } from "./PlaceholdersAndVanishInput"

export default function PlaceholdersAndVanishInputCodesDemo() {
  const placeholders = [
    "How do these APIs retrieve master data for transactions?",
    "What are the possible transaction states?",
    "Which API provides service details?",
    "Just Type Ask Me",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
    window.open("https://notebooklm.google.com/notebook/51c6bfb1-107e-4eb7-a579-2311c9f4c738?authuser=7", "_blank")
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
