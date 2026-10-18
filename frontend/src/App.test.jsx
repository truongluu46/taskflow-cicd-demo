import React from 'react';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import App from './App.jsx';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
beforeEach(()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,status:200,json:async()=>[]}));});
it('creates a task through the API and displays it',async()=>{
 render(<App/>);await screen.findByText('Một khoảng trống để bắt đầu');
 fetch.mockResolvedValueOnce({ok:true,status:201,json:async()=>({id:1,title:'Học Docker',description:'',completed:false})});
 fireEvent.change(screen.getByLabelText('Tên công việc'),{target:{value:'Học Docker'}});
 fireEvent.click(screen.getByText('+ Thêm công việc'));
 expect(await screen.findByText('Học Docker')).toBeInTheDocument();
 expect(fetch).toHaveBeenLastCalledWith('/api/tasks',expect.objectContaining({method:'POST',body:JSON.stringify({title:'Học Docker',description:'',completed:false})}));
});
it('shows network errors',async()=>{fetch.mockRejectedValueOnce(new Error('offline'));render(<App/>);expect(await screen.findByRole('alert')).toHaveTextContent('Không kết nối được API');});
it('filters completed tasks',async()=>{fetch.mockResolvedValueOnce({ok:true,status:200,json:async()=>[{id:1,title:'Finished',description:'',completed:true},{id:2,title:'Pending',description:'',completed:false}]});render(<App/>);await screen.findByText('Finished');fireEvent.click(screen.getByRole('button',{name:'Đang làm'}));expect(screen.queryByText('Finished')).not.toBeInTheDocument();expect(screen.getByText('Pending')).toBeInTheDocument();});
