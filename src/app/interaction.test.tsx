import { render,screen,within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {it,expect} from 'vitest';
import App from './App';
it('enters student project browsing and preserves a ranked selection',async()=>{
 const user=userEvent.setup();render(<App/>);
 await user.click(screen.getByRole('link',{name:'Student portal'}));
 await user.click(screen.getByRole('button',{name:'Use demonstration'}));
 await user.type(screen.getByLabelText('Username'), 'student');
 await user.type(screen.getByLabelText('Password',{exact:true}), 'Capstone2026!');
 await user.click(screen.getByRole('button',{name:'Sign in'}));
 await user.click(within(await screen.findByRole('navigation',{name:'Main navigation'})).getByRole('link',{name:'Explore projects'}));
 expect(screen.getByRole('heading',{name:'Find your next big idea.'})).toBeVisible();
 await user.click(screen.getAllByRole('button',{name:/Add to preferences/i})[0]);
 await user.click(screen.getByRole('link',{name:'My preferences'}));
 expect(screen.getByRole('heading',{name:'Make your case.'})).toBeVisible();
 expect(screen.getByText('1st preference')).toBeVisible();
});
it('shows a useful error for credentials from a different portal',async()=>{
 const user=userEvent.setup();render(<App/>);
 await user.click(screen.getByRole('link',{name:'Student portal'}));
 await user.click(screen.getByRole('button',{name:'Use demonstration'}));
 await user.type(screen.getByLabelText('Username'),'mentor');await user.type(screen.getByLabelText('Password',{exact:true}),'Capstone2026!');await user.click(screen.getByRole('button',{name:'Sign in'}));
 expect(screen.getByRole('alert')).toHaveTextContent(/username or password/i);expect(screen.queryByRole('navigation',{name:'Main navigation'})).not.toBeInTheDocument();
});
it('signs out and requires credentials to return to a dashboard',async()=>{
 const user=userEvent.setup();render(<App/>);await user.click(screen.getByRole('link',{name:'Staff portal'}));await user.click(screen.getByRole('link',{name:'Convener portal'}));
 await user.click(screen.getByRole('button',{name:'Use demonstration'}));
 await user.type(screen.getByLabelText('Username'),'convener');await user.type(screen.getByLabelText('Password',{exact:true}),'Capstone2026!');await user.click(screen.getByRole('button',{name:'Sign in'}));
 expect(await screen.findByText('Convener workspace')).toBeVisible();await user.click(screen.getByRole('button',{name:'Sign out'}));
 expect(screen.getByRole('heading',{name:'Convener sign in'})).toBeVisible();expect(sessionStorage.getItem('uc-demo-session')).toBeNull();expect(screen.queryByRole('navigation',{name:'Main navigation'})).not.toBeInTheDocument();
});
