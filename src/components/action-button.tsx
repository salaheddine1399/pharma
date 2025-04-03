import type React from "react"
interface ActionButtonProps {
  href: string
  children?: React.ReactNode
}

export default function ActionButton({ href, children = "Commencer" }: ActionButtonProps) {
  return (
    <a
      href={href}
      className="bg-[#3d8b78] text-white py-2 px-6 rounded-full hover:bg-[#367a69] transition-colors duration-200 block text-center"
    >
      {children}
    </a>
  )
}

