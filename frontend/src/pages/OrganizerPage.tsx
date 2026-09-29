import { Calendar, Scale, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

const sections = [
  { label: 'Events',  href: '/events',  icon: Calendar, description: 'Manage your hackathon events' },
  { label: 'Teams',   href: '/teams',   icon: Users,    description: 'Review participant teams' },
  { label: 'Judging', href: '/judging', icon: Scale,    description: 'Configure judging rubrics' },
  { label: 'Results', href: '/results', icon: Trophy,   description: 'Publish final standings' },
]

export default function OrganizerPage() {
  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Organizer Hub"
          description="Manage events, teams, judging, and results from one place."
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="accent">Organizer</Badge>
              <Button size="sm">New event</Button>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map(({ label, href, icon: Icon, description }) => (
            <Link key={href} to={href} className="block">
              <Card className="card-lift h-full">
                <CardHeader className="pb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-indigo mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
