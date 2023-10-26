interface Knex {
    (...args: any[]): any;
    select: (...args: any[]) => any;
    raw: (...args: any[]) => any;
    update: (...args: any[]) => any;
    insert: (...args: any[]) => any;
}
