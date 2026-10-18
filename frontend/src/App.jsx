import React, {useEffect, useState} from 'react';
const empty={title:'',description:'',completed:false};
async function request(path='',options={}) {
 const res=await fetch('/api/tasks'+path,{...options,headers:{'Content-Type':'application/json'}});
 if(!res.ok) throw new Error(res.status===400?'Dữ liệu không hợp lệ. Kiểm tra tiêu đề và mô tả.':'Không thể xử lý yêu cầu. Hãy thử lại.');
 return res.status===204?null:res.json();
}
export default function App(){
 const [tasks,setTasks]=useState([]),[form,setForm]=useState(empty),[editing,setEditing]=useState(null),[filter,setFilter]=useState('all'),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{request().then(setTasks).catch(()=>setError('Không kết nối được API. Kiểm tra backend.')).finally(()=>setLoading(false));},[]);
 async function action(fn){setBusy(true);setError('');try{await fn();}catch(e){setError(e.message);}finally{setBusy(false);}}
 function save(e){e.preventDefault();action(async()=>{const saved=await request(editing?'/'+editing:'',{method:editing?'PUT':'POST',body:JSON.stringify(form)});setTasks(old=>editing?old.map(t=>t.id===editing?saved:t):[saved,...old]);setForm(empty);setEditing(null);});}
 const done=tasks.filter(t=>t.completed).length;
 const shown=tasks.filter(t=>filter==='all'||(filter==='done'?t.completed:!t.completed));
 return <main><header><a className="brand" href="/">◈ TaskFlow</a><span>KHÔNG GIAN LÀM VIỆC CÁ NHÂN</span></header>
 <section className="intro"><p className="eyebrow">MỖI NGÀY, MỘT BƯỚC TIẾN</p><h1>Ít bộn bề.<br/><em>Nhiều tập trung.</em></h1><p>Sắp xếp việc cần làm, dành chỗ cho những điều quan trọng.</p></section>
 <div className="stats"><div><strong>{tasks.length}</strong><span>Tổng công việc</span></div><div><strong>{tasks.length-done}</strong><span>Đang thực hiện</span></div><div><strong>{done}</strong><span>Đã hoàn thành</span></div></div>
 {error&&<div role="alert" className="error">{error}</div>}
 <div className="workspace"><section className="panel form"><h2>{editing?'Sửa công việc':'Thêm một mục tiêu'}</h2><p>Bắt đầu từ một việc nhỏ.</p><form onSubmit={save}><label htmlFor="title">Tên công việc</label><input id="title" required maxLength={120} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Hôm nay bạn muốn làm gì?"/><label htmlFor="description">Ghi chú</label><textarea id="description" maxLength={1000} rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Thêm một chút chi tiết…"/><button className="primary" disabled={busy||loading||!form.title.trim()}>{busy?'Đang lưu…':editing?'Lưu thay đổi':'+ Thêm công việc'}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(empty);}}>Hủy sửa</button>}</form></section>
 <section className="panel list"><div className="list-head"><h2>Công việc của bạn</h2><span>{shown.length} mục</span></div><nav aria-label="Lọc công việc">{[['all','Tất cả'],['active','Đang làm'],['done','Hoàn thành']].map(([key,label])=><button key={key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{label}</button>)}</nav>
 {loading?<p role="status">Đang tải công việc…</p>:shown.length===0?<div className="empty"><span>✧</span><h3>Một khoảng trống để bắt đầu</h3><p>Chưa có công việc trong danh sách này.</p></div>:<ul>{shown.map(task=><li key={task.id}><input aria-label={'Hoàn thành '+task.title} type="checkbox" checked={task.completed} disabled={busy} onChange={()=>action(async()=>{const saved=await request('/'+task.id,{method:'PUT',body:JSON.stringify({...task,completed:!task.completed})});setTasks(old=>old.map(t=>t.id===task.id?saved:t));})}/><div className={task.completed?'done':''}><h3>{task.title}</h3><p>{task.description}</p></div><div className="tools"><button disabled={busy} onClick={()=>{setEditing(task.id);setForm({title:task.title,description:task.description,completed:task.completed});}}>Sửa</button><button disabled={busy} onClick={()=>{if(window.confirm('Xóa công việc này?'))action(async()=>{await request('/'+task.id,{method:'DELETE'});setTasks(old=>old.filter(t=>t.id!==task.id));if(editing===task.id){setEditing(null);setForm(empty);}});}}>Xóa</button></div></li>)}</ul>}</section></div><footer>TaskFlow · Làm từng việc, tiến từng bước.</footer></main>;
}
