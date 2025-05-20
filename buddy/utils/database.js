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

export async function register(tableName, fields) {
    try {
        const response = await fetch(URLS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table_name: tableName,
                fields: fields,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Registro feito com sucesso!', result);
            return { success: true, message: 'Registro realizado com sucesso!' };
        } else {
            console.error('Erro ao registrar:', result.error);
            return { success: false, error: result.error || 'Erro desconhecido.' };
        }

    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        return { success: false, error: 'Erro ao enviar os dados. Tente novamente mais tarde.' };
    }
}