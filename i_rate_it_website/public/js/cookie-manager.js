class CookieManager {

    static setCookie(name, value, days = 1, options = {}) {
        const defaults = {
            secure: location.protocol === 'https:', 
            httpOnly: false, 
            sameSite: 'Strict', 
            path: '/'
        };
        
        const settings = { ...defaults, ...options };
        
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        
        let cookieString = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=${settings.path}`;
        
        
        if (settings.secure) {
            cookieString += '; Secure';
        }
        
        if (settings.sameSite) {
            cookieString += `; SameSite=${settings.sameSite}`;
        }
        
        
        if (settings.domain) {
            cookieString += `; Domain=${settings.domain}`;
        }
        
        document.cookie = cookieString;
    }

    static getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    static deleteCookie(name, path = '/', domain = null) {
        let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
        
        if (domain) {
            cookieString += `; Domain=${domain}`;
        }
        
        document.cookie = cookieString;
    }

    static clearAppCookies(cookieNames = ['jwt_token', 'user_data', 'refresh_token']) {
        cookieNames.forEach(name => {
            this.deleteCookie(name);
            this.deleteCookie(name, '/');
            this.deleteCookie(name, '/IRI_LilKartoffel/');
        });
    }

    static setJWTCookie(token, days = 1) {
        this.setCookie('jwt_token', token, days, {
            secure: location.protocol === 'https:',
            sameSite: 'Strict'
        });
    }

    static setUserDataCookie(userData, days = 1) {
        this.setCookie('user_data', JSON.stringify(userData), days, {
            secure: location.protocol === 'https:',
            sameSite: 'Strict'
        });
    }

    static getUserDataFromCookie() {
        const userData = this.getCookie('user_data');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Error parsing user data from cookie:', e);
                this.deleteCookie('user_data');
                return null;
            }
        }
        return null;
    }
}

window.CookieManager = CookieManager;
