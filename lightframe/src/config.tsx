const configs = import.meta.glob('../config/*.yml', { eager: true, import: 'default' });
const configData = configs[`../config/${import.meta.env.VITE_CONFIG}`];

if (!configData) {
    throw new Error(`Config file not found: ../config/${import.meta.env.VITE_CONFIG} (set VITE_CONFIG in .env)`);
}

export interface Config {
    name: string;
    about: string[];
}

console.log('Loaded config:', configData);

export const config = configData as Config;
export default config;
