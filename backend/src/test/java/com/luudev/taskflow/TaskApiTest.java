package com.luudev.taskflow;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import tools.jackson.databind.ObjectMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc
class TaskApiTest {
 @Autowired MockMvc mvc; @Autowired TaskRepository repository; @Autowired ObjectMapper json;
 @BeforeEach void clean(){repository.deleteAll();}
 @Test void crud() throws Exception {
 String body=mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"Learn Docker\",\"description\":\"Compose\",\"completed\":false}")).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
 long id=json.readTree(body).get("id").asLong();
 mvc.perform(get("/api/tasks")).andExpect(jsonPath("$[0].title").value("Learn Docker"));
 mvc.perform(put("/api/tasks/"+id).contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"Done\",\"description\":\"\",\"completed\":true}")).andExpect(status().isOk()).andExpect(jsonPath("$.completed").value(true));
 mvc.perform(delete("/api/tasks/"+id)).andExpect(status().isNoContent());
 mvc.perform(get("/api/tasks")).andExpect(content().json("[]"));
 }
 @Test void rejectsBlankTitle() throws Exception {mvc.perform(post("/api/tasks").contentType(MediaType.APPLICATION_JSON).content("{\"title\":\"  \",\"description\":\"\",\"completed\":false}")).andExpect(status().isBadRequest());}
 @Test void missingTaskReturns404() throws Exception {mvc.perform(delete("/api/tasks/99999")).andExpect(status().isNotFound());}
}
