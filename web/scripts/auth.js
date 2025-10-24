import { supabase } from "./supabaseClient.js";

export async function signInWithPassword({ email, password }) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

export async function signUpWithProfile({
  email,
  password,
  fullName,
  gradYear,
  program,
}) {
  const metadata = {
    full_name: fullName,
  };

  if (gradYear) {
    metadata.grad_year = gradYear;
  }
  if (program) {
    metadata.program = program;
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
    },
  });

  if (error) {
    throw error;
  }
  return data;
}

export async function sendPasswordResetEmail(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${window.location.pathname}`,
  });
  if (error) {
    throw error;
  }
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function fetchCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }
  return user;
}
