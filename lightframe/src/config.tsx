const configs = import.meta.glob('../config/*.yml', { eager: true, import: 'default' });
const configData = configs[`../config/${import.meta.env.VITE_CONFIG}`] as RawConfig | undefined;

if (!configData) {
    throw new Error(`Config file not found: ../config/${import.meta.env.VITE_CONFIG} (set VITE_CONFIG in .env)`);
}

const images = import.meta.glob('../config/*.{jpg,jpeg,JPG,JPEG,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

interface Social {
    label: string;
    url: string;
}

interface RawConfig {
    name: string;
    about?: {
        paragraphs?: string[];
        profilePhoto?: string;
        email?: string;
        location?: string;
    };
    socials?: Social[];
    hiddenPages?: string[];
}

export interface Config {
    name: string;
    about: {
        paragraphs?: string[];
        profilePhoto?: string;
        email?: string;
        location?: string;
        socials?: Social[];
    };
    socials: Social[];
    hiddenPages: string[];
}

const rawAbout = configData.about ?? {};

let profilePhoto: string | undefined;
if (rawAbout.profilePhoto) {
    const key = `../config/${rawAbout.profilePhoto}`;
    profilePhoto = images[key];
    if (!profilePhoto) {
        throw new Error(`about.profilePhoto not found: ${rawAbout.profilePhoto} (expected in lightframe/config/)`);
    }
}

export const config: Config = {
    name: configData.name,
    about: {
        paragraphs: rawAbout.paragraphs,
        profilePhoto,
        email: rawAbout.email,
        location: rawAbout.location,
    },
    socials: configData.socials || [],
    hiddenPages: configData.hiddenPages || [],
};
export default config;
