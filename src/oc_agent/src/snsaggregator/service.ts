const AGGREGATOR_PAGE_SIZE = 10;
const SNS_AGGREGATOR_CANISTER_URL = 'https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io';
const AGGREGATOR_CANISTER_VERSION = 'v1';
const AGGREGATOR_URL = `${SNS_AGGREGATOR_CANISTER_URL}/${AGGREGATOR_CANISTER_VERSION}/sns`;

export type SnsMetadata = {
    name: string,
    logo: string,
    governance_canister_id: string,
    root_canister_id: string,
};

export class SnsAggregatorServiceClass {
    private _metadataStore: Map<string, SnsMetadata>;

    constructor() {
        this._metadataStore = new Map();
    }

    async init() {
        const data = await this._fetchSNSMetadata();
        console.log(`Fetched ${data.length} SNSes data successfully`);

        data.map(d => {
            this._metadataStore.set(d.name.toLowerCase(), d);
        });
    }

    resolveSnsByName(name: string): SnsMetadata | undefined {
        return this._metadataStore.get(name.toLowerCase());
    }

    private async _fetchSNSMetadata(page: number = 0): Promise<SnsMetadata[]>  {
        const aggregatorPageUrl = (page: number) => `list/page/${page}/slow.json`;
        const response = await fetch(`${AGGREGATOR_URL}/${aggregatorPageUrl(page)}`);

        if (!response.ok) {
            if (page > 0) {
                return [];
            }

            throw new Error('Error loading SNS projects from aggregator canister');
        }

        const data = await response.json();
        const filteredMetadata: SnsMetadata[] = data.map((d: any) => ({
            name: d.meta.name,
            logo: d.meta.logo,
            governance_canister_id: d.canister_ids.governance_canister_id,
            root_canister_id: d.canister_ids.root_canister_id,
        }));

        if (data.length === AGGREGATOR_PAGE_SIZE) {
            const nextPageData = await this._fetchSNSMetadata(page + 1);
            return [...filteredMetadata, ...nextPageData];
        }

        return filteredMetadata;
    }
}

export const SnsAggregatorService = new SnsAggregatorServiceClass();    