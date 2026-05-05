import { getServerSession } from 'next-auth';

// Re-export authOptions from the route handler to avoid circular imports
// Import these options wherever you need server-side auth
export async function getSession() {
  // Import dynamically to avoid circular dependency
  const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
  return await getServerSession(authOptions);
}

export async function getAuthUserId() {
  const session = await getSession();
  return session?.user?.id || null;
}
