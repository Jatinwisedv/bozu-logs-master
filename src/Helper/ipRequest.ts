import fetch from 'node-fetch';

async function getIPInfoForGivenIP(ip: string) {
    const url = `https://ipinfo.io/${ip}/json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        //console.log(data); 
        return data;
    } catch (error) {
        console.error('Failed to fetch IP information:', (error as Error).message);
        throw error;
    }
}

export default getIPInfoForGivenIP;
