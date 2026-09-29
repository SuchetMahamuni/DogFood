import { Scale } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'

export default function JudgePage() {
  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="Judging"
          description="Review and score your assigned project submissions."
          actions={<Badge variant="warning">Judge view</Badge>}
        />
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-xl bg-muted/30">
          <Scale className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No assignments yet</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Your assigned projects and scoring rubrics will appear here once judging begins.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
