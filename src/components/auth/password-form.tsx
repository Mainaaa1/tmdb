'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CircleAlert, KeyRound, LockKeyhole } from 'lucide-react';
import { changePassword } from '@/lib/client-api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function PasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccess('Password updated. Please sign in again with your new password.');
      router.replace('/login');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to change password.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="overflow-hidden border-white/10 bg-black/50 shadow-2xl">
      <CardHeader className="space-y-3 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E50914] text-white shadow-glow">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-white">Change password</CardTitle>
            <CardDescription className="text-white/60">
              Update your account credentials and revoke active sessions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/75">Current password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                type="password"
                className="h-11 rounded-xl border-white/10 bg-black/35 pl-10 text-white placeholder:text-white/35"
                placeholder="Current password"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/75">New password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                className="h-11 rounded-xl border-white/10 bg-black/35 pl-10 text-white placeholder:text-white/35"
                placeholder="At least 10 characters, upper/lower/number"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/75">Confirm new password</span>
            <Input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              className="h-11 rounded-xl border-white/10 bg-black/35 text-white placeholder:text-white/35"
              placeholder="Repeat the new password"
            />
          </label>

          {error ? (
            <Alert variant="destructive" className="border-red-400/20 bg-red-400/10 text-red-50">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <AlertTitle className="text-sm text-red-50">Could not update password</AlertTitle>
                  <AlertDescription className="text-red-50/80">{error}</AlertDescription>
                </div>
              </div>
            </Alert>
          ) : null}

          {success ? (
            <Alert className="border-emerald-400/20 bg-emerald-400/10 text-emerald-50">
              <AlertTitle className="text-sm text-emerald-50">Password updated</AlertTitle>
              <AlertDescription className="text-emerald-50/80">{success}</AlertDescription>
            </Alert>
          ) : null}

          <Separator />

          <Button type="submit" className="h-11 w-full rounded-xl bg-[#E50914] text-white hover:bg-[#f6121d]" disabled={pending}>
            {pending ? 'Updating password...' : 'Save new password'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
