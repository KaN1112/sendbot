const windows=new Map<string,number[]>();
export function allowRequest(key:string,limit=5,windowMs=10_000){const now=Date.now();const recent=(windows.get(key)??[]).filter(t=>t>now-windowMs);if(recent.length>=limit)return false;recent.push(now);windows.set(key,recent);return true;}
