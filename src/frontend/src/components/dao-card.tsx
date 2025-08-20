import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "@/declarations/dao_canister/dao_canister.did"
import { Users, FileText } from "lucide-react"
import Link from "next/link"

export function DAOCard({ dao }: { dao: Metadata }) {
  return (
    <Link href={`/dao/${dao.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <img
                  src={dao.logo[0] || "/placeholder.png"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-card-foreground">{dao.name[0]}</CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="">
        </CardContent>
      </Card>
    </Link>
  )
}
