import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const AuthGoogle = () => {
  const router = useRouter();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: credentialResponse.credential,
            }),
          });

          const data = await res.json();

          if (!data.success) {
            toast.error(data.message);
            return;
          }

          toast.success(data.message);

          router.refresh();
          router.push('/dashboard');
        } catch (error) {
          toast.error('Something went wrong');
        }
      }}
      onError={() => {
        toast.error('Google Login Failed');
      }}
      text="continue_with"
    />
  );
};

export default AuthGoogle;
