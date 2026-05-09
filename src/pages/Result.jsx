import React,{useEffect,useState}from'react';import{supabase}from'../lib/supabase.js';import{requireAuth}from'../lib/auth.js';import*as S from'../styles.js';
export default function Result(){
  const id=window.location.pathname.split('/')[2];
  const[scan,setScan]=useState(null);
  useEffect(()=>{requireAuth(window.location.href);supabase.from('lens_scans').select('*').eq('id',id).single().then(({data})=>setScan(data));},[id]);
  if(!scan)return React.createElement('div',{style:S.page},React.createElement('p',{style:S.muted},'Loading...'));
  return React.createElement('div',{style:S.page},React.createElement('h1',{style:S.h1},'Scan Result'),scan.image_url&&React.createElement('img',{src:scan.image_url,style:{maxWidth:'100%',maxHeight:'400px',objectFit:'contain',borderRadius:'8px',marginBottom:'1.5rem'}}),React.createElement('div',{style:S.card},React.createElement('h2',{style:S.h2},'Analysis'),scan.result&&React.createElement('pre',{style:{...S.muted,whiteSpace:'pre-wrap',fontFamily:'monospace',fontSize:'0.85rem'}},JSON.stringify(scan.result,null,2))));
}