import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('[v0] Signup error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = data.user;

    // Create user profile in database
    const { error: profileError } = await supabase.from('users').insert({
      id: user.id,
      email,
      name,
      bio: '',
      rating: 5.0,
      reviews_count: 0,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    });

    if (profileError) {
      console.error('[v0] Profile creation error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user profile' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[v0] User signed up successfully:', email);
    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[v0] API signup error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Signup failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
