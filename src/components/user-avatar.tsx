interface UserAvatarProps {
  initials: string
}

export default function UserAvatar({ initials }: UserAvatarProps) {
  return (
    <div className="bg-[#5aadff] rounded-full h-10 w-10 flex items-center justify-center">
      <span className="font-semibold">{initials}</span>
    </div>
  )
}

