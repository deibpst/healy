import { GOOGLE_CONFIG } from '../config/google';


export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  description?: string;
  colorId?: string;
}

/**
 * ======== Tipos mínimos para gapi.client (Calendar) ========
 */

interface GapiCalendarEventResource {
  id?: string;
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string;
  [key: string]: unknown;
}

interface GapiCalendarEvents {
  list(params: {
    calendarId: string;
    timeMin: string;
    timeMax: string;
    showDeleted: boolean;
    singleEvents: boolean;
    orderBy: string;
  }): Promise<{ result: { items?: GapiCalendarEventResource[] } }>;

  insert(params: {
    calendarId: string;
    resource: GapiCalendarEventResource;
  }): Promise<{ result: GapiCalendarEventResource }>;

  update(params: {
    calendarId: string;
    eventId: string;
    resource: GapiCalendarEventResource;
  }): Promise<{ result: GapiCalendarEventResource }>;

  get(params: {
    calendarId: string;
    eventId: string;
  }): Promise<{ result: GapiCalendarEventResource }>;

  delete(params: { calendarId: string; eventId: string }): Promise<unknown>;
}

interface GapiClientCalendar {
  events: GapiCalendarEvents;
}

interface GapiClient {
  init(config: {
    apiKey: string;
    discoveryDocs: string[];
  }): Promise<void>;
  calendar: GapiClientCalendar;
  setToken(token: { access_token: string } | null): void;
}

interface MyGapi {
  load(api: 'client', callback: () => void): void;
  client: GapiClient;
}

/**
 * ======== Tipos mínimos para Google Identity Services (GIS) ========
 */

interface GISTokenResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
}

interface GISTokenClient {
  callback: (response: GISTokenResponse) => void;
  requestAccessToken(options?: { prompt?: 'consent' | 'none' }): void;
}

interface GoogleAccountsOAuth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: GISTokenResponse) => void;
  }): GISTokenClient;

  revoke(token: string, done: () => void): void;
}

interface GoogleIdentityServices {
  accounts: {
    oauth2: GoogleAccountsOAuth2;
  };
}

interface WindowWithApis extends Window {
  gapi: MyGapi;
  google: GoogleIdentityServices;
}

/**
 * ======== Servicio ========
 */

class GoogleCalendarService {
  private gapi: MyGapi | null = null;
  private googleIdentity: GoogleIdentityServices | null = null;
  private tokenClient: GISTokenClient | null = null;
  private accessToken: string | null = null;
  private isInitialized = false;

  /**
   * Carga los scripts de gapi y GIS y prepara gapi.client y el tokenClient
   */
  async init() {
    if (this.isInitialized) return;

    try {
      console.log('🧩 GOOGLE_CONFIG en init():', GOOGLE_CONFIG);

      // 1) Cargar gapi.js
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Script gapi.js cargado');
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Error cargando https://apis.google.com/js/api.js'));
        };
        document.body.appendChild(script);
      });

      // 2) Cargar Google Identity Services (GIS)
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('✅ Script Google Identity Services cargado');
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Error cargando https://accounts.google.com/gsi/client'));
        };
        document.body.appendChild(script);
      });

      const win = window as unknown as WindowWithApis;
this.gapi = win.gapi;
this.googleIdentity = win.google;

      console.log('🧠 this.gapi después de load:', this.gapi);

      // 3) Inicializar gapi.client (solo API, sin auth)
      await new Promise<void>((resolve) => {
        this.gapi!.load('client', () => {
          console.log('✅ gapi.load("client") completado');
          resolve();
        });
      });

      console.log('⏳ Llamando a gapi.client.init...');
      await this.gapi!.client.init({
        apiKey: GOOGLE_CONFIG.apiKey,
        discoveryDocs: GOOGLE_CONFIG.discoveryDocs,
      });
      console.log('✅ gapi.client.init OK');

      // 4) Crear el tokenClient de GIS para obtener access tokens
      this.tokenClient = this.googleIdentity!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scopes,
        callback: (tokenResponse: GISTokenResponse) => {
          if (tokenResponse.error) {
            console.error('❌ Error en tokenClient callback:', tokenResponse.error);
            return;
          }

          if (tokenResponse.access_token) {
            console.log('🔐 Access token recibido');
            this.accessToken = tokenResponse.access_token;
            this.gapi!.client.setToken({ access_token: tokenResponse.access_token });
          }
        },
      });

      this.isInitialized = true;
    } catch (err: unknown) {
      console.error('❌ Error en GoogleCalendarService.init():', err);
      throw err;
    }
  }

  /**
   * Abre el flujo de consentimiento de Google para obtener un access token
   */
  async signIn() {
    await this.init();

    if (!this.tokenClient) {
      throw new Error('Token client no inicializado');
    }

    return new Promise<void>((resolve, reject) => {
      // redefinimos callback para esta petición concreta
      this.tokenClient!.callback = (tokenResponse: GISTokenResponse) => {
        if (tokenResponse.error) {
          console.error('❌ Error en tokenClient (signIn):', tokenResponse.error);
          reject(new Error(tokenResponse.error));
          return;
        }

        if (tokenResponse.access_token) {
          console.log('🔐 Access token recibido en signIn');
          this.accessToken = tokenResponse.access_token;
          this.gapi!.client.setToken({ access_token: tokenResponse.access_token });
        }

        resolve();
      };

      try {
        this.tokenClient!.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Revoca el token y limpia el estado local
   */
  async signOut() {
    await this.init();

    if (!this.accessToken || !this.googleIdentity) {
      return;
    }

    const tokenToRevoke = this.accessToken;

    await new Promise<void>((resolve) => {
      this.googleIdentity!.accounts.oauth2.revoke(tokenToRevoke, () => {
        console.log('🔓 Token revocado');
        resolve();
      });
    });

    this.accessToken = null;

    if (this.gapi) {
      this.gapi.client.setToken(null);
    }
  }

  isSignedIn() {
    return this.accessToken !== null;
  }

  /**
   * Asegura que haya token antes de hacer llamadas a Calendar
   */
  private ensureAuthenticated() {
    if (!this.gapi) {
      throw new Error('gapi no inicializado');
    }
    if (!this.accessToken) {
      throw new Error('Usuario no autenticado');
    }
  }

  async getEvents(timeMin: string, timeMax: string): Promise<GoogleCalendarEvent[]> {
    await this.init();
    this.ensureAuthenticated();

    const response = await this.gapi!.client.calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const items = response.result.items ?? [];

    return items.map((item) => ({
      id: item.id ?? '',
      summary: item.summary ?? '',
      description: item.description,
      start: {
        dateTime: item.start?.dateTime,
        date: item.start?.date,
      },
      end: {
        dateTime: item.end?.dateTime,
        date: item.end?.date,
      },
      colorId: item.colorId,
    }));
  }

  async createEvent(event: {
    summary: string;
    description?: string;
    start: string;
    end: string;
  }) {
    await this.init();
    this.ensureAuthenticated();

    const response = await this.gapi!.client.calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Mexico_City',
        },
      },
    });

    return response.result;
  }

  async updateEvent(
    eventId: string,
    updates: {
      summary?: string;
      description?: string;
      start?: string;
      end?: string;
    },
  ) {
    await this.init();
    this.ensureAuthenticated();

    const event = await this.gapi!.client.calendar.events.get({
      calendarId: 'primary',
      eventId,
    });

    const updatedEvent: GapiCalendarEventResource = {
      ...event.result,
    };

    if (updates.summary) updatedEvent.summary = updates.summary;
    if (updates.description) updatedEvent.description = updates.description;

    if (updates.start) {
      updatedEvent.start = {
        ...(updatedEvent.start ?? {}),
        dateTime: updates.start,
        timeZone: 'America/Mexico_City',
      };
    }

    if (updates.end) {
      updatedEvent.end = {
        ...(updatedEvent.end ?? {}),
        dateTime: updates.end,
        timeZone: 'America/Mexico_City',
      };
    }

    const response = await this.gapi!.client.calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: updatedEvent,
    });

    return response.result;
  }

  async deleteEvent(eventId: string) {
    await this.init();
    this.ensureAuthenticated();

    await this.gapi!.client.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }
}

export const googleCalendarService = new GoogleCalendarService();
