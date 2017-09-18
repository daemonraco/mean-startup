import { SagasuField } from '.';

export class SagasuSelectorFieldOption {
    public value: string;
    public title: string;

    constructor(value: string, title: string = null) {
        this.value = value;
        this.title = title ? title : `${this.value.charAt(0).toUpperCase()}${this.value.substring(1)}`;
    }
}
export class SagasuSelectorField extends SagasuField {
    public options: SagasuSelectorFieldOption[] = [];

    public addOption(value: string, title: string = null): void {
        this.options.push(new SagasuSelectorFieldOption(value, title));
    }
}