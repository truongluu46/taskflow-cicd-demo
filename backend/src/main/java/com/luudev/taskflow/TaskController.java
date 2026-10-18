package com.luudev.taskflow;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/tasks")
public class TaskController {
 private final TaskRepository repository;
 public TaskController(TaskRepository repository){
  this.repository=repository;
 }

 public record TaskInput(@NotBlank @Size(max=120) String title,@NotNull @Size(max=1000) String description,@NotNull Boolean completed){}
 @GetMapping
 public List<Task> list(){
  return repository.findAll(Sort.by(Sort.Direction.DESC,"id"));
 }

 @PostMapping
 @ResponseStatus(HttpStatus.CREATED)
 public Task create(@Valid @RequestBody TaskInput input){
  return repository.save(new Task(input.title(),input.description(),input.completed()));
 }

 @PutMapping("/{id}")
 public Task update(@PathVariable Long id,@Valid @RequestBody TaskInput input){
  Task task=find(id);
  task.update(input.title(),input.description(),input.completed());
  return repository.save(task);
 }

 @DeleteMapping("/{id}")
 @ResponseStatus(HttpStatus.NO_CONTENT)
 public void delete(@PathVariable Long id){
  repository.delete(find(id));
 }
 private Task find(Long id){
  return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found"));
 }
}
