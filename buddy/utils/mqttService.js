import * as Paho from 'paho-mqtt';
import { URLS } from './enviroment';

class MqttService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    connect(clientId = `expo-client-${Date.now()}`) {
        return new Promise((resolve, reject) => {
            this.client = new Paho.Client(URLS.mqtt_broker, clientId);

            this.client.onConnectionLost = (response) => {
                console.warn("🔌 Conexão perdida:", response.errorMessage);
                this.isConnected = false;
            };

            this.client.onMessageArrived = (message) => {
                console.log("📩 Mensagem recebida:", message.payloadString);
            };

            this.client.connect({
                onSuccess: () => {
                    console.log("✅ Conectado ao broker MQTT!");
                    this.isConnected = true;
                    resolve();
                },
                onFailure: (err) => {
                    console.error("❌ Falha na conexão:", err.errorMessage);
                    reject(err);
                },
                useSSL: false,
            });
        });
    }

    publish(topic, payload) {
        if (!this.client || !this.isConnected) {
            console.warn("⚠️ Cliente não conectado.");
            return;
        }

        const message = new Paho.Message(JSON.stringify(payload));
        message.destinationName = topic;
        this.client.send(message);
        console.log(`📤 Mensagem publicada em "${topic}":`, payload);
    }

    disconnect() {
        if (this.client && this.isConnected) {
            this.client.disconnect();
            console.log("🔒 Desconectado do broker MQTT.");
            this.isConnected = false;
        }
    }
}

export default new MqttService();
