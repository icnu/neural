'use client'

import { Header } from "@/components/header"
import { DAOCard } from "@/components/dao-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { createActor as createHubActor } from "@/declarations/hub_canister"
import { createActor as createDaoActor } from "@/declarations/dao_canister"
import { Metadata } from "@/declarations/dao_canister/dao_canister.did"
import { useEffect, useState } from "react"

async function listDAOs(): Promise<Metadata[]> {
  const hub = createHubActor(process.env.NEXT_PUBLIC_CANISTER_ID_HUB_CANISTER!, { agentOptions: { host: 'http://localhost:4943', verifyQuerySignatures: false, shouldFetchRootKey: false } });
  const daos = await hub.list_daos();

  let metadataArr: Metadata[] = [];
  for ( const dao of daos ) {
    console.log(dao.toString());
    const metadata = await createDaoActor(dao, { agentOptions: { host: 'http://localhost:4943', verifyQuerySignatures: false, shouldFetchRootKey: false } }).get_metadata();
    if ( metadata.name[0] ) metadataArr.push(metadata);
  }

  return metadataArr;
}

export default function HomePage() {
  const [daos, setDAOs] = useState<Metadata[]>([]);

  useEffect(() => {
    listDAOs().then(v => setDAOs(v))
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Active DAOs</h1>
              <p className="text-muted-foreground mt-2">
                Manage and participate in your decentralized autonomous organizations
              </p>
            </div>
            <Link href="/create-dao">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Create DAO
              </Button>
            </Link>
          </div>

          {daos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daos.map((dao) => (
                <DAOCard key={dao.id} dao={dao} />
              ))}
            </div>
          ) : (
            <></>
            // <div className="text-center py-12">
            //   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            //     <Plus className="w-8 h-8 text-muted-foreground" />
            //   </div>
            //   <h3 className="text-lg font-semibold text-foreground mb-2">No DAOs Found</h3>
            //   <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            //     You're not a member of any DAOs yet. Create your first DAO or join an existing one to get started.
            //   </p>
            //   <Link href="/create-dao">
            //     <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            //       <Plus className="w-4 h-4 mr-2" />
            //       Create Your First DAO
            //     </Button>
            //   </Link>
            // </div>
          )}
        </div>
      </main>
    </div>
  )
}
