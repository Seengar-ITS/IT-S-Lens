export const getToken=()=>localStorage.getItem('its-id-token');
export const getUser=()=>{const t=getToken();if(!t)return null;try{return JSON.parse(atob(t.split('.')[1]));}catch{return null;}};
export const requireAuth=url=>{if(!getToken()){window.location.href=(import.meta.env.VITE_ITS_ID_URL||'https://it-s-id.vercel.app')+'/login?redirect='+encodeURIComponent(url);return false;}return true;};
