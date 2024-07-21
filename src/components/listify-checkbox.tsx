"use client"
 
import { Checkbox } from "./ui/checkbox"
import React from "react"

export type ListifyCheckBoxProps = { 
  label: string
  isChecked: boolean
  toggle: (isChecked: boolean) => void
}
 
export function ListifyCheckBox({ label, isChecked, toggle }: ListifyCheckBoxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={label.replace(' ', '')} checked={isChecked}/>
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  )
}