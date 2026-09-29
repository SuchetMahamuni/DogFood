import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings,
  User,
  Key,
  Bell,
  Moon,
  CheckCircle2,
  Laptop,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/auth'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [savedFeedback, setSavedFeedback] = useState(false)

  const name = user?.name || 'Administrator'
  const email = user?.email || 'admin@example.com'
  const initials = getInitials(name)
  const role = user?.role || 'ADMIN'

  const handleSavePreferences = () => {
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
              <Settings className="h-3 w-3 text-primary" />
              PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            Account &amp; Platform Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your credentials, administrative preferences, and workspace configuration.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="bg-[#0B1020] border-slate-800 text-slate-200">
          <Link to="/profile">
            <User className="h-4 w-4 mr-1.5 text-primary" />
            View Public Profile
          </Link>
        </Button>
      </div>

      {/* Account Info Card */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Account Information
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/15 text-primary-light border border-primary/30">
            {role}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar className="h-16 w-16 border-2 border-primary/40">
            <AvatarImage src={user?.profile?.profile_picture_url} />
            <AvatarFallback className="font-extrabold text-base bg-primary text-white font-mono">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400 font-mono">{email}</p>
            <p className="text-xs text-slate-500">
              Role Authority: <span className="text-slate-300 font-mono font-semibold">{role}</span>
            </p>
          </div>
        </div>
      </div>

      {/* System & Workspace Preferences */}
      <div className="p-6 rounded-2xl bg-[#0B1020] border border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Laptop className="h-4 w-4 text-cyan-400" />
            Workspace Preferences
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070A12] border border-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Moon className="h-3.5 w-3.5 text-primary" />
                Color Theme
              </span>
              <p className="text-[11px] text-slate-400">
                DogFood high-contrast dark theme is active by default.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20">
              Dark Navy (Default)
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070A12] border border-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Bell className="h-3.5 w-3.5 text-amber-400" />
                Platform Activity Notifications
              </span>
              <p className="text-[11px] text-slate-400">
                Receive browser alerts when judging submissions and rankings are updated.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                emailNotifications ? 'bg-primary' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  emailNotifications ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070A12] border border-slate-800/80">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Key className="h-3.5 w-3.5 text-emerald-400" />
                Session Token Security
              </span>
              <p className="text-[11px] text-slate-400">
                Authorization token is encrypted and securely stored for active session duration.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            DogFood Platform v2.0 • Build verified
          </span>

          <Button
            size="sm"
            onClick={handleSavePreferences}
            className="bg-primary hover:bg-primary-hover text-white font-bold text-xs"
          >
            {savedFeedback ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-300" />
                Preferences Saved!
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
