// Define o endereço base da API e Keycloak (geralmente o IP local da máquina onde o backend está rodando)
const BASE_URL = "http://192.168.0.29"  // ⚠️ Lembre-se de trocar para o IP real ou usar variáveis de ambiente em produção

// Objeto que armazena todas as URLs dos serviços da aplicação
export const URLS = {
    // Endpoint para listagem de dados com filtros
    list: `${BASE_URL}:5003/api/list`,

    // URL base do Keycloak (painel de administração e autenticação)
    keycloak: `${BASE_URL}:8080`, // URL do servidor Keycloak

    // Endpoint para inserção de dados genérica
    register: `${BASE_URL}:5000/api/register`
}

// Objeto com configurações do cliente Keycloak utilizado no app
export const KC = {
    // Nome do realm configurado no Keycloak
    realm: "espaco-buddy",

    // ID do cliente configurado no Keycloak (deve estar habilitado para "Confidential" ou "Public")
    client_id: "espaco-buddy-client",

    // Segredo do cliente padrão (para login dos usuários via client_credentials ou ROPC)
    client_secret: '9wYxwmnwjaAUt31lyAZYcyTT6xuz9UIt',

    // Segredo do cliente de administração (normalmente usado por backends com permissão total)
    client_secret_admin: 's2vNJ36LVkSFyrwQB6g8WINGBiknRGpC',
}
