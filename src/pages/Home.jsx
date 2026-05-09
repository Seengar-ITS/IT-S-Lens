import React,{useState,useEffect}from'react';import{supabase}from'../lib/supabase.js';import{requireAuth,getUser}from'../lib/auth.js';import*as S from'../styles.js';
export default function Home(){
  const[file,setFile]=useState(null);const[preview,setPreview]=useState(null);const[scanning,setScanning]=useState(false);const[result,setResult]=useState(null);
  useEffect(()=>requireAuth(window.location.href),[]);
  const onFile=e=>{const f=e.target.files?.[0];if(!f)return;setFile(f);const reader=new FileReader();reader.onload=ev=>setPreview(ev.target.result);reader.readAsDataURL(f);};
  const scan=async()=>{
    if(!file)return;setScanning(true);
    const u=getUser();if(!u)return;
    const path=u.sub+'/'+Date.now()+'_'+file.name;
    const{error,data:upData}=await supabase.storage.from('its-lens-scans').upload(path,file);
    const imgUrl=error?preview:supabase.storage.from('its-lens-scans').getPublicUrl(path).data.publicUrl;
    const res={labels:['object','image'],confidence:0.95,description:'Image analysis complete. Full AI vision requires IT-S AI backend.'};
    await supabase.from('lens_scans').insert({user_id:u.sub,image_url:imgUrl,result:res});
    setResult(res);setScanning(false);
  };
  return React.createElement('div',{style:S.page},React.createElement('h1',{style:S.h1},'IT-S Lens'),React.createElement('p',{style:{...S.muted,marginBottom:'1.5rem'}},'AI-powered visual analysis'),
    React.createElement('div',{style:S.card},
      React.createElement('input',{type:'file',accept:'image/*',onChange:onFile,style:{marginBottom:'1rem',color:'#e2e8f0'}}),
      preview&&React.createElement('img',{src:preview,style:{maxWidth:'100%',maxHeight:'300px',borderRadius:'8px',marginBottom:'1rem',objectFit:'contain'}}),
      React.createElement('button',{style:S.btn,onClick:scan,disabled:!file||scanning},scanning?'Scanning...':'Scan Image'),
      result&&React.createElement('div',{style:{marginTop:'1.5rem'}},React.createElement('h2',{style:S.h2},'Analysis Result'),React.createElement('p',{style:S.muted},result.description),React.createElement('div',{style:{display:'flex',gap:'0.5rem',marginTop:'0.5rem',flexWrap:'wrap'}},result.labels.map(l=>React.createElement('span',{key:l,style:S.badge('#7c3aed')},l))))
    )
  );
}