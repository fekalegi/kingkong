import crypto from 'crypto';

export async function hash(req) {
    const hashed = crypto.createHash('md5').update(req).digest('hex');
    
    return hashed;
  }