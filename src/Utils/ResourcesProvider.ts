export class ResourcesProvider {

    public static async fetchUnits(): Promise<any> {
        const cachedHeroes = localStorage.getItem('heroes');

        if (cachedHeroes) {
            return JSON.parse(cachedHeroes);
        };
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
        const collection = (await response.json()).results;
        const result: any[] = [];
        await Promise.all(collection.map(async (item: any) => {

            const itemResult = await (await fetch(item.url)).json();

            result.push(itemResult);
        }));

        const sorted = result.sort((a, b) => a.id - b.id);

        localStorage.setItem('heroes', JSON.stringify(sorted));

        return sorted;
    };
};