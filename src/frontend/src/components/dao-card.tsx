import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText } from "lucide-react"
import Link from "next/link"

interface DAOCardProps {
  dao: {
    id: string
    name: string
    description: string
    logo: string
    memberCount: number
    proposalCount: number
  }
}

export function DAOCard({ dao }: DAOCardProps) {
  return (
    <Link href={`/dao/${dao.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <img
                  src={dao.logo || "/placeholder.svg"}
                  alt={`${dao.name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(dao.name + " logo")}`
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-card-foreground">{dao.name}</CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-muted-foreground line-clamp-2">{dao.description}</CardDescription>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-card-foreground">{dao.memberCount}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-card-foreground">{dao.proposalCount}</p>
                <p className="text-xs text-muted-foreground">Proposals</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
