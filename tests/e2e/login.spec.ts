import {test,expect} from '@playwright/test';
for(const [label,slug,username,dashboard] of [
 ['Student','student','student','student'],['Mentor','mentor','mentor','mentor'],
 ['Sponsor','sponsor','sponsor','sponsor'],['Convener','convener','convener','coordinator'],['Tutor','tutor','tutor','tutor'],
]){
 test(`${label} has a separate login and opens its workspace`,async({page})=>{
  await page.goto('/');await expect(page.getByRole('link',{name:/portal$/})).toHaveCount(2);if(slug!=='student')await page.getByRole('link',{name:'Staff portal',exact:true}).click();
  await page.getByRole('link',{name:`${label} portal`,exact:true}).click();
  await expect(page).toHaveURL(new RegExp(`/login/${slug}$`));await expect(page.getByRole('heading',{name:`${label} sign in`})).toBeVisible();
  await page.getByRole('button',{name:'Use demonstration',exact:true}).click();await page.getByLabel('Username',{exact:true}).fill(username);await page.getByLabel('Password',{exact:true}).fill('Capstone2026!');await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(page).toHaveURL(new RegExp(`/${dashboard}/overview$`));await expect(page.locator('.portal-label').filter({hasText:`${label} workspace`})).toBeVisible();
  await page.reload();await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
 });
}
test('rejects cross-portal credentials and does not store passwords',async({page})=>{
 await page.goto('/login/student');await page.getByRole('button',{name:'Use demonstration',exact:true}).click();await page.getByLabel('Username',{exact:true}).fill('mentor');await page.getByLabel('Password',{exact:true}).fill('Capstone2026!');await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Username or password');await expect(page).toHaveURL(/\/login\/student$/);
 await page.getByLabel('Username',{exact:true}).fill('student');await page.getByRole('button',{name:'Sign in',exact:true}).click();
 expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}))).not.toContain('Capstone2026!');
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.goto('/student/overview');await expect(page).toHaveURL(/\/login\/student$/);
});
test('login pages fit a mobile screen and legacy account selection cannot sign in',async({page})=>{
 await page.setViewportSize({width:375,height:850});await page.goto('/');await page.evaluate(()=>sessionStorage.setItem('uc-persona','coordinator-1'));
 await page.goto('/coordinator/overview');await expect(page).toHaveURL(/\/login\/convener$/);
 for(const role of ['student','mentor','sponsor','convener','tutor']){
  await page.goto(`/login/${role}`);await expect(page.getByLabel('Username',{exact:true})).toBeVisible();await expect(page.getByLabel('Password',{exact:true})).toHaveAttribute('type','password');
  await expect(page.getByLabel('Password',{exact:true})).toBeInViewport({ratio:1});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});
