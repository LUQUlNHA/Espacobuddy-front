const BASE_URL = "http://192.168.0.29";

export const URLS = {
    list: `${BASE_URL}:5003/api/list`,
    keycloak: `${BASE_URL}:8080`,
    register: `${BASE_URL}:5000/api/register`,
    mqtt_broker: 'ws://192.168.0.29:9001/', // WebSocket!
    mqtt_pub_url: "menu/params/get/espacobuddy",
};

export const KC = {
    realm: "espaco-buddy",
    client_id: "espaco-buddy-client",
    client_secret: '9wYxwmnwjaAUt31lyAZYcyTT6xuz9UIt',
    client_secret_admin: 's2vNJ36LVkSFyrwQB6g8WINGBiknRGpC',
};
