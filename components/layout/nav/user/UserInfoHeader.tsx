type UserInfoHeaderProps = {
  firstName: string;
  lastName: string;
  email: string
}

export const UserInfoHeader = ({ firstName, lastName, email }: UserInfoHeaderProps) => (
  <div className="p-4 bg-surface border-b border-border-light">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-serif font-semibold">
        {firstName.charAt(0)}{lastName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary truncate">
          {firstName} {lastName}
        </p>
        <p className="text-sm text-border-dark truncate">
          {email}
        </p>
      </div>
    </div>
  </div>
)