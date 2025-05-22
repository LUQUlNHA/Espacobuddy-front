// Importa o objeto de URLs de ambiente, contendo os endpoints da API
import { URLS } from './enviroment';

/**
 * Função para listar dados de uma tabela via API.
 * Permite passar filtros opcionais via query string.
 *
 * @param {string} tableName - Nome da tabela a ser consultada
 * @param {object} filters - Objeto com filtros (ex: { user_id: 1 })
 * @returns {Promise<object>} - Retorna os dados da API ou lança erro
 */
export async function listTable(tableName, filters = {}) {
    // Cria um objeto para construir a string de query parameters
    const queryParams = new URLSearchParams();

    // Adiciona o nome da tabela como parâmetro obrigatório
    queryParams.append('table_name', tableName);

    // Adiciona os filtros passados dinamicamente
    Object.keys(filters).forEach(key => {
        queryParams.append(key, filters[key]);
    });

    try {
        // Monta a URL final com os parâmetros
        const finalUrl = `${URLS.list}?${queryParams.toString()}`

        // Envia a requisição GET para a API
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Lança erro caso a resposta não seja bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        // Converte a resposta em JSON
        const data = await response.json();

        return data;

    } catch (error) {
        // Exibe erro no console e relança para tratamento externo
        console.error("Erro ao requisitar: ", error);
        throw error;
    }
}

/**
 * Função para cadastrar dados em uma tabela via API.
 *
 * @param {string} tableName - Nome da tabela onde os dados serão inseridos
 * @param {object} fields - Objeto contendo os dados do novo registro
 * @returns {Promise<object>} - Objeto com success e mensagem ou erro
 */
export async function register(tableName, fields) {
    try {
        // Envia a requisição POST para o endpoint de registro
        const response = await fetch(URLS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                table_name: tableName,  // Nome da tabela
                fields: fields          // Dados do registro
            }),
        });

        // Converte a resposta da API
        const result = await response.json();

        // Caso a resposta seja OK (status 2xx), retorna sucesso
        if (response.ok) {
            console.log('Registro feito com sucesso!', result);
            return { success: true, message: 'Registro realizado com sucesso!' };
        } else {
            // Caso contrário, exibe erro e retorna mensagem
            console.error('Erro ao registrar:', result.error);
            return { success: false, error: result.error || 'Erro desconhecido.' };
        }

    } catch (error) {
        // Em caso de falha de rede ou outra exceção
        console.error('Erro ao enviar os dados:', error);
        return { success: false, error: 'Erro ao enviar os dados. Tente novamente mais tarde.' };
    }
}
