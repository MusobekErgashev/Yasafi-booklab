const crypto = require('crypto');

function parseUserAgent(ua = '') {
    let browser = 'Brauzer';
    let os = "Noma'lum tizim";
    let device_type = 'desktop';

    // Device type
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        device_type = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
        device_type = 'mobile';
    } else {
        device_type = 'desktop';
    }

    // OS detection
    if (/windows phone/i.test(ua)) {
        os = 'Windows Phone';
    } else if (/windows nt 10\.0/i.test(ua)) {
        os = 'Windows 10/11';
    } else if (/windows nt 6\.3/i.test(ua)) {
        os = 'Windows 8.1';
    } else if (/windows nt 6\.2/i.test(ua)) {
        os = 'Windows 8';
    } else if (/windows nt 6\.1/i.test(ua)) {
        os = 'Windows 7';
    } else if (/windows/i.test(ua)) {
        os = 'Windows';
    } else if (/iphone/i.test(ua)) {
        const match = ua.match(/iPhone OS ([0-9_]+)/i);
        os = match ? `iPhone (iOS ${match[1].replace(/_/g, '.')})` : 'iPhone (iOS)';
    } else if (/ipad/i.test(ua)) {
        os = 'iPadOS';
    } else if (/android/i.test(ua)) {
        const match = ua.match(/Android ([0-9\.]+)/i);
        os = match ? `Android ${match[1]}` : 'Android';
    } else if (/macintosh|mac os x/i.test(ua)) {
        os = 'macOS';
    } else if (/cros/i.test(ua)) {
        os = 'Chrome OS';
    } else if (/zorin/i.test(ua)) {
        os = 'Linux (Zorin)';
    } else if (/ubuntu/i.test(ua)) {
        os = 'Linux (Ubuntu)';
    } else if (/linux/i.test(ua)) {
        os = 'Linux';
    }

    // Browser detection
    if (/edg/i.test(ua)) {
        const match = ua.match(/edg\/([0-9]+)/i);
        browser = match ? `Edge ${match[1]}` : 'Edge';
    } else if (/opr\/|opera/i.test(ua)) {
        const match = ua.match(/(?:opr|opera)\/([0-9]+)/i);
        browser = match ? `Opera ${match[1]}` : 'Opera';
    } else if (/chrome|crios/i.test(ua)) {
        const match = ua.match(/(?:chrome|crios)\/([0-9]+)/i);
        browser = match ? `Chrome ${match[1]}` : 'Chrome';
    } else if (/firefox|fxios/i.test(ua)) {
        const match = ua.match(/(?:firefox|fxios)\/([0-9]+)/i);
        browser = match ? `Firefox ${match[1]}` : 'Firefox';
    } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
        const match = ua.match(/version\/([0-9]+)/i);
        browser = match ? `Safari ${match[1]}` : 'Safari';
    }

    return { browser, os, device_type };
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const ip = req.socket?.remoteAddress || req.ip || '127.0.0.1';
    if (ip === '::1' || ip === '::ffff:127.0.0.1') return '127.0.0.1';
    return ip;
}

function getLocationFromIp(ip) {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return 'Toshkent';
    }
    return "O'zbekiston";
}

function generateSessionToken() {
    return crypto.randomUUID();
}

module.exports = {
    parseUserAgent,
    getClientIp,
    getLocationFromIp,
    generateSessionToken
};
