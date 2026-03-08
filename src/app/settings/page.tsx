'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userProfile } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [profile, setProfile] = useState(userProfile);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('Settings saved', {
      description: 'Your profile preferences have been updated.',
    });
  }

  function toggleNotif(key: keyof typeof profile.notifications) {
    setProfile((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  }

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your account and preferences" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
        {/* Profile */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Profile</CardTitle>
            <CardDescription className="text-xs">Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500 text-xl font-bold text-white">
                {profile.avatarInitials}
              </div>
              <div>
                <p className="text-sm font-medium">{profile.name}</p>
                <Badge variant="secondary" className="mt-1 text-[10px]">{profile.role}</Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Preferences</CardTitle>
            <CardDescription className="text-xs">Localization and display settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Language</Label>
                <Select
                  value={profile.language}
                  onValueChange={(v) => setProfile((p) => ({ ...p, language: v }))}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Ukrainian">Ukrainian</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Timezone</Label>
                <Select
                  value={profile.timezone}
                  onValueChange={(v) => setProfile((p) => ({ ...p, timezone: v }))}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+2 (Europe/Kyiv)">UTC+2 (Europe/Kyiv)</SelectItem>
                    <SelectItem value="UTC+0 (London)">UTC+0 (London)</SelectItem>
                    <SelectItem value="UTC-5 (New York)">UTC-5 (New York)</SelectItem>
                    <SelectItem value="UTC-8 (Los Angeles)">UTC-8 (Los Angeles)</SelectItem>
                    <SelectItem value="UTC+1 (Berlin)">UTC+1 (Berlin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
            <CardDescription className="text-xs">Choose how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push notifications', desc: 'Browser push notifications' },
                { key: 'weekly', label: 'Weekly digest', desc: 'Summary email every Monday' },
              ] as const
            ).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    profile.notifications[key] ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      profile.notifications[key] ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleSave} className="w-28">
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
          {saved && <p className="text-xs text-emerald-500">Settings saved successfully.</p>}
        </div>
      </main>
    </>
  );
}
