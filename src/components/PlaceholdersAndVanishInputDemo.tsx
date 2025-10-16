import type React from "react"
import { PlaceholdersAndVanishInput } from "./PlaceholdersAndVanishInput"
import { Sparkles } from "lucide-react"

interface PlaceholdersAndVanishInputDemoProps {
  notebookUrl?: string;
}

export default function PlaceholdersAndVanishInputDemo({ notebookUrl }: PlaceholdersAndVanishInputDemoProps) {
  const placeholders = [
    "What are the technical requirements to use Digit9 worldAPI?",
    "How do I get started with API integration?",
    "Mind Map?",
    "Explainer Videos?",
    "Just Type Ask Me",
  ]

  // Default URL if none provided
  const defaultUrl = "https://notebooklm.google.com/notebook/0f367524-0b51-46b5-906c-e4885c5e0678?authuser=5";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitted")
    window.open(notebookUrl || defaultUrl, "_blank")
  }

  return (
    <div className="flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-3">
          {/* AskPage Aurora Text - Left Side */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 dark:from-indigo-400 dark:via-purple-400 dark:to-sky-400 bg-clip-text text-transparent whitespace-nowrap">
              AskPage
            </span>
          </div>
          
          {/* Input Field */}
          <div className="flex-1">
            <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center italic">
        * Type. Ask. Submit. Powered by NotebookLM
      </p>
    </div>
  )
}

