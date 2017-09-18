export class PaginatorEvent {
    public page: number;
    public limit: number;
    public skip: number;

    constructor(params: any = {}) {
        const { page, limit, skip } = params;

        this.page = page;
        this.limit = limit;
        this.skip = skip;
    }

    public toJSONForApi(): any {
        return {
            limit: this.limit,
            skip: this.skip
        };
    }
    public toJSON(): any {
        return {
            page: this.page,
            limit: this.limit,
            skip: this.skip
        };
    }
}