export interface IPOC {
    print(text: string): Promise<void>;
}
export class POC implements IPOC {
    print(text: string): Promise<void> {
        console.log('Print:', text);
        return Promise.resolve();
    }
}

const p = new POC();

async function main(): Promise<void> {
    await p.print('This is a POC project.');
}

main();
