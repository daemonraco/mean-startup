import { SagasuTextField, SagasuSelectorField } from '.';

export class SagasuField {
    public static get TYPE_SELECTOR(): string { return 'selector'; }
    public static get TYPE_TEXT(): string { return 'text'; }

    public exact: boolean = false;
    public id: string;
    public name: string;
    public placeholder: string = '';
    public title: string;
    public type: string;
    public value: any = '';

    constructor() {
    }

    public clear(): void {
        this.value = '';
    }
    public static create(name: string, type: string = SagasuField.TYPE_TEXT): SagasuField {
        let out;

        switch (type) {
            case SagasuField.TYPE_SELECTOR:
                out = new SagasuSelectorField();
                break;
            case SagasuField.TYPE_TEXT:
            default:
                out = new SagasuTextField();
        }

        out.name = name;
        out.id = out.name;
        out.title = `${out.name.charAt(0).toUpperCase()}${out.name.substring(1)}`;
        out.type = type;
        out.value = '';

        return out;
    }
}
