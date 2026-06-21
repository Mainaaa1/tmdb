'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, BadgeCheck, CircleAlert, Clapperboard, LockKeyhole, Mail, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login, register } from '@/lib/client-api';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('from') || '/dashboard';
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      await login(signInIdentifier, signInPassword);
      window.location.assign(returnTo);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
    } finally {
      setPending(false);
    }
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    setError('Account creation is disabled for this demo. Use the preset demo credentials instead.');
    setPending(false);
  }

  return (
    <Card className="overflow-hidden border-white/10 bg-black/50 shadow-2xl backdrop-blur-2xl">
      <CardHeader className="space-y-5 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50914] text-white shadow-glow">
            <Clapperboard className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <Badge className="border-white/10 bg-white/8 text-white">Secure account access</Badge>
            <CardTitle className="text-2xl text-white">Welcome to filamu</CardTitle>
            <CardDescription className="max-w-sm text-white/65">
              Demo mode only — sign in with the preset guest credentials below.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <Alert className="border-white/10 bg-white/[0.03] text-white">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E50914]" />
            <div>
              <AlertTitle className="text-sm text-white">Account data is stored locally</AlertTitle>
              <AlertDescription className="text-white/60">
                Passwords are hashed with scrypt and sessions are stored as signed, HttpOnly cookies.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-white/6 p-1">
            <TabsTrigger value="signin" className="rounded-lg text-sm">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg text-sm">
              Create account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <Alert className="border-white/10 bg-white/5 text-white/70">
              <AlertTitle className="text-sm text-white">Demo login</AlertTitle>
              <AlertDescription className="text-sm text-white/70">
                Use <strong>guest@example.com</strong> and <strong>StrongPass123</strong> to access the dashboard.
              </AlertDescription>
            </Alert>
            <form className="space-y-4" onSubmit={handleSignIn}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/75">Username or email</span>
                <div className="relative">
                  <UserPlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <Input
                    autoComplete="username"
                    name="identifier"
                    value={signInIdentifier}
                    onChange={(event) => setSignInIdentifier(event.target.value)}
                    placeholder="yourname or name@domain.com"
                    className="h-11 rounded-xl border-white/10 bg-black/35 pl-10 text-white placeholder:text-white/35"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/75">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <Input
                    autoComplete="current-password"
                    name="password"
                    type="password"
                    value={signInPassword}
                    onChange={(event) => setSignInPassword(event.target.value)}
                    placeholder="Your password"
                    className="h-11 rounded-xl border-white/10 bg-black/35 pl-10 text-white placeholder:text-white/35"
                  />
                </div>
              </label>

              {error ? (
                <Alert variant="destructive" className="border-red-400/20 bg-red-400/10 text-red-50">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <AlertTitle className="text-sm text-red-50">Could not sign in</AlertTitle>
                      <AlertDescription className="text-red-50/80">{error}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ) : null}

              <Separator />

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#E50914] text-white hover:bg-[#f6121d]"
                disabled={pending}
              >
                {pending ? 'Signing in...' : 'Enter dashboard'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Alert className="border-white/10 bg-white/5 text-white/70">
              <AlertTitle className="text-sm text-white">Demo account only</AlertTitle>
              <AlertDescription className="text-sm text-white/70">
                Account creation is disabled for this public demo. Please use the demo credentials to sign in.
              </AlertDescription>
            </Alert>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-white/70">
              Registration is disabled in the current demo mode to avoid exposing user data.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
