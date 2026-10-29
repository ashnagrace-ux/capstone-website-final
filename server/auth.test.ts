// @vitest-environment node
import {it,expect,vi} from 'vitest';
import {authReady,authenticationAction,sameOrigin} from './auth';
it('fails closed without a provider and rejects requests from another origin',async()=>{
 const env:any={DB:{},BUCKET:{}};expect(authReady(env)).toBe(false);
 const r=await authenticationAction(new Request('https://example.com/api/auth/login',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'}),env,'login');expect(r.status).toBe(503);expect((await r.json() as any).ok).toBe(false);
 expect(sameOrigin(new Request('https://example.com/api/command',{headers:{Origin:'https://evil.example'}}))).toBe(false);
});
it('checks duplicate username before creating an authentication identity',async()=>{
 const fetchMock=vi.fn(async()=>new Response('{"error":"unavailable"}',{status:500,headers:{'Content-Type':'application/json'}}));vi.stubGlobal('fetch',fetchMock);
 try{const env:any={SUPABASE_URL:'https://auth.example',SUPABASE_PUBLISHABLE_KEY:'test-publishable-key',DB:{prepare:()=>({bind:()=>({first:async()=>({id:'existing'})})})},BUCKET:{}};
 const response=await authenticationAction(new Request('https://capstone.example/api/auth/register',{method:'POST',headers:{Origin:'https://capstone.example','Content-Type':'application/json'},body:JSON.stringify({name:'New Person',username:'taken-name',email:'new@example.edu',password:'A-long-test-password',role:'student'})}),env,'register');expect(response.status).toBe(409);expect(fetchMock).not.toHaveBeenCalled();
 }finally{vi.unstubAllGlobals();}
});
