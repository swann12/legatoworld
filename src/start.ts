import { createStart, createMiddleware } from '@tanstack/react-start'
import { attachSupabaseAuth } from '@/integrations/supabase/auth-attacher'
import { getDiscovery, discoveryAllowsFunction } from '@/lib/discovery'

const discoveryBoundary = createMiddleware({ type: 'function' }).client(async ({ next }) => {
  const state = getDiscovery();
  if (!discoveryAllowsFunction(state, window.location.pathname)) throw new Error("En mode découverte, rien n'est envoyé. Créez votre espace pour utiliser ce service.");
  return next();
})

export const startInstance = createStart(() => ({
  functionMiddleware: [discoveryBoundary, attachSupabaseAuth],
}))