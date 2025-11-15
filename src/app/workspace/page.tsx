'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/workspace/projects');
  }, [router]);

  return null;
}

