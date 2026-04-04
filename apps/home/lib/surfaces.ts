export type Surface = {
  name: string
  domain: string
  role: string
  href: string
  audience: string
  prominence: 'high' | 'medium' | 'low'
}

export const surfaces: Surface[] = [
  {
    name: 'Charter',
    domain: 'iai.one',
    role: 'Constitution, meaning, and trust root.',
    href: 'https://iai.one',
    audience: 'Everyone',
    prominence: 'medium',
  },
  {
    name: 'App',
    domain: 'app.iai.one',
    role: 'Community, learning, verification, and user activity.',
    href: 'https://app.iai.one',
    audience: 'Members and public users',
    prominence: 'high',
  },
  {
    name: 'Flow',
    domain: 'flow.iai.one',
    role: 'Workflow builder and execution product surface.',
    href: 'https://flow.iai.one',
    audience: 'Builders and operators',
    prominence: 'high',
  },
  {
    name: 'Docs',
    domain: 'docs.iai.one',
    role: 'Architecture, guides, specs, and documentation.',
    href: 'https://docs.iai.one',
    audience: 'Public and technical users',
    prominence: 'high',
  },
  {
    name: 'Developer',
    domain: 'developer.iai.one',
    role: 'Developer onboarding, APIs, and integrations.',
    href: 'https://developer.iai.one',
    audience: 'Developers',
    prominence: 'medium',
  },
  {
    name: 'Dashboard',
    domain: 'dash.iai.one',
    role: 'Operational and management surface.',
    href: 'https://dash.iai.one',
    audience: 'Operators and internal teams',
    prominence: 'medium',
  },
]

export const legacyCommunityHref = 'https://app.iai.one'
