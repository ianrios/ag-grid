import { IDate, IDateParams } from "@ag-grid-community/core";
import { CustomComponent } from "./customComponent";
import { CustomDateParams, DateMethods } from "./interfaces";

export class DateComponent extends CustomComponent<IDateParams, CustomDateParams, DateMethods> implements IDate {
    private date: Date | null = null;

    public getDate(): Date | null {
        return this.date;
    }

    public setDate(date: Date | null): void {
        this.date = date;
        this.refreshProps();
    }

    public refresh(params: IDateParams): void {
        this.sourceParams = params;
        this.refreshProps();
    }

    protected getOptionalMethods(): string[] {
        return ['afterGuiAttached', 'setInputPlaceholder', 'setInputAriaLabel', 'setDisabled'];
    }

    private updateDate(date: Date | null): void {
        this.setDate(date);
        this.sourceParams.onDateChanged();
    }

    protected getProps(): CustomDateParams {
        const props: CustomDateParams = {
            ...this.sourceParams,
            date: this.date,
            onDateChange: (date: Date | null) => this.updateDate(date),
            key: this.key
        } as any;
        // remove props in IDataParams but not BaseDateParams
        delete (props as any).onDateChanged;
        return props;
    }
}
