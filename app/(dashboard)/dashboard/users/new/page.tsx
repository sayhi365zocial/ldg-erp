import { UserForm } from "@/components/users/user-form"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add User</h1>
        <p className="text-muted-foreground">
          Create a new user account
        </p>
      </div>

      <UserForm />
    </div>
  )
}
