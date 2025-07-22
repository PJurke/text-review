import z from "zod"

z.ZodString.prototype.oid = function (message = 'Must be a valid ObjectID.') {
    return this._addCheck({
        kind: 'regex',
        regex: /^[0-9a-fA-F]{24}$/,
        message: message,
  });
}

declare module 'zod' {
    interface ZodString {
        oid(message?: string): ZodString;
    }
}