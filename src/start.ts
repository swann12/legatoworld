import { createStart, createMiddleware } from '@tanstack/react-start'
import { attachSupabaseAuth } from '@/integrations/supabase/auth-attacher'
import { getDiscovery } from '@/lib/discovery'

const discoveryBoundary = createMiddleware({ type: 'function' }).client(async ({ next }) => {
  const state = getDiscovery();
  if (state.active && !state.pending) throw new Error("En mode découverte, rien n'est envoyé. Créez votre espace pour utiliser ce service.");
  // Only the explicit account flow may send the private archive after sign-in.
  if (state.active && state.pending && !/^\/(auth|start)/.test(window.location.pathname)) throw new Error("Ce service nécessite votre compte. Vos contenus restent sur ce téléphone.");
  return next();
})

export const startInstance = createStart(() => ({
  functionMiddleware: [discoveryBoundary, attachSupabaseAuth],
}))