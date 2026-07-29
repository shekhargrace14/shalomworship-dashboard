'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Toaster } from '../ui/sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AuthGoogle from './auth-google';

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast('Confirm Passwords do not match');

      return;
    }
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        toast(data.message);
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <AuthGoogle />
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />

            <span className="text-sm text-muted-foreground">or</span>

            <div className="h-px flex-1 bg-border" />
          </div>
        </FieldGroup>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="mt-8">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
              <FieldDescription>We&apos;ll use this to contact you. We will not share your email with anyone else.</FieldDescription>
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>

                <Input id="confirm-password" type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />
                <FieldDescription>Please confirm your password.</FieldDescription>
              </Field>
            </div>

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}

                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/auth/login">Login in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
