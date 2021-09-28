export declare type ErrorResult<TValue = undefined> = TValue extends undefined ? {
    success: false;
    error?: string;
} : {
    success: false;
    error?: string;
    value: TValue;
};
export declare type SuccessResult<TValue = undefined> = TValue extends undefined ? {
    success: true;
} : {
    success: true;
    value: TValue;
};
export declare type SuccessOrErrorResult<TValue = undefined, TErrorValue = undefined> = SuccessResult<TValue> | ErrorResult<TErrorValue>;
export declare function isSuccess<TValue, TErrorValue>(result: SuccessOrErrorResult<TValue, TErrorValue>): result is SuccessResult<TValue>;
export declare function isError<TValue, TErrorValue>(result: SuccessOrErrorResult<TValue, TErrorValue>): result is ErrorResult<TErrorValue>;
export declare function successResult(): SuccessResult;
export declare function successValueResult<TValue>(value: TValue): SuccessResult<TValue>;
export declare function errorResult(error?: string): ErrorResult;
export declare function errorValueResult<TErrorValue>(value: TErrorValue, error?: string): ErrorResult<TErrorValue>;
//# sourceMappingURL=result.d.ts.map