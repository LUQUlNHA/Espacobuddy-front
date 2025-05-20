import * as SecureStore from 'expo-secure-store';
import { URLS, KC } from './enviroment';

// Mudar sempre aqui
const KEYCLOAK_HOST = URLS.keycloak; 
const REALM = KC.realm;
const CLIENT_ID = KC.client_id;
const CLIENT_SECRET = KC.client_secret;
const CLIENT_SECRET_ADMIN = KC.client_secret_admin;

// ----- LOGIN COM CREDENCIAIS -----
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
        return { success: false, message: data.error_description || 'Usuário ou senha inválidos' };
    }

    console.log(await decodeToken(data.access_token));

    await saveInfo("access_token", data.access_token);
    await saveInfo("refresh_token", data.refresh_token);

    return { success: true, token: data.access_token };
}

// ----- DECODIFICAÇÃO DE TOKEN -----
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

// ----- OBTER TOKEN DE ADMIN -----
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

// ----- CADASTRAR USUÁRIO -----
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

// ======= FUNÇÕES DE ARMAZENAMENTO SEGURO =======

export async function saveInfo(KEY, value) {
    try {
        await SecureStore.setItemAsync(KEY, value);
        console.log("Token has been saved!");
    } catch (e) {
        console.error('Erro ao salvar no SecureStore', e);
    }
}

export async function getInfo(KEY) {
    try {
        return await SecureStore.getItemAsync(KEY);
    } catch (e) {
        console.error('Erro ao recuperar do SecureStore', e);
        return null;
    }
}

export async function deleteInfo(KEY) {
    try {
        await SecureStore.deleteItemAsync(KEY);
    } catch (e) {
        console.error('Erro ao deletar do SecureStore', e);
    }
}
