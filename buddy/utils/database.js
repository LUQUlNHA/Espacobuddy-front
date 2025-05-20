import { URLS } from './enviroment';

export async function listTable(tableName, filters = {}) {
    // Construir parametros de consulta pro filtro
    const queryParams = new URLSearchParams();
    queryParams.append('table_name', tableName);

    Object.keys(filters).forEach(key => {
        queryParams.append(key, filters[key]);
    });

    try {
        // Requisitar a API
        const finalUrl = `${URLS.list}?${queryParams.toString()}`
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Erro ao requisitar: ", error);
        throw error;
    }
}