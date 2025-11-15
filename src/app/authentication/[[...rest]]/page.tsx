'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { Navbar } from '@/components/navbar';

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <SignIn />
      </div>
    </div>
  );
}

