const KEYCLOAK_HOST = 'http://192.168.0.29:8080';
const REALM = 'espaco-buddy';
const CLIENT_ID = 'espaco-buddy-client';
const CLIENT_SECRET = 'bh3HS75bPGyRCQU53mpBkJd1BHluZici';
const CLIENT_SECRET_ADMIN = 's2vNJ36LVkSFyrwQB6g8WINGBiknRGpC'

export async function loginWithCredentials(email, password) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET); // ✅ necessário para client confidential
    params.append('username', email);
    params.append('password', password);

    const response = await fetch(`${KEYCLOAK_HOST}/realms/${REALM}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    if (!response.ok) {
        return { success: false, message: 'Usuário ou senha inválidos' };
    }

    const data = await response.json();
    return { success: true, token: data.access_token };
}

export async function getAdminToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'admin-cli');
    params.append('client_secret', CLIENT_SECRET_ADMIN); // ✅ adicionado
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

export async function registerNewUser(name, email, password) {
    const token = await getAdminToken();

    // Criar o usuário
    const createUserRes = await fetch(`${KEYCLOAK_HOST}/admin/realms/${REALM}/users`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email,
            email: email,
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

    if (createUserRes.status === 201) {
        return { success: true };
    } else {
        const err = await createUserRes.text();
        return { success: false, message: err };
    }
}