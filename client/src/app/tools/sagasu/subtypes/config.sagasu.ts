import { SagasuField } from '.';

export class SagasuConfig {
    public submitOnClear: boolean = true;
    public fields: SagasuField[] = [];

    constructor() {
    }

    public addField(field: SagasuField): void {
        this.fields.push(field);
    }
    public clear(): void {
        for (let i in this.fields) {
            this.fields[i].clear();
        }
    }
    public loadValues(data: any = {}): void {
        for (let i in this.fields) {
            const field = this.fields[i];
            if (typeof data[field.name] !== 'undefined') {
                field.value = data[field.name];
            }
        }
    }
    public queryForApi(): any {
        const out = {};

        for (let i in this.fields) {
            const field = this.fields[i];
            if (field.value) {
                if (field.name === '_ANY_') {
                    out['$text'] = { $search: `${field.value}` };
                } else if (field.exact) {
                    out[field.id] = field.value;
                } else {
                    out[field.id] = { $regex: `(${field.value})`, $options: 'i' };
                }
            }
        }

        return out;
    }
    public queryForUrl(): any {
        const query = {};

        for (let i in this.fields) {
            const field = this.fields[i];
            if (field.value) {
                query[field.name] = field.value;
            }
        }

        return query;
    }
}
