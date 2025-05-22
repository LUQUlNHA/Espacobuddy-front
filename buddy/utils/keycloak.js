import * as SecureStore from 'expo-secure-store';
import { URLS, KC } from './enviroment';

// ==============================
// 🔧 Configurações do Keycloak
// ==============================

/** @constant {string} URL base do Keycloak */
const KEYCLOAK_HOST = URLS.keycloak;

/** @constant {string} Nome do Realm configurado */
const REALM = KC.realm;

/** @constant {string} ID do cliente de autenticação */
const CLIENT_ID = KC.client_id;

/** @constant {string} Segredo do cliente comum */
const CLIENT_SECRET = KC.client_secret;

/** @constant {string} Segredo do cliente admin */
const CLIENT_SECRET_ADMIN = KC.client_secret_admin;

// ===========================================
// 🔐 Autenticação com credenciais (ROPC)
// ===========================================

/**
 * Realiza login usando email e senha (fluxo ROPC).
 * Salva access token e refresh token no armazenamento seguro.
 *
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<{success: boolean, token?: string, message?: string}>}
 */
export async function loginWithCredentials(email, password) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('username', email);
    params.append('password', password);

    const response = await fetch(`${KEYCLOAK_HOST}/realms/${REALM}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            success: false,
            message: data.error_description || 'Usuário ou senha inválidos'
        };
    }

    console.log(await decodeToken(data.access_token));

    await saveInfo("access_token", data.access_token);
    await saveInfo("refresh_token", data.refresh_token);

    return {
        success: true,
        token: data.access_token
    };
}

// ===========================================
// 🔍 Decodificação de Token JWT
// ===========================================

/**
 * Decodifica o payload de um token JWT.
 *
 * @param {string} token - Token JWT completo
 * @returns {Promise<Object|null>} - Objeto decodificado ou null em caso de erro
 */
export async function decodeToken(token) {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson);
    } catch (error) {
        console.error('Erro ao decodificar token!', error);
        return null;
    }
}

// ===========================================
// 🛡️ Obter Token do Admin (admin-cli)
// ===========================================

/**
 * Autentica como administrador no Keycloak para realizar ações protegidas.
 *
 * @returns {Promise<string>} - Access token de administrador
 * @throws {Error} - Se a autenticação falhar
 */
export async function getAdminToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'admin-cli');
    params.append('client_secret', CLIENT_SECRET_ADMIN);
    params.append('username', 'admin');
    params.append('password', 'admin');

    const response = await fetch(`${KEYCLOAK_HOST}/realms/master/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || 'Erro ao obter token do Keycloak');
    }

    return data.access_token;
}

// ===========================================
// 👤 Registro de Novo Usuário
// ===========================================

/**
 * Cria um novo usuário no Keycloak via API admin.
 *
 * @param {string} name - Nome do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha inicial
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function registerNewUser(name, email, password) {
    const token = await getAdminToken();

    const res = await fetch(`${KEYCLOAK_HOST}/admin/realms/${REALM}/users`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email,
            email,
            enabled: true,
            emailVerified: true,
            firstName: name,
            credentials: [
                {
                    type: 'password',
                    value: password,
                    temporary: false,
                },
            ],
        }),
    });

    if (res.status === 201) {
        return { success: true };
    } else {
        const error = await res.text();
        return { success: false, message: error };
    }
}

// ===========================================
// 🔒 Armazenamento Seguro com SecureStore
// ===========================================

/**
 * Salva uma informação de forma segura no dispositivo.
 *
 * @param {string} KEY - Nome da chave
 * @param {string} value - Valor a ser armazenado
 */
export async function saveInfo(KEY, value) {
    try {
        await SecureStore.setItemAsync(KEY, value);
        console.log("Token has been saved!");
    } catch (e) {
        console.error('Erro ao salvar no SecureStore', e);
    }
}

/**
 * Recupera uma informação segura armazenada localmente.
 *
 * @param {string} KEY - Nome da chave
 * @returns {Promise<string|null>} - Valor da chave ou null
 */
export async function getInfo(KEY) {
    try {
        return await SecureStore.getItemAsync(KEY);
    } catch (e) {
        console.error('Erro ao recuperar do SecureStore', e);
        return null;
    }
}

/**
 * Exclui uma chave salva no armazenamento seguro.
 *
 * @param {string} KEY - Nome da chave
 */
export async function deleteInfo(KEY) {
    try {
        await SecureStore.deleteItemAsync(KEY);
    } catch (e) {
        console.error('Erro ao deletar do SecureStore', e);
    }
}
