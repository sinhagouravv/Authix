import { Request } from 'express';
import { Log } from '../models/Log';
import { UAParser } from 'ua-parser-js';

interface LogData {
  vendorId: string;
  vendorName?: string;
  vendorEmail: string;
  action: string;
  portal?: 'frontend' | 'vendor';
  status: 'SUCCESS' | 'FAILED';
  req: Request;
}

export async function logAction({
  vendorId,
  vendorName,
  vendorEmail,
  action,
  portal = 'frontend',
  status,
  req
}: LogData) {
  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.socket.remoteAddress || 
               'unknown';

    const userAgent = req.headers['user-agent'] || '';
    console.log(`[Logger] User-Agent received: "${userAgent}"`);
    
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const osName = result.os.name || 'Unknown';
    const osVersion = result.os.version || '';
    const os = `${osName} ${osVersion}`.trim();

    const browserName = result.browser.name || 'Unknown';
    const browserVersion = result.browser.version || '';
    const browser = `${browserName} ${browserVersion}`.trim();

    await Log.create({
      vendorId,
      vendorName,
      vendorEmail,
      action,
      portal,
      status,
      ip,
      os,
      browser,
      userAgent
    });
  } catch (error) {
    console.error('Logging error:', error);
  }
}
