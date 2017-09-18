export class SagasuEvent {
    public query: any = {};

    constructor(params: any = {}) {
        const { query } = params;

        this.query = query;
    }

    public toJSON(): any {
        return {
            query: this.query
        };
    }
}